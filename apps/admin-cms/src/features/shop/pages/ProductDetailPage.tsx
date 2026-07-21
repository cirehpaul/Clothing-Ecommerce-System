import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Heart, Star, ChevronRight, Share2,
  Package, Truck, RotateCcw, Shield, ZoomIn, Minus, Plus
} from 'lucide-react'
import { useProductDetail } from '@/features/shop/hooks/useProducts'
import { useAddToCart } from '@/features/cart/hooks/useCart'
import { useToggleWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { ProductDetailSkeleton } from '@/components/common/Skeleton'
import ProductCard from '@/components/common/ProductCard'
import StarRating from '@/components/common/StarRating'
import { formatPrice, getDiscountedPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ProductVariant } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProductDetail(slug!)
  const addToCart = useAddToCart()
  const toggleWishlist = useToggleWishlist()
  const { openCart } = useUIStore()
  const { isAuthenticated } = useAuthStore()

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description')
  const [isZoomed, setIsZoomed] = useState(false)

  if (isLoading) return <ProductDetailSkeleton />
  if (error || !product) return (
    <div className="container py-20 text-center">
      <p className="text-lg font-semibold mb-4">Product not found</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  )

  const selectedVariant: ProductVariant | undefined = product.variants?.find(
    (v) => v.color.id === selectedColor && v.size.id === selectedSize
  )

  const maxQty = selectedVariant?.stock || 0
  const displayPrice = getDiscountedPrice(product.price, product.salePrice)
  const originalPrice = parseFloat(product.price)
  const hasDiscount = product.salePrice && displayPrice < originalPrice

  // Available sizes for selected color
  const availableSizesForColor = selectedColor
    ? product.variants?.filter((v) => v.color.id === selectedColor && v.isActive).map((v) => v.size.id)
    : product.availableSizes?.map((s) => s.id)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart')
      return
    }
    if (!selectedColor || !selectedSize) {
      toast.error('Please select a color and size')
      return
    }
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error('Selected variant is out of stock')
      return
    }
    await addToCart.mutateAsync({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    })
    openCart()
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist')
      return
    }
    await toggleWishlist.mutateAsync(product.id)
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-tertiary)' }}>
        <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link to={`/category/${product.category.slug}`} className="hover:text-[var(--text-primary)] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Images ─── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          {/* Main Image */}
          <div
            className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3 cursor-zoom-in"
            style={{ background: 'var(--bg-tertiary)' }}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {product.images && product.images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]?.url}
                  alt={product.images[activeImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                <ShoppingBag size={60} />
              </div>
            )}
            <button className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgb(255 255 255 / 0.9)' }}>
              <ZoomIn size={14} />
            </button>
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <span className="badge badge-sale">-{product.discount}%</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: activeImage === i ? 'var(--text-primary)' : 'transparent',
                    background: 'var(--bg-tertiary)',
                  }}
                >
                  <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Product Info ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          {/* Brand */}
          {product.brand && (
            <span className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              {product.brand}
            </span>
          )}

          {/* Name */}
          <h1 className="text-2xl lg:text-3xl font-black mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating
              rating={parseFloat(product.averageRating || '0')}
              showNumber
              count={product.totalReviews}
            />
            {product.totalReviews > 0 && (
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs underline"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {product.totalReviews} reviews
              </button>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg line-through" style={{ color: 'var(--text-tertiary)' }}>
                  {formatPrice(originalPrice)}
                </span>
                <span className="badge badge-sale">Save {formatPrice(originalPrice - displayPrice)}</span>
              </>
            )}
          </div>

          {/* Color Selector */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Color
                </label>
                {selectedColor && (
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {product.availableColors.find((c) => c.id === selectedColor)?.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => { setSelectedColor(color.id); setSelectedSize(null) }}
                    title={color.name}
                    className="color-swatch"
                    style={{
                      backgroundColor: color.hexCode,
                      borderColor: selectedColor === color.id ? 'var(--text-primary)' : 'var(--border)',
                      boxShadow: selectedColor === color.id
                        ? '0 0 0 2px var(--bg), 0 0 0 4px var(--text-primary)'
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Size
                </label>
                <button className="text-xs underline" style={{ color: 'var(--text-tertiary)' }}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => {
                  const isAvailable = availableSizesForColor?.includes(size.id)
                  const variant = product.variants?.find(
                    (v) => v.size.id === size.id && v.color.id === selectedColor
                  )
                  const inStock = !selectedColor || (variant && variant.stock > 0)

                  return (
                    <button
                      key={size.id}
                      onClick={() => isAvailable && inStock && setSelectedSize(size.id)}
                      disabled={!isAvailable || !inStock}
                      className="size-btn"
                      style={
                        selectedSize === size.id
                          ? { background: 'var(--text-primary)', borderColor: 'var(--text-primary)', color: 'var(--bg)' }
                          : {}
                      }
                    >
                      {size.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity + Stock */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="qty-btn"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty || 99, q + 1))}
                disabled={!!(selectedVariant && quantity >= selectedVariant.stock)}
                className="qty-btn"
              >
                <Plus size={14} />
              </button>
            </div>
            {selectedVariant && (
              <span className="text-xs" style={{ color: selectedVariant.stock <= 5 ? '#DC2626' : 'var(--text-tertiary)' }}>
                {selectedVariant.stock <= 5 ? `Only ${selectedVariant.stock} left!` : `${selectedVariant.stock} in stock`}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="btn btn-primary btn-lg flex-1 gap-2"
            >
              {addToCart.isPending ? <span className="spinner" /> : <ShoppingBag size={18} />}
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="btn btn-secondary p-4 rounded-xl"
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                fill={product.isWishlisted ? 'currentColor' : 'none'}
                style={{ color: product.isWishlisted ? '#DC2626' : 'currentColor' }}
              />
            </button>
            <button className="btn btn-secondary p-4 rounded-xl" aria-label="Share">
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Truck, text: 'Free shipping on ₱1,500+' },
              { icon: RotateCcw, text: '30-day returns' },
              { icon: Shield, text: 'Secure checkout' },
              { icon: Package, text: 'Authentic products' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Icon size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-1 mb-5">
              {(['description', 'details', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                  style={{
                    background: activeTab === tab ? 'var(--text-primary)' : 'transparent',
                    color: activeTab === tab ? 'var(--bg)' : 'var(--text-secondary)',
                  }}
                >
                  {tab === 'reviews' ? `Reviews (${product.totalReviews})` : tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'description' && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {product.description || 'No description available.'}
                  </p>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-2.5">
                    {[
                      { label: 'SKU', value: product.sku },
                      { label: 'Material', value: product.material },
                      { label: 'Brand', value: product.brand },
                      { label: 'Category', value: product.category?.name },
                    ].filter((d) => d.value).map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'var(--bg-tertiary)' }}>
                              {review.user?.firstName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{review.user?.firstName} {review.user?.lastName}</p>
                              <StarRating rating={review.rating} size={11} />
                            </div>
                          </div>
                          {review.title && <p className="text-sm font-semibold mb-1">{review.title}</p>}
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                        No reviews yet. Be the first to review!
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-black mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            You May Also Like
          </h2>
          <div className="product-grid">
            {product.relatedProducts.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
