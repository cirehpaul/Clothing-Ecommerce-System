import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye, Search, ChevronDown } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/common/Skeleton'

const STATUS_OPTIONS = ['all', 'pending', 'waiting_payment', 'payment_verified', 'preparing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (status !== 'all') params.set('status', status)
      const { data } = await api.get(`/admin/orders?${params}`)
      return data
    },
    placeholderData: (prev) => prev,
  })

  const orders = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Orders</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{meta?.total || 0} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text" placeholder="Search order #..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-8 text-sm w-56"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="input text-sm w-auto cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : getOrderStatusLabel(s)}</option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1) }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: status === s ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: status === s ? 'var(--bg)' : 'var(--text-secondary)',
            }}
          >
            {s === 'all' ? 'All' : getOrderStatusLabel(s)}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(6).fill(0).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                : orders.map((order: any) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-xs font-bold">{order.orderNumber}</span>
                    </td>
                    <td>
                      <p className="text-sm font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.user?.email}</p>
                    </td>
                    <td><span className="text-sm">{order.items?.length} items</span></td>
                    <td><span className="font-bold">{formatPrice(order.grandTotal)}</span></td>
                    <td>
                      <span className="text-xs capitalize font-medium px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className="badge"
                        style={{ background: getOrderStatusColor(order.status) + '20', color: getOrderStatusColor(order.status) }}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDateTime(order.createdAt)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)]"
                        style={{ color: 'var(--text-secondary)' }}>
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              {!isLoading && orders.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => i + 1).map((p) => (
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
