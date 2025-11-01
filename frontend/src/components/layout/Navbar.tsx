import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiShoppingCart, FiZap } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'

interface NavbarProps {
  onCartOpen: () => void
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Admin Panel', to: '/admin' },
]

const Navbar = ({ onCartOpen }: NavbarProps) => {
  const { state } = useStore()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0)

  const toggleMobile = () => setMobileOpen((prev) => !prev)
  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMobile}>
          <span className="navbar__brand-icon">P</span>
          PulseTopUp
        </Link>

        <nav className="navbar__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="navbar__link"
              data-active={pathname === item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__cart-button" onClick={onCartOpen} type="button">
            <FiShoppingCart />
            Cart
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
          <Link className="ghost-button" to="/admin">
            <FiZap />
            Admin
          </Link>
          <button className="navbar__menu-toggle" onClick={toggleMobile} type="button" aria-label="Toggle navigation">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile-panel">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="navbar__link"
              data-active={pathname === item.to}
              onClick={closeMobile}
            >
              {item.label}
            </Link>
          ))}
          <div className="navbar__mobile-actions">
            <button className="cta-button" type="button" onClick={() => { onCartOpen(); closeMobile() }}>
              <FiShoppingCart />
              View cart
            </button>
            <Link className="ghost-button" to="/admin" onClick={closeMobile}>
              Manage store
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
