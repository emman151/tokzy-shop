import { FiActivity, FiRefreshCw, FiServer } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'

const statusVariantMap = {
  online: 'success',
  degraded: 'warning',
  offline: 'danger',
} as const

const IntegrationShowcase = () => {
  const {
    state: { integrations, integrationLogs },
    actions,
  } = useStore()

  const recentLogs = integrationLogs.slice(0, 4)

  return (
    <section className="app-section" id="integrations">
      <div className="section-heading">
        <span className="section-heading__eyebrow">integrations & automation</span>
        <h2 className="section-heading__title">Direct integrations with game publishers and payment systems</h2>
        <p className="section-heading__subtitle">
          PulseTopUp automatically synchronises transaction states, monitors latency and lets operators restart or flag integrations in a click.
        </p>
      </div>

      <div className="integration-grid" style={{ marginTop: '32px' }}>
        {integrations.map((integration) => (
          <article key={integration.id} className="integration-card">
            <div className="integration-card__header">
              <div>
                <h3 className="integration-card__title">{integration.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
                  {integration.instructions}
                </p>
              </div>
              <span className="status-pill" data-variant={statusVariantMap[integration.status]}>
                <FiServer /> {integration.status === 'online' ? 'Online' : integration.status === 'degraded' ? 'Degraded' : 'Offline'}
              </span>
            </div>
            <div className="integration-card__meta">
              <span>Latency: {integration.latencyMs} ms</span>
              <span>Success: {integration.successRate}%</span>
              <span>Synced: {new Date(integration.lastSync).toLocaleTimeString()}</span>
            </div>
            <div className="integration-card__footer">
              <button
                className="integration-card__button"
                type="button"
                onClick={() => actions.triggerIntegrationSync(integration.id)}
              >
                <FiRefreshCw /> Sync now
              </button>
              <button
                className="link-button"
                type="button"
                onClick={() => actions.updateIntegrationStatus(integration.id, 'degraded')}
              >
                Flag degradation
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="surface-card" style={{ marginTop: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          <span className="pill-badge">
            <FiActivity /> live log
          </span>
          <strong>Latest automation events</strong>
        </div>
        <div className="faq-grid">
          {recentLogs.map((log) => (
            <div key={log.id} className="faq-item">
              <div className="faq-item__question">
                {log.type.toUpperCase()} · {log.providerId}
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
    </section>
  )
}

export default IntegrationShowcase
