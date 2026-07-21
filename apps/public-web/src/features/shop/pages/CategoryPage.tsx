import { useParams, Link } from 'react-router-dom'
import { useProducts } from '@/features/shop/hooks/useProducts'
import ProductCard from '@/components/common/ProductCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: rawData, isLoading } = useProducts({ category: slug, limit: 12 })
  const products = rawData?.data
  const meta = rawData?.meta

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-black mb-2 capitalize" style={{ fontFamily: 'var(--font-display)' }}>
        {slug?.replace(/-/g, ' ')}
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
        {meta?.total} products
      </p>
      <div className="product-grid">
        {isLoading
          ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)
        }
      </div>
    </div>
  )
}
