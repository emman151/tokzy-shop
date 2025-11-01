import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="navbar__brand">
              <span className="navbar__brand-icon">P</span>
              PulseTopUp
            </div>
            <p className="site-footer__note">
              A modern game top-up marketplace with instant delivery, live analytics and deep payment integrations.
            </p>
            <div className="chip-list">
              <span className="chip">Support 24/7</span>
              <span className="chip">Anti-fraud 2.0</span>
              <span className="chip">SLA 99.9%</span>
            </div>
          </div>

          <div>
            <h4>Navigation</h4>
            <div className="grid-auto" style={{ marginTop: '16px' }}>
              <Link to="/">Home</Link>
              <Link to="/catalog">Catalog</Link>
              <Link to="/checkout">Order checkout</Link>
              <Link to="/admin">Admin panel</Link>
            </div>
          </div>

          <div>
            <h4>Support</h4>
            <div className="grid-auto" style={{ marginTop: '16px' }}>
              <a href="mailto:support@pulsetopup.gg">support@pulsetopup.gg</a>
              <a href="https://t.me/pulsetopup" target="_blank" rel="noreferrer">
                Telegram channel
              </a>
              <a href="https://discord.gg/pulsetopup" target="_blank" rel="noreferrer">
                Discord server
              </a>
              <a href="tel:+79990001122">+7 (999) 000-11-22</a>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>? {new Date().getFullYear()} PulseTopUp. All rights reserved.</span>
          <div className="site-footer__links">
            <Link to="/terms">Terms of service</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/security">Payment security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
