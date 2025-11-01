export type Currency = 'USD' | 'EUR' | 'KZT' | 'RUB'

export interface Product {
  id: string
  name: string
  game: string
  description: string
  price: number
  currency: Currency
  image: string
  tags: string[]
  deliveryTime: string
  rating: number
  purchases: number
  autoDelivery: boolean
  bonus?: string
  stockStatus: 'in_stock' | 'limited' | 'preorder'
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export type OrderStatus = 'created' | 'awaiting_payment' | 'processing' | 'completed' | 'cancelled'

export interface Order {
  id: string
  userId: string
  playerId: string
  game: string
  total: number
  currency: Currency
  status: OrderStatus
  paymentMethod: string
  createdAt: string
  items: OrderItem[]
  notes?: string
  region?: string
  autoDelivery: boolean
}

export type UserRole = 'player' | 'moderator' | 'admin'

export interface User {
  id: string
  nickname: string
  email: string
  role: UserRole
  totalSpent: number
  status: 'active' | 'suspended' | 'new'
  favoriteGames: string[]
  lastActive: string
}

export type PaymentStatus = 'pending' | 'in_review' | 'succeeded' | 'failed' | 'refunded'

export interface Payment {
  id: string
  orderId: string
  provider: string
  channel: string
  amount: number
  currency: Currency
  status: PaymentStatus
  transactionId: string
  createdAt: string
  updatedAt: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface IntegrationProvider {
  id: string
  name: string
  status: 'online' | 'degraded' | 'offline'
  latencyMs: number
  successRate: number
  lastSync: string
  instructions: string
}

export interface CheckoutDetails {
  email: string
  playerId: string
  playerNickname: string
  region: string
  game: string
  server: string
  paymentMethod: string
  paymentChannel: string
  promoCode?: string
  notes?: string
  autoDelivery: boolean
}

export interface PaymentOption {
  id: string
  name: string
  channel: string
  description: string
  fee: number
  eta: string
  type: 'bank' | 'wallet' | 'card' | 'crypto'
  supportCurrencies: Currency[]
  icon: string
}

export interface IntegrationActionLog {
  id: string
  providerId: string
  type: 'topup' | 'refund' | 'verification'
  status: 'queued' | 'in_progress' | 'done' | 'failed'
  createdAt: string
  details: string
}

export type AdminTabKey =
  | 'overview'
  | 'products'
  | 'orders'
  | 'users'
  | 'payments'
  | 'integrations'
  | 'automations'
