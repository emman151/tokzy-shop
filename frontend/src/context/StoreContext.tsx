import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type {
  CheckoutDetails,
  IntegrationActionLog,
  IntegrationProvider,
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  Product,
  User,
} from '../types'
import {
  initialIntegrations,
  initialOrders,
  initialPayments,
  initialProducts,
  initialUsers,
  integrationActionLogs,
} from '../data/mockData'

interface CartStateItem {
  productId: string
  quantity: number
}

interface StoreState {
  products: Product[]
  cart: CartStateItem[]
  orders: Order[]
  users: User[]
  payments: Payment[]
  integrations: IntegrationProvider[]
  integrationLogs: IntegrationActionLog[]
}

type StoreAction =
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPSERT_PRODUCT'; payload: { product: Product } }
  | { type: 'DELETE_PRODUCT'; payload: { productId: string } }
  | { type: 'CREATE_ORDER'; payload: { order: Order; payment: Payment; log?: IntegrationActionLog } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'UPDATE_PAYMENT_STATUS'; payload: { paymentId: string; status: PaymentStatus } }
  | { type: 'UPSERT_INTEGRATION'; payload: { provider: IntegrationProvider } }
  | { type: 'UPDATE_INTEGRATION_STATUS'; payload: { providerId: string; status: IntegrationProvider['status']; log?: IntegrationActionLog } }
  | { type: 'ADD_INTEGRATION_LOG'; payload: { log: IntegrationActionLog } }
  | { type: 'UPDATE_USER'; payload: { user: User } }

const initialState: StoreState = {
  products: initialProducts,
  cart: [],
  orders: initialOrders,
  users: initialUsers,
  payments: initialPayments,
  integrations: initialIntegrations,
  integrationLogs: integrationActionLogs,
}

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, quantity } = action.payload
      const existing = state.cart.find((item) => item.productId === productId)
      let updatedCart: CartStateItem[]
      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
            : item,
        )
      } else {
        updatedCart = [...state.cart, { productId, quantity }]
      }
      return { ...state, cart: updatedCart }
    }
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload
      return { ...state, cart: state.cart.filter((item) => item.productId !== productId) }
    }
    case 'UPDATE_CART_QUANTITY': {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => item.productId !== productId) }
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.min(quantity, 10) } : item,
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'UPSERT_PRODUCT': {
      const {
        payload: { product },
      } = action
      const exists = state.products.some((item) => item.id === product.id)
      const products = exists
        ? state.products.map((item) => (item.id === product.id ? product : item))
        : [product, ...state.products]
      return { ...state, products }
    }
    case 'DELETE_PRODUCT': {
      const {
        payload: { productId },
      } = action
      return {
        ...state,
        products: state.products.filter((product) => product.id !== productId),
        cart: state.cart.filter((item) => item.productId !== productId),
      }
    }
    case 'CREATE_ORDER': {
      const {
        payload: { order, payment, log },
      } = action
      return {
        ...state,
        orders: [order, ...state.orders],
        payments: [payment, ...state.payments],
        cart: [],
        integrationLogs: log ? [log, ...state.integrationLogs] : state.integrationLogs,
      }
    }
    case 'UPDATE_ORDER_STATUS': {
      const {
        payload: { orderId, status },
      } = action
      return {
        ...state,
        orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      }
    }
    case 'UPDATE_PAYMENT_STATUS': {
      const {
        payload: { paymentId, status },
      } = action
      const now = new Date().toISOString()
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status, updatedAt: now } : payment,
        ),
      }
    }
    case 'UPSERT_INTEGRATION': {
      const {
        payload: { provider },
      } = action
      const exists = state.integrations.some((item) => item.id === provider.id)
      const integrations = exists
        ? state.integrations.map((item) => (item.id === provider.id ? provider : item))
        : [...state.integrations, provider]
      return { ...state, integrations }
    }
    case 'UPDATE_INTEGRATION_STATUS': {
      const {
        payload: { providerId, status, log },
      } = action
      const integrations = state.integrations.map((integration) =>
        integration.id === providerId
          ? { ...integration, status, lastSync: new Date().toISOString() }
          : integration,
      )
      return {
        ...state,
        integrations,
        integrationLogs: log ? [log, ...state.integrationLogs] : state.integrationLogs,
      }
    }
    case 'ADD_INTEGRATION_LOG': {
      const {
        payload: { log },
      } = action
      return { ...state, integrationLogs: [log, ...state.integrationLogs] }
    }
    case 'UPDATE_USER': {
      const {
        payload: { user },
      } = action
      const exists = state.users.some((item) => item.id === user.id)
      const users = exists
        ? state.users.map((item) => (item.id === user.id ? user : item))
        : [...state.users, user]
      return { ...state, users }
    }
    default:
      return state
  }
}

interface StoreContextValue {
  state: StoreState
  actions: {
    addToCart: (productId: string, quantity?: number) => void
    updateCartQuantity: (productId: string, quantity: number) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void
    checkout: (details: CheckoutDetails) => { orderId: string; paymentId: string } | null
    upsertProduct: (product: Product) => void
    deleteProduct: (productId: string) => void
    updateOrderStatus: (orderId: string, status: OrderStatus) => void
    updatePaymentStatus: (paymentId: string, status: PaymentStatus) => void
    upsertIntegration: (provider: IntegrationProvider) => void
    updateIntegrationStatus: (providerId: string, status: IntegrationProvider['status']) => void
    logIntegrationAction: (log: IntegrationActionLog) => void
    triggerIntegrationSync: (providerId: string) => void
    updateUser: (user: User) => void
  }
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

const generateId = (prefix: string) => {
  const random = Math.floor(Math.random() * 1000)
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${random}`
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  const actions = useMemo<StoreContextValue['actions']>(
    () => ({
      addToCart: (productId, quantity = 1) => {
        dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } })
      },
      updateCartQuantity: (productId, quantity) => {
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } })
      },
      removeFromCart: (productId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } })
      },
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      checkout: (details) => {
        if (!state.cart.length) {
          return null
        }
        const items = state.cart
          .map((cartItem) => {
            const product = state.products.find((p) => p.id === cartItem.productId)
            if (!product) {
              return null
            }
            return {
              product,
              quantity: cartItem.quantity,
            }
          })
          .filter((item): item is { product: Product; quantity: number } => Boolean(item))

        if (!items.length) {
          return null
        }

        const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        const orderId = generateId('ORD')
        const paymentId = generateId('PAY')

        const order: Order = {
          id: orderId,
          userId: 'GUEST',
          playerId: details.playerId,
          game: details.game,
          total: Number(total.toFixed(2)),
          currency: items[0]?.product.currency ?? 'USD',
          status: 'created',
          paymentMethod: `${details.paymentMethod} · ${details.paymentChannel}`,
          createdAt: new Date().toISOString(),
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          notes: details.notes,
          region: details.region,
          autoDelivery: details.autoDelivery,
        }

        const payment: Payment = {
          id: paymentId,
          orderId,
          provider: details.paymentMethod,
          channel: details.paymentChannel,
          amount: Number(total.toFixed(2)),
          currency: order.currency,
          status: 'pending',
          transactionId: generateId('TXN'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          riskLevel: 'medium',
        }

        const log: IntegrationActionLog = {
          id: generateId('LOG'),
          providerId: 'checkout',
          type: 'topup',
          status: 'queued',
          createdAt: new Date().toISOString(),
          details: `Checkout started for ${details.game} and player ${details.playerId}. Amount ${order.total} ${order.currency}.`,
        }

        dispatch({ type: 'CREATE_ORDER', payload: { order, payment, log } })

        return { orderId, paymentId }
      },
      upsertProduct: (product) => {
        dispatch({ type: 'UPSERT_PRODUCT', payload: { product } })
      },
      deleteProduct: (productId) => {
        dispatch({ type: 'DELETE_PRODUCT', payload: { productId } })
      },
      updateOrderStatus: (orderId, status) => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } })
      },
      updatePaymentStatus: (paymentId, status) => {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { paymentId, status } })
      },
      upsertIntegration: (provider) => {
        dispatch({ type: 'UPSERT_INTEGRATION', payload: { provider } })
      },
      updateIntegrationStatus: (providerId, status) => {
        const log: IntegrationActionLog = {
          id: generateId('LOG'),
          providerId,
          type: 'verification',
          status: status === 'online' ? 'done' : 'queued',
          createdAt: new Date().toISOString(),
          details: `Integration status updated to ${status}.`,
        }
        dispatch({ type: 'UPDATE_INTEGRATION_STATUS', payload: { providerId, status, log } })
      },
      logIntegrationAction: (log) => {
        dispatch({ type: 'ADD_INTEGRATION_LOG', payload: { log } })
      },
      triggerIntegrationSync: (providerId) => {
        const log: IntegrationActionLog = {
          id: generateId('LOG'),
          providerId,
          type: 'verification',
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          details: 'Manual synchronisation started from the admin panel.',
        }
        dispatch({ type: 'UPDATE_INTEGRATION_STATUS', payload: { providerId, status: 'online', log } })
      },
      updateUser: (user) => {
        dispatch({ type: 'UPDATE_USER', payload: { user } })
      },
    }),
    [state.cart, state.products],
  )

  const value: StoreContextValue = {
    state,
    actions,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
