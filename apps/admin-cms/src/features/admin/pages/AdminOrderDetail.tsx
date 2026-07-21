import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Truck } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import toast from 'react-hot-toast'

const ORDER_STATUSES = [
  'pending', 'waiting_payment', 'payment_verified', 'preparing',
  'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled',
]

export default function AdminOrderDetail() {
  const { id } = useParams()
  const qc = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => { const { data } = await api.get(`/admin/orders`); return data.data.find((o: any) => o.id === id) },
    enabled: !!id,
  })

  const updateStatus = useMutation({
    mutationFn: async () => api.put(`/admin/orders/${id}/status`, { status: selectedStatus }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-order', id] }); toast.success('Order status updated') },
    onError: () => toast.error('Failed to update status'),
  })

  const updateTracking = useMutation({
    mutationFn: async () => api.put(`/admin/orders/${id}/tracking`, { trackingNumber, carrier }),
    onSuccess: () => toast.success('Tracking updated'),
    onError: () => toast.error('Failed to update tracking'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
  if (!order) return <div className="text-center py-20" style={{ color: 'var(--text-tertiary)' }}>Order not found</div>

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/orders" className="btn btn-ghost p-2 rounded-lg"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-black">Order {order.orderNumber}</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{formatDateTime(order.createdAt)}</p>
        </div>
        <span className="badge ml-auto" style={{ background: getOrderStatusColor(order.status) + '20', color: getOrderStatusColor(order.status) }}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card overflow-hidden">
            <div className="p-4 border-b font-semibold text-sm" style={{ borderColor: 'var(--border)' }}>Order Items</div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {item.sizeName} / {item.colorName} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-sm">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-1.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              {[
                { label: 'Subtotal', value: formatPrice(order.subtotal) },
                { label: 'Shipping', value: parseFloat(order.shippingFee) > 0 ? formatPrice(order.shippingFee) : 'Free' },
                { label: 'Discount', value: parseFloat(order.discount) > 0 ? `- ${formatPrice(order.discount)}` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-black pt-2 border-t text-base" style={{ borderColor: 'var(--border)' }}>
                <span>Total</span>
                <span>{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4">Update Order Status</h3>
            <div className="flex gap-3">
              <select
                value={selectedStatus || order.status}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input flex-1"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                ))}
              </select>
              <button
                onClick={() => updateStatus.mutate()}
                disabled={updateStatus.isPending}
                className="btn btn-primary gap-2"
              >
                {updateStatus.isPending && <span className="spinner" />}
                Update
              </button>
            </div>
          </div>

          {/* Tracking */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Truck size={15} /> Shipping & Tracking</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label">Tracking Number</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="input" placeholder="1Z999AA10123456784" />
              </div>
              <div>
                <label className="label">Carrier</label>
                <input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="input" placeholder="J&T, LBC, etc." />
              </div>
            </div>
            <button onClick={() => updateTracking.mutate()} disabled={updateTracking.isPending} className="btn btn-secondary gap-2">
              {updateTracking.isPending && <span className="spinner" />}
              Save Tracking
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer Info */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4">Customer</h3>
            <p className="font-semibold">{order.user?.firstName} {order.user?.lastName}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{order.user?.email}</p>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4">Shipping Address</h3>
              <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine}</p>
                <p>{order.shippingAddress.barangay}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4">Payment</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              {order.payments?.[0] && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-tertiary)' }}>Status</span>
                  <span className={`badge ${order.payments[0].status === 'verified' ? 'badge-success' : order.payments[0].status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {order.payments[0].status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
