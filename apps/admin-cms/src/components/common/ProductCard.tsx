import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import type { ProductListItem } from '@/types'
import { formatPrice, getDiscountedPrice } from '@/lib/utils'
import { useToggleWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useAddToCart } from '@/features/cart/hooks/useCart'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: ProductListItem
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { openCart } = useUIStore()
  const toggleWishlist = useToggleWishlist()
  const addToCart = useAddToCart()

  const displayPrice = getDiscountedPrice(product.price, product.salePrice)
  const originalPrice = parseFloat(product.price)
  const hasDiscount = product.salePrice && displayPrice < originalPrice

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist')
      return
    }
    try {
      await toggleWishlist.mutateAsync(product.id)
    } catch { /* handled in hook */ }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div className="card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-[var(--bg-tertiary)] overflow-hidden product-img-wrapper">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                <ShoppingBag size={40} />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {hasDiscount && (
                <span className="badge badge-sale">-{product.discount}%</span>
              )}
              {product.isNewArrival && !hasDiscount && (
                <span className="badge badge-new">New</span>
              )}
              {product.isBestSeller && (
                <span className="badge" style={{ background: '#f59e0b20', color: '#b45309', fontSize: '0.6rem' }}>
                  Best Seller
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-md"
              style={{
                background: 'var(--card-bg)',
                color: product.isWishlisted ? '#DC2626' : 'var(--text-tertiary)',
              }}
              aria-label={product.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={14} fill={product.isWishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Out of stock overlay */}
            {product.totalStock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgb(0 0 0 / 0.4)' }}>
                <span className="text-white text-xs font-semibold bg-black bg-opacity-60 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h3>

            {/* Rating */}
            {product.averageRating && parseFloat(product.averageRating) > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star size={10} className="star-filled" fill="currentColor" />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {parseFloat(product.averageRating).toFixed(1)} ({product.totalReviews})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
