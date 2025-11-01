import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiCreditCard, FiMapPin, FiUser } from 'react-icons/fi'
import { paymentOptions } from '../data/mockData'
import { useStore } from '../context/StoreContext'

const CheckoutPage = () => {
  const {
    state: { cart, products },
    actions,
  } = useStore()

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((prod) => prod.id === item.productId)
          if (!product) {
            return null
          }
          return { product, quantity: item.quantity }
        })
        .filter((value): value is { product: (typeof products)[number]; quantity: number } => Boolean(value)),
    [cart, products],
  )

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const currency = cartItems[0]?.product.currency ?? 'USD'

  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]?.id ?? '')
  const [autoDelivery, setAutoDelivery] = useState(true)
  const [successState, setSuccessState] = useState<{ orderId: string; paymentId: string } | null>(null)
  const [formState, setFormState] = useState({
    email: '',
    playerId: '',
    playerNickname: '',
    region: '',
    game: cartItems[0]?.product.game ?? '',
    server: '',
    promoCode: '',
    notes: '',
  })

  const handleChange = (field: keyof typeof formState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payment = paymentOptions.find((option) => option.id === selectedPayment)
    if (!payment || !cartItems.length) {
      return
    }

    const result = actions.checkout({
      email: formState.email,
      playerId: formState.playerId,
      playerNickname: formState.playerNickname,
      region: formState.region,
      game: formState.game || cartItems[0].product.game,
      server: formState.server,
      paymentMethod: payment.name,
      paymentChannel: payment.channel,
      promoCode: formState.promoCode,
      notes: formState.notes,
      autoDelivery,
    })

    if (result) {
      setSuccessState(result)
    }
  }

  return (
    <div className="checkout-page">
      <div className="section-heading">
        <span className="section-heading__eyebrow">checkout</span>
        <h1 className="section-heading__title">Secure payment and instant balance delivery</h1>
        <p className="section-heading__subtitle">
          Provide player details and select a payment channel. PulseTopUp validates the transaction, charges the account and notifies you in under a minute.
        </p>
      </div>

      {!cartItems.length ? (
        <div className="empty-state">
          <p>Your cart is empty. Add bundles to continue.</p>
          <Link className="cta-button" to="/catalog" style={{ marginTop: '16px', display: 'inline-flex' }}>
            Back to catalog
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <form className="checkout-card" onSubmit={handleSubmit}>
            <div className="pill-badge">
              <FiUser /> Player information
            </div>
            {successState && (
              <div className="success-banner">
                <FiCheckCircle style={{ marginRight: '8px' }} /> Order {successState.orderId} submitted. Payment {successState.paymentId} is being processed.
              </div>
            )}
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="checkout-email">Email for notifications</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleChange('email')}
                  placeholder="player@team.gg"
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-player-id">Player ID</label>
                <input
                  id="checkout-player-id"
                  value={formState.playerId}
                  onChange={handleChange('playerId')}
                  placeholder="E.g. AYX-777 or UID"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-nickname">Nickname</label>
                <input
                  id="checkout-nickname"
                  value={formState.playerNickname}
                  onChange={handleChange('playerNickname')}
                  placeholder="Shown in reports"
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-region">
                  <FiMapPin style={{ marginRight: '8px' }} /> Region / Server
                </label>
                <input
                  id="checkout-region"
                  value={formState.region}
                  onChange={handleChange('region')}
                  placeholder="EU West, Asia, RU etc"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-game">Game</label>
                <select id="checkout-game" value={formState.game} onChange={handleChange('game')}>
                  {Array.from(new Set(products.map((product) => product.game))).map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="checkout-server">Extra parameters</label>
                <input
                  id="checkout-server"
                  value={formState.server}
                  onChange={handleChange('server')}
                  placeholder="Server, platform, notes"
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-promo">Promo code</label>
                <input
                  id="checkout-promo"
                  value={formState.promoCode}
                  onChange={handleChange('promoCode')}
                  placeholder="Enter promo code if available"
                />
              </div>
              <div className="form-field">
                <label htmlFor="checkout-notes">Order notes</label>
                <textarea
                  id="checkout-notes"
                  value={formState.notes}
                  onChange={handleChange('notes')}
                  placeholder="Additional instructions for operators or the team"
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={autoDelivery}
                onChange={(event) => setAutoDelivery(event.target.checked)}
              />
              Enable automatic renewals and reminders
            </label>

            <button className="cta-button" type="submit" style={{ marginTop: '12px' }}>
              Confirm and pay
            </button>
          </form>

          <aside className="checkout-card">
            <div className="pill-badge">
              <FiCreditCard /> Payment methods
            </div>
            <div className="payment-methods">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="payment-option"
                  data-active={selectedPayment === option.id}
                  onClick={() => setSelectedPayment(option.id)}
                >
                  <span className="payment-option__icon" aria-hidden>
                    {option.icon}
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <strong>{option.name}</strong>
                    <p style={{ margin: '4px 0 8px', color: 'var(--text-secondary)' }}>{option.description}</p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Fee {option.fee}% · confirmation {option.eta}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="checkout-card" style={{ gap: '14px', padding: '20px', background: 'rgba(255,255,255,0.85)' }}>
              <h3 style={{ margin: 0 }}>Order summary</h3>
              <div className="summary-list">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="summary-item">
                    <span>
                      {product.name} × {quantity}
                    </span>
                    <span>
                      {(product.price * quantity).toFixed(2)} {product.currency}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>
                  {subtotal.toFixed(2)} {currency}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                After payment confirmation you will receive an email with the order ID and a tracking link. If there is any delay an operator will contact you right away.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
