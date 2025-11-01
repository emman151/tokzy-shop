import { useMemo, useState } from 'react'
import { FiFilter, FiSearch } from 'react-icons/fi'
import ProductGrid from '../components/products/ProductGrid'
import { useStore } from '../context/StoreContext'

interface CatalogPageProps {
  openCart: () => void
}

type StoreProduct = ReturnType<typeof useStore>['state']['products'][number]

const quickFilters = [
  { id: 'auto', label: 'Auto delivery', predicate: (p: StoreProduct) => p.autoDelivery },
  { id: 'bonus', label: 'Contains bonus', predicate: (p: StoreProduct) => Boolean(p.bonus) },
  {
    id: 'limited',
    label: 'Limited stock',
    predicate: (p: StoreProduct) => p.stockStatus !== 'in_stock',
  },
]

const CatalogPage = ({ openCart }: CatalogPageProps) => {
  const {
    state: { products },
    actions,
  } = useStore()

  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular')

  const games = useMemo(() => Array.from(new Set(products.map((product) => product.game))), [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.game.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term),
      )
    }

    if (selectedGame) {
      result = result.filter((product) => product.game === selectedGame)
    }

    if (activeFilters.length) {
      result = result.filter((product) =>
        activeFilters.every((filterId) => quickFilters.find((filter) => filter.id === filterId)?.predicate(product)),
      )
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        result.sort((a, b) => b.purchases - a.purchases)
    }

    return result
  }, [products, search, selectedGame, activeFilters, sortBy])

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleAddToCart = (productId: string) => {
    actions.addToCart(productId)
    openCart()
  }

  return (
    <div className="catalog-page">
      <header className="catalog-filters">
        <div className="section-heading">
          <span className="section-heading__eyebrow">catalog</span>
          <h1 className="section-heading__title">Choose a bundle and top up the balance instantly</h1>
          <p className="section-heading__subtitle">
            Combine filters for bonuses, delivery speed and price — PulseTopUp recommends the best offer for your players.
          </p>
        </div>

        <div className="catalog-filters__row">
          <label className="catalog-search" htmlFor="catalog-search">
            <FiSearch />
            <input
              id="catalog-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by game, bundle or description"
            />
          </label>
          <div className="catalog-search" style={{ maxWidth: '240px' }}>
            <FiFilter />
            <select
              aria-label="Select game"
              style={{ border: 'none', background: 'transparent', width: '100%' }}
              value={selectedGame}
              onChange={(event) => setSelectedGame(event.target.value)}
            >
              <option value="">All games</option>
              {games.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>
          <div className="catalog-search" style={{ maxWidth: '220px' }}>
            <span style={{ fontWeight: 600 }}>Sort by</span>
            <select
              aria-label="Sort products"
              style={{ border: 'none', background: 'transparent', width: '100%' }}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            >
              <option value="popular">Most popular</option>
              <option value="price-asc">Lowest price</option>
              <option value="price-desc">Highest price</option>
            </select>
          </div>
        </div>

        <div className="chip-list">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`chip ${activeFilters.includes(filter.id) ? 'chip--active' : ''}`.trim()}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <section>
        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} onAdd={handleAddToCart} />
        ) : (
          <div className="empty-state">
            <p>No results match the current filters.</p>
            <p style={{ marginTop: '8px' }}>Reset filters or try a different game.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default CatalogPage
