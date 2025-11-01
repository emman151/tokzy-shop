import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  FiBarChart2,
  FiDatabase,
  FiEdit2,
  FiList,
  FiPlusCircle,
  FiRefreshCw,
  FiUsers,
} from 'react-icons/fi'
import type { AdminTabKey, OrderStatus, PaymentStatus, Product, User } from '../../types'
import { useStore } from '../../context/StoreContext'

const tabs: { id: AdminTabKey; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <FiBarChart2 /> },
  { id: 'products', label: 'Products', icon: <FiPlusCircle /> },
  { id: 'orders', label: 'Orders', icon: <FiList /> },
  { id: 'payments', label: 'Payments', icon: <FiDatabase /> },
  { id: 'users', label: 'Users', icon: <FiUsers /> },
  { id: 'integrations', label: 'Integrations', icon: <FiRefreshCw /> },
  { id: 'automations', label: 'Automation log', icon: <FiEdit2 /> },
]

const currencyOptions = ['USD', 'EUR', 'RUB', 'KZT'] as const
const stockOptions: Product['stockStatus'][] = ['in_stock', 'limited', 'preorder']
const orderStatuses: OrderStatus[] = ['created', 'awaiting_payment', 'processing', 'completed', 'cancelled']
const paymentStatuses: PaymentStatus[] = ['pending', 'in_review', 'succeeded', 'failed', 'refunded']
const userRoles: User['role'][] = ['player', 'moderator', 'admin']
const userStatuses: User['status'][] = ['active', 'suspended', 'new']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const AdminDashboard = () => {
  const {
    state: { products, orders, payments, users, integrations, integrationLogs },
    actions,
  } = useStore()

  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview')
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    game: '',
    price: '',
    currency: 'USD',
    deliveryTime: 'Instant',
    tags: 'new, auto delivery',
    description: '',
    image: '',
    bonus: '',
    stockStatus: 'in_stock' as Product['stockStatus'],
    autoDelivery: true,
  })
  const [productMessage, setProductMessage] = useState<string>('')

  const overviewStats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => ['completed', 'processing'].includes(order.status))
      .reduce((acc, order) => acc + order.total, 0)
    const pendingPayments = payments.filter((payment) => payment.status !== 'succeeded').length
    const activeCustomers = users.filter((user) => user.status === 'active').length
    const activeIntegrations = integrations.filter((integration) => integration.status === 'online').length
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingPayments,
      activeCustomers,
      activeIntegrations,
    }
  }, [orders, payments, users, integrations])

  const resetProductForm = () => {
    setProductForm({
      id: '',
      name: '',
      game: '',
      price: '',
      currency: 'USD',
      deliveryTime: 'Instant',
      tags: 'new, auto delivery',
      description: '',
      image: '',
      bonus: '',
      stockStatus: 'in_stock',
      autoDelivery: true,
    })
  }

  const handleProductSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productForm.name || !productForm.game || !productForm.price) {
      return
    }

    const price = Number(productForm.price)
    if (Number.isNaN(price)) {
      setProductMessage('Enter a valid price value')
      return
    }

    const id = productForm.id || `${slugify(productForm.name)}-${Date.now().toString(36)}`
    const tags = productForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    const product: Product = {
      id,
      name: productForm.name,
      game: productForm.game,
      description: productForm.description || 'New top-up package with automated delivery.',
      price,
      currency: productForm.currency as Product['currency'],
      image:
        productForm.image ||
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=900&q=80',
      tags: tags.length ? tags : ['new'],
      deliveryTime: productForm.deliveryTime,
      rating: 4.85,
      purchases: productForm.id ? products.find((item) => item.id === productForm.id)?.purchases ?? 0 : 0,
      autoDelivery: productForm.autoDelivery,
      bonus: productForm.bonus || undefined,
      stockStatus: productForm.stockStatus,
    }

    actions.upsertProduct(product)
    setProductMessage(productForm.id ? 'Product updated' : 'Product added to catalog')
    resetProductForm()
  }

  const loadProductToForm = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      game: product.game,
      price: product.price.toString(),
      currency: product.currency,
      deliveryTime: product.deliveryTime,
      tags: product.tags.join(', '),
      description: product.description,
      image: product.image,
      bonus: product.bonus ?? '',
      stockStatus: product.stockStatus,
      autoDelivery: product.autoDelivery,
    })
    setProductMessage('Editing product')
  }

  const renderOverview = () => {
    const recentOrders = orders.slice(0, 5)
    const recentPayments = payments.slice(0, 5)
    return (
      <div className="admin-dashboard__overview" style={{ display: 'grid', gap: '24px' }}>
        <div className="stats-ribbon">
          <div className="stats-ribbon__item">
            <span className="stats-ribbon__label">Total orders</span>
            <span className="stats-ribbon__value">{overviewStats.totalOrders}</span>
          </div>
          <div className="stats-ribbon__item">
            <span className="stats-ribbon__label">Revenue (USD)</span>
            <span className="stats-ribbon__value">{overviewStats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="stats-ribbon__item">
            <span className="stats-ribbon__label">Pending payments</span>
            <span className="stats-ribbon__value">{overviewStats.pendingPayments}</span>
          </div>
          <div className="stats-ribbon__item">
            <span className="stats-ribbon__label">Active integrations</span>
            <span className="stats-ribbon__value">{overviewStats.activeIntegrations}</span>
          </div>
        </div>

        <div className="split-layout">
          <div className="admin-content" style={{ gap: '18px' }}>
            <h3 style={{ margin: 0 }}>Recent orders</h3>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Player</th>
                    <th>Game</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.playerId}</td>
                      <td>{order.game}</td>
                      <td>
                        {order.total.toFixed(2)} {order.currency}
                      </td>
                      <td>
                        <span className="status-pill" data-variant={order.status === 'completed' ? 'success' : 'warning'}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-content" style={{ gap: '18px' }}>
            <h3 style={{ margin: 0 }}>Payments in progress</h3>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.provider}</td>
                      <td>
                        {payment.amount.toFixed(2)} {payment.currency}
                      </td>
                      <td>
                        <span className="status-pill" data-variant={payment.status === 'succeeded' ? 'success' : 'warning'}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="admin-content" style={{ gap: '18px' }}>
          <h3 style={{ margin: 0 }}>Integration log</h3>
          <div className="faq-grid">
            {integrationLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="faq-item">
                <strong className="faq-item__question">
                  {log.type.toUpperCase()} ? {log.providerId}
                </strong>
                <p className="faq-item__answer" style={{ marginBottom: '6px' }}>
                  {log.details}
                </p>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderProducts = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <form className="admin-content" onSubmit={handleProductSubmit} style={{ gap: '18px' }}>
        <h3 style={{ margin: 0 }}>{productForm.id ? 'Edit product' : 'Add a new product'}</h3>
        {productMessage && <span style={{ color: 'var(--primary)' }}>{productMessage}</span>}
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label className="form-field">
            <span>Name</span>
            <input value={productForm.name} onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))} required />
          </label>
          <label className="form-field">
            <span>Game</span>
            <input value={productForm.game} onChange={(event) => setProductForm((prev) => ({ ...prev, game: event.target.value }))} required />
          </label>
          <label className="form-field">
            <span>Price</span>
            <input
              value={productForm.price}
              onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
              required
            />
          </label>
          <label className="form-field">
            <span>Currency</span>
            <select
              value={productForm.currency}
              onChange={(event) => setProductForm((prev) => ({ ...prev, currency: event.target.value }))}
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Delivery time</span>
            <input
              value={productForm.deliveryTime}
              onChange={(event) => setProductForm((prev) => ({ ...prev, deliveryTime: event.target.value }))}
            />
          </label>
          <label className="form-field">
            <span>Tags (comma separated)</span>
            <input value={productForm.tags} onChange={(event) => setProductForm((prev) => ({ ...prev, tags: event.target.value }))} />
          </label>
          <label className="form-field">
            <span>Image URL</span>
            <input value={productForm.image} onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))} />
          </label>
          <label className="form-field">
            <span>Bonus</span>
            <input value={productForm.bonus} onChange={(event) => setProductForm((prev) => ({ ...prev, bonus: event.target.value }))} />
          </label>
          <label className="form-field">
            <span>Stock status</span>
            <select
              value={productForm.stockStatus}
              onChange={(event) =>
                setProductForm((prev) => ({ ...prev, stockStatus: event.target.value as Product['stockStatus'] }))
              }
            >
              {stockOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={productForm.autoDelivery}
            onChange={(event) => setProductForm((prev) => ({ ...prev, autoDelivery: event.target.checked }))}
          />
          Automatic delivery
        </label>
        <label className="form-field">
          <span>Description</span>
          <textarea
            value={productForm.description}
            onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
          />
        </label>
        <div className="admin-actions">
          <button className="cta-button" type="submit">
            {productForm.id ? 'Save changes' : 'Add product'}
          </button>
          {productForm.id && (
            <button className="ghost-button" type="button" onClick={resetProductForm}>
              Create new product
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Game</th>
              <th>Price</th>
              <th>Status</th>
              <th>Sales</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.game}</td>
                <td>
                  {product.price.toFixed(2)} {product.currency}
                </td>
                <td>{product.stockStatus}</td>
                <td>{product.purchases}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="link-button" type="button" onClick={() => loadProductToForm(product)}>
                    Edit
                  </button>
                  <button className="link-button" type="button" onClick={() => actions.deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Player</th>
            <th>Game</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.playerId}</td>
              <td>{order.game}</td>
              <td>
                {order.total.toFixed(2)} {order.currency}
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(event) => actions.updateOrderStatus(order.id, event.target.value as OrderStatus)}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{order.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPayments = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order</th>
            <th>Provider</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.orderId}</td>
              <td>
                {payment.provider} ? {payment.channel}
              </td>
              <td>
                {payment.amount.toFixed(2)} {payment.currency}
              </td>
              <td>
                <select
                  value={payment.status}
                  onChange={(event) => actions.updatePaymentStatus(payment.id, event.target.value as PaymentStatus)}
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{new Date(payment.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderUsers = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Favourite games</th>
            <th>Lifetime value</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(event) => actions.updateUser({ ...user, role: event.target.value as User['role'] })}
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={user.status}
                  onChange={(event) => actions.updateUser({ ...user, status: event.target.value as User['status'] })}
                >
                  {userStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{user.favoriteGames.join(', ')}</td>
              <td>{user.totalSpent.toFixed(2)} USD</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderIntegrations = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Integration</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Success</th>
            <th>Synced</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map((integration) => (
            <tr key={integration.id}>
              <td>{integration.name}</td>
              <td>
                <select
                  value={integration.status}
                  onChange={(event) =>
                    actions.updateIntegrationStatus(
                      integration.id,
                      event.target.value as typeof integration.status,
                    )
                  }
                >
                  {['online', 'degraded', 'offline'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{integration.latencyMs} ms</td>
              <td>{integration.successRate}%</td>
              <td>{new Date(integration.lastSync).toLocaleString()}</td>
              <td style={{ display: 'flex', gap: '10px' }}>
                <button className="link-button" type="button" onClick={() => actions.triggerIntegrationSync(integration.id)}>
                  Sync now
                </button>
                <button
                  className="link-button"
                  type="button"
                  onClick={() =>
                    actions.logIntegrationAction({
                      id: `LOG-${Date.now()}`,
                      providerId: integration.id,
                      type: 'topup',
                      status: 'queued',
                      createdAt: new Date().toISOString(),
                      details: 'Manual status check executed from the admin panel.',
                    })
                  }
                >
                  Add log entry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderAutomations = () => (
    <div className="admin-content" style={{ gap: '18px' }}>
      <h3 style={{ margin: 0 }}>Automation history</h3>
      <div className="faq-grid">
        {integrationLogs.map((log) => (
          <div key={log.id} className="faq-item">
            <div className="faq-item__question">
              {log.type.toUpperCase()} ? {log.providerId}
            </div>
            <div className="faq-item__answer">
              {log.details}
              <br />
              <small style={{ color: 'var(--text-secondary)' }}>{new Date(log.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'products':
        return renderProducts()
      case 'orders':
        return renderOrders()
      case 'payments':
        return renderPayments()
      case 'users':
        return renderUsers()
      case 'integrations':
        return renderIntegrations()
      case 'automations':
        return renderAutomations()
      default:
        return null
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="section-heading">
        <span className="section-heading__eyebrow">admin panel</span>
        <h1 className="section-heading__title">Manage products, orders, payments and integrations</h1>
        <p className="section-heading__subtitle">
          Track payment states, update catalog items and supervise automatic top-ups in one place. Every action synchronises instantly across the platform.
        </p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="admin-tab"
              data-active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="admin-content" style={{ gap: '24px', padding: 0, background: 'transparent', border: 'none' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
