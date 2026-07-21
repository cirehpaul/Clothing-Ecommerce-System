import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Ticket, ToggleLeft, ToggleRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { formatDateTime, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminCoupons() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => { const { data } = await api.get('/admin/coupons'); return data.data },
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{
    code: string; description: string; type: string; value: string; minPurchase: string; maxDiscount: string; usageLimit: number
  }>()

  const createMut = useMutation({
    mutationFn: async (d: any) => api.post('/admin/coupons', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-coupons'] })
      toast.success('Coupon created')
      setShowForm(false)
      reset()
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed'),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Coupons</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage discount codes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold mb-4">New Coupon</h3>
          <form onSubmit={handleSubmit((d) => createMut.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Code *</label>
                <input {...register('code', { required: true })} className="input uppercase" placeholder="WELCOME10" />
              </div>
              <div>
                <label className="label">Type *</label>
                <select {...register('type', { required: true })} className="input">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₱)</option>
                </select>
              </div>
              <div>
                <label className="label">Value *</label>
                <input {...register('value', { required: true })} className="input" placeholder="10" />
              </div>
              <div>
                <label className="label">Min Purchase (₱)</label>
                <input {...register('minPurchase')} className="input" placeholder="500" />
              </div>
              <div>
                <label className="label">Max Discount (₱)</label>
                <input {...register('maxDiscount')} className="input" placeholder="200" />
              </div>
              <div>
                <label className="label">Usage Limit</label>
                <input {...register('usageLimit')} type="number" className="input" placeholder="Unlimited" />
              </div>
              <div className="md:col-span-3">
                <label className="label">Description</label>
                <input {...register('description')} className="input" placeholder="10% off your first order" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); reset() }} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary gap-2">
                {isSubmitting && <span className="spinner" />} Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="spinner" /></div>
      ) : coupons?.length === 0 ? (
        <div className="card p-16 text-center">
          <Ticket size={40} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <p className="font-semibold mb-1">No coupons yet</p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Create your first discount code</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons?.map((coupon: any) => (
            <div key={coupon.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono font-black text-lg tracking-wider">{coupon.code}</span>
                <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {coupon.description && (
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{coupon.description}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p style={{ color: 'var(--text-tertiary)' }}>Discount</p>
                  <p className="font-bold text-base">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-tertiary)' }}>Used</p>
                  <p className="font-bold text-base">
                    {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                  </p>
                </div>
                {coupon.minPurchase && (
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }}>Min. Purchase</p>
                    <p className="font-semibold">{formatPrice(coupon.minPurchase)}</p>
                  </div>
                )}
                {coupon.maxDiscount && (
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }}>Max. Discount</p>
                    <p className="font-semibold">{formatPrice(coupon.maxDiscount)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
