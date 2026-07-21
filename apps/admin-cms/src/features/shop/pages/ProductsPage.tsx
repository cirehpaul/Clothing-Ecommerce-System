import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Grid2x2, List, X, ChevronDown, Search } from 'lucide-react'
import { useProducts, useCategories } from '@/features/shop/hooks/useProducts'
import ProductCard from '@/components/common/ProductCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'
import { useDebouncedValue } from '@/hooks/useDebounce'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const filters = {
    page: parseInt(searchParams.get('page') || '1'),
    sort: searchParams.get('sort') || 'newest',
    category: searchParams.get('category') || undefined,
    search: debouncedSearch || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    size: searchParams.get('size') || undefined,
    limit: 12,
  }

  const { data, isLoading, isFetching } = useProducts(filters)
  const { data: categories } = useCategories()

  const products = data?.data || []
  const meta = data?.meta

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  const activeFilters = [
    filters.category && { key: 'category', label: `Category: ${filters.category}` },
    filters.size && { key: 'size', label: `Size: ${filters.size}` },
    filters.minPrice && { key: 'minPrice', label: `Min: ₱${filters.minPrice}` },
    filters.maxPrice && { key: 'maxPrice', label: `Max: ₱${filters.maxPrice}` },
    debouncedSearch && { key: 'search', label: `"${debouncedSearch}"` },
  ].filter(Boolean)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          {filters.category ? categories?.find((c: any) => c.slug === filters.category)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {meta ? `${meta.total} products found` : 'Loading...'}
        </p>
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar Filters (Desktop) ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel
            categories={categories}
            activeCategory={filters.category}
            activeSize={filters.size}
            minPrice={searchParams.get('minPrice') || ''}
            maxPrice={searchParams.get('maxPrice') || ''}
            onFilter={setFilter}
          />
        </aside>

        {/* ── Products ── */}
        <div className="flex-1 min-w-0">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-8 text-sm"
              />
            </div>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="input text-sm w-auto cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="btn btn-secondary btn-sm gap-1.5 lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFilters.length > 0 && (
                <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* View mode */}
            <div className="hidden md:flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="p-2 transition-colors"
                  style={{
                    background: viewMode === mode ? 'var(--text-primary)' : 'transparent',
                    color: viewMode === mode ? 'var(--bg)' : 'var(--text-tertiary)',
                  }}
                >
                  {mode === 'grid' ? <Grid2x2 size={14} /> : <List size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((f: any) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setFilter(f.key, null)
                    if (f.key === 'search') setSearchInput('')
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  {f.label} <X size={11} />
                </button>
              ))}
              <button
                onClick={() => {
                  setSearchParams({})
                  setSearchInput('')
                }}
                className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}>
                {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-bold mb-2">No products found</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Try adjusting your filters or search terms.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}
              >
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilter('page', String(page))}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: filters.page === page ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                    color: filters.page === page ? 'var(--bg)' : 'var(--text-secondary)',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'var(--overlay)' }}
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 overflow-y-auto p-5"
              style={{ background: 'var(--bg)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="btn btn-ghost p-2 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                activeCategory={filters.category}
                activeSize={filters.size}
                minPrice={searchParams.get('minPrice') || ''}
                maxPrice={searchParams.get('maxPrice') || ''}
                onFilter={(key, val) => { setFilter(key, val); setIsFilterOpen(false) }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterPanel({ categories, activeCategory, activeSize, minPrice, maxPrice, onFilter }: any) {
  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilter('category', null)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: !activeCategory ? 'var(--text-primary)' : 'transparent',
              color: !activeCategory ? 'var(--bg)' : 'var(--text-secondary)',
            }}
          >
            All Categories
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => onFilter('category', cat.slug)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: activeCategory === cat.slug ? 'var(--text-primary)' : 'transparent',
                color: activeCategory === cat.slug ? 'var(--bg)' : 'var(--text-secondary)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onFilter('size', activeSize === size ? null : size)}
              className="size-btn"
              style={{
                background: activeSize === size ? 'var(--text-primary)' : 'transparent',
                color: activeSize === size ? 'var(--bg)' : 'var(--text-secondary)',
                borderColor: activeSize === size ? 'var(--text-primary)' : 'var(--border)',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Price Range
        </h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => onFilter('minPrice', localMin || null)}
            className="input text-sm"
            min={0}
          />
          <span style={{ color: 'var(--text-tertiary)' }}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => onFilter('maxPrice', localMax || null)}
            className="input text-sm"
            min={0}
          />
        </div>
      </div>
    </div>
  )
}
