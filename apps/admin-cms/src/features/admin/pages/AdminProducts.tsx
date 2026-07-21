import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Archive, Star, Eye, Package } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (search) params.set('search', search)
      const { data } = await api.get(`/products?${params}`)
      return data
    },
    placeholderData: (prev) => prev,
  })

  const archiveMut = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Product archived')
    },
  })

  const products = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Products</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {meta?.total || 0} total products
          </p>
        </div>
        <Link to="/admin/products/new" id="add-product-btn" className="btn btn-primary gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input pl-8 text-sm max-w-md"
          id="product-search"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(6).fill(0).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : products.map((product: any) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--bg-tertiary)' }}>
                            <Package size={16} style={{ color: 'var(--text-tertiary)' }} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs">{product.sku}</span></td>
                    <td>
                      <div>
                        <span className="font-semibold text-sm">{formatPrice(product.salePrice || product.price)}</span>
                        {product.salePrice && (
                          <span className="text-xs line-through block" style={{ color: 'var(--text-tertiary)' }}>
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-semibold" style={{ color: product.totalStock === 0 ? '#DC2626' : product.totalStock <= 10 ? '#EA580C' : 'var(--text-primary)' }}>
                        {product.totalStock}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {product.isFeatured && <span className="badge" style={{ background: '#7c3aed20', color: '#7C3AED', fontSize: '0.6rem' }}>Featured</span>}
                        {product.isNewArrival && <span className="badge badge-new" style={{ fontSize: '0.6rem' }}>New</span>}
                        {product.isBestSeller && <span className="badge" style={{ background: '#d9770620', color: '#D97706', fontSize: '0.6rem' }}>Best Seller</span>}
                        {!product.isFeatured && !product.isNewArrival && !product.isBestSeller && (
                          <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', fontSize: '0.6rem' }}>Standard</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {product.averageRating && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star size={11} style={{ color: '#F59E0B' }} fill="#F59E0B" />
                          <span>{parseFloat(product.averageRating).toFixed(1)}</span>
                          <span style={{ color: 'var(--text-tertiary)' }}>({product.totalReviews})</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/${product.slug}`}
                          target="_blank"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-tertiary)]"
                          style={{ color: 'var(--text-tertiary)' }}
                          title="View"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-tertiary)]"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Archive "${product.name}"?`)) archiveMut.mutate(product.id)
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                          style={{ color: '#DC2626' }}
                          title="Archive"
                        >
                          <Archive size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                    No products found.{' '}
                    <Link to="/admin/products/new" className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Add your first product →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-sm font-medium"
                style={{ background: page === p ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: page === p ? 'var(--bg)' : 'var(--text-secondary)' }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
