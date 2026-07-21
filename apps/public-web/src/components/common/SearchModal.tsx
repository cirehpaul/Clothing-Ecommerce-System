import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'
import { useSearchProducts } from '@/features/shop/hooks/useProducts'
import { formatPrice, getDiscountedPrice } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading } = useSearchProducts(debouncedQuery)

  const handleClose = () => {
    closeSearch()
    setTimeout(() => setQuery(''), 300)
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'var(--overlay)' }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-[60] shadow-2xl"
            style={{ background: 'var(--bg)' }}
          >
            <div className="container py-4">
              {/* Search Input */}
              <div className="flex items-center gap-3">
                <Search size={20} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for products, styles, colors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg font-medium outline-none bg-transparent"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button onClick={handleClose} className="btn btn-ghost p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              {(debouncedQuery.length > 1) && (
                <div className="mt-4 border-t pt-4 max-h-[60vh] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
                  {isLoading ? (
                    <div className="flex items-center gap-3 py-6 justify-center" style={{ color: 'var(--text-tertiary)' }}>
                      <div className="spinner" />
                      <span className="text-sm">Searching...</span>
                    </div>
                  ) : data?.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                      No products found for "{debouncedQuery}"
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {data?.slice(0, 6).map((product) => {
                        const price = getDiscountedPrice(product.price, product.salePrice)
                        return (
                          <Link
                            key={product.id}
                            to={`/products/${product.slug}`}
                            onClick={handleClose}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                          >
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                {product.name}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                                {product.brand}
                              </p>
                            </div>
                            <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                              {formatPrice(price)}
                            </span>
                          </Link>
                        )
                      })}
                      {(data?.length || 0) > 0 && (
                        <Link
                          to={`/products?search=${encodeURIComponent(debouncedQuery)}`}
                          onClick={handleClose}
                          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-xl mt-2"
                          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                        >
                          View all results for "{debouncedQuery}"
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quick links */}
              {!debouncedQuery && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['T-Shirt', 'Hoodie', 'Polo', 'Oversized', 'Black', 'New Arrivals'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                      >
                        <Clock size={11} />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
