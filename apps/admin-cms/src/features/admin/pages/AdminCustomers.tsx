import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingBag } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/common/Skeleton'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (search) params.set('search', search)
      const { data } = await api.get(`/admin/customers?${params}`)
      return data
    },
    placeholderData: (prev) => prev,
  })

  const customers = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Customers</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{meta?.total || 0} registered customers</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input pl-8 text-sm max-w-md"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array(6).fill(0).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : customers.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.firstName} {c.lastName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm">{c.phone || '—'}</span></td>
                  <td>
                    <div className="flex items-center gap-1 text-sm">
                      <ShoppingBag size={13} style={{ color: 'var(--text-tertiary)' }} />
                      {c.totalOrders}
                    </div>
                  </td>
                  <td><span className="font-semibold text-sm">{formatPrice(c.totalSpending)}</span></td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDateTime(c.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            {!isLoading && customers.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-sm font-medium"
                style={{ background: page === p ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: page === p ? 'var(--bg)' : 'var(--text-secondary)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
