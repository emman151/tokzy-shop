import type { Product } from '../../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAdd: (productId: string) => void
}

const ProductGrid = ({ products, onAdd }: ProductGridProps) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  )
}

export default ProductGrid
