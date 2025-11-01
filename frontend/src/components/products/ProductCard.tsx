import { FiClock, FiShoppingCart, FiStar } from 'react-icons/fi'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  onAdd: (productId: string) => void
}

const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__header">
        <span className="status-pill" data-variant={product.autoDelivery ? 'success' : 'warning'}>
          <FiClock /> {product.deliveryTime}
        </span>
        <span className="status-pill" data-variant="success">
          <FiStar /> {product.rating}
        </span>
      </div>
      <h3 className="product-card__title">{product.name}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 4px' }}>{product.description}</p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Orders fulfilled: {product.purchases}+</p>

      <div className="product-card__tags">
        {product.tags.map((tag) => (
          <span className="product-card__tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="product-card__footer">
        <div>
          <div className="product-card__price">
            {product.price.toFixed(2)} {product.currency}
          </div>
          {product.bonus && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{product.bonus}</span>}
        </div>
        <button type="button" className="product-card__button" onClick={() => onAdd(product.id)}>
          <FiShoppingCart />
          Add to cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
