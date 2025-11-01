import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import FeatureHighlights from '../components/sections/FeatureHighlights'
import WorkflowSteps from '../components/sections/WorkflowSteps'
import IntegrationShowcase from '../components/sections/IntegrationShowcase'
import Testimonials from '../components/sections/Testimonials'
import FAQ from '../components/sections/FAQ'
import ProductGrid from '../components/products/ProductGrid'
import { featuredGames } from '../data/mockData'
import { useStore } from '../context/StoreContext'

interface HomePageProps {
  openCart: () => void
}

const HomePage = ({ openCart }: HomePageProps) => {
  const navigate = useNavigate()
  const {
    state: { products },
    actions,
  } = useStore()

  const topProducts = [...products]
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 6)

  const handleAddToCart = (productId: string) => {
    actions.addToCart(productId)
    openCart()
  }

  return (
    <div>
      <HeroSection onOpenCatalog={() => navigate('/catalog')} onOpenCart={openCart} />

      <section className="app-section">
        <div className="section-heading">
          <span className="section-heading__eyebrow">featured games</span>
          <h2 className="section-heading__title">We support every major live-service title</h2>
          <p className="section-heading__subtitle">
            Packages are refreshed for new seasons and battle passes. Save presets for squads and repeat orders in one tap.
          </p>
        </div>
        <div className="chip-list" style={{ marginTop: '24px' }}>
          {featuredGames.map((game) => (
            <span key={game} className="chip chip--active">
              {game}
            </span>
          ))}
        </div>
      </section>

      <section className="app-section">
        <div className="section-heading">
          <span className="section-heading__eyebrow">player favourites</span>
          <h2 className="section-heading__title">Best-selling bundles with instant delivery</h2>
        </div>
        <div style={{ marginTop: '32px' }}>
          <ProductGrid products={topProducts} onAdd={handleAddToCart} />
        </div>
      </section>

      <FeatureHighlights />
      <WorkflowSteps />
      <IntegrationShowcase />
      <Testimonials />
      <FAQ />
    </div>
  )
}

export default HomePage
