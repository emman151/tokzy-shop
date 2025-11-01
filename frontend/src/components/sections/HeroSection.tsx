import { FiArrowRight, FiShield, FiZap } from 'react-icons/fi'
import { overviewStats } from '../../data/mockData'

interface HeroSectionProps {
  onOpenCatalog: () => void
  onOpenCart: () => void
}

const HeroSection = ({ onOpenCatalog, onOpenCart }: HeroSectionProps) => {
  return (
    <section className="hero app-section">
      <div className="hero__headline">
        <span className="hero__badge">
          <FiZap />
          instant credits
        </span>
        <h1 className="hero__title">
          PulseTopUp — <span>game credits</span> delivered in seconds
        </h1>
        <p className="hero__subtitle">
          Manage top-ups for the biggest titles, monitor every payment and connect directly to bank APIs and wallets.
          Zero delays, full control and beautiful analytics across the entire journey.
        </p>
        <div className="hero__actions">
          <button className="cta-button" type="button" onClick={onOpenCatalog}>
            Browse catalog
          </button>
          <button className="ghost-button" type="button" onClick={onOpenCart}>
            Open cart
          </button>
        </div>
        <div className="hero__stats">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="hero__stat-card">
              <span className="hero__stat-value">{stat.value}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__visual-card">
          <div className="hero__visual-header">
            <div>
              <p className="status-pill" data-variant="success">
                <FiShield /> API secured
              </p>
              <h3 className="hero__visual-title">Integration cockpit</h3>
            </div>
            <span className="hero__visual-status">Live 24/7</span>
          </div>
          <div className="hero__visual-body">
            <div className="hero__visual-metric">
              <div>
                <span style={{ fontSize: '0.9rem', opacity: 0.75 }}>Average latency</span>
                <div className="hero__visual-metric-value">0.47s</div>
              </div>
              <div className="hero__visual-trend" style={{ color: '#40c676' }}>
                ▲ 12% faster
              </div>
            </div>
            <div className="hero__visual-metric">
              <div>
                <span style={{ fontSize: '0.9rem', opacity: 0.75 }}>Completed top-ups</span>
                <div className="hero__visual-metric-value">12 480</div>
              </div>
              <button className="integration-card__button" type="button">
                See details
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
