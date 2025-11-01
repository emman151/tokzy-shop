import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartPanel from './components/cart/CartPanel'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './pages/admin/AdminDashboard'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

const NotFound = () => (
  <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
    <p className="pill-badge">404</p>
    <h1 style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '2.4rem', marginBottom: '16px' }}>
      Page not found
    </h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 32px' }}>
      Looks like you travelled to a route that does not exist. Head back to the homepage to continue topping up balances without delays.
    </p>
    <a className="cta-button" href="/">Back to homepage</a>
  </div>
)

function App() {
  const [isCartOpen, setCartOpen] = useState(false)

  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar onCartOpen={openCart} />
      <CartPanel open={isCartOpen} onClose={closeCart} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage openCart={openCart} />} />
          <Route path="/catalog" element={<CatalogPage openCart={openCart} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
