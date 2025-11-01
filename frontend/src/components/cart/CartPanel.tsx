import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'

interface CartPanelProps {
  open: boolean
  onClose: () => void
}

const CartPanel = ({ open, onClose }: CartPanelProps) => {
  const { state, actions } = useStore()

  const cartItems = state.cart
    .map((cartItem) => {
      const product = state.products.find((prod) => prod.id === cartItem.productId)
      if (!product) {
        return null
      }
      return { product, quantity: cartItem.quantity }
    })
    .filter((item): item is { product: (typeof state.products)[number]; quantity: number } => Boolean(item))

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const currency = cartItems[0]?.product.currency ?? 'USD'

  return (
    <>
      {open && <div className="cart-panel__backdrop" onClick={onClose} />}
      <aside className="cart-panel" data-open={open}>
        <div className="cart-panel__header">
          <div>
            <h3 className="cart-panel__title">Cart</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {cartItems.length > 0
                ? `Items selected: ${cartItems.reduce((acc, item) => acc + item.quantity, 0)}`
                : 'Add game bundles and return to checkout'}
            </span>
          </div>
          <button className="cart-panel__close" type="button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="cart-panel__list">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>The cart is empty.</p>
              <p style={{ marginTop: '8px' }}>Browse the catalog to choose the top-up packages you need.</p>
              <Link className="cta-button" to="/catalog" onClick={onClose} style={{ marginTop: '18px', display: 'inline-block' }}>
                Open catalog
              </Link>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item__header">
                  <div>
                    <div className="cart-item__title">{product.name}</div>
                    <div className="cart-item__meta">
                      {product.game} ? {product.deliveryTime}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => actions.removeFromCart(product.id)}
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>

                <div className="cart-item__actions">
                  <div className="cart-qty">
                    <button type="button" onClick={() => actions.updateCartQuantity(product.id, quantity - 1)}>
                      <FiMinus />
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => actions.updateCartQuantity(product.id, quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>
                  <strong style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '1.05rem' }}>
                    {(product.price * quantity).toFixed(2)} {currency}
                  </strong>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-panel__footer">
          <div className="cart-panel__summary">
            <span>Total</span>
            <span>
              {subtotal.toFixed(2)} {currency}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="ghost-button" type="button" onClick={actions.clearCart} disabled={!cartItems.length}>
              Clear
            </button>
            <Link
              to="/checkout"
              className="cta-button"
              style={{ flex: 1, textAlign: 'center' }}
              onClick={onClose}
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default CartPanel
