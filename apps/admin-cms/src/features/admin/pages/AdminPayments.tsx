import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments-pending'],
    queryFn: async () => { const { data } = await api.get('/admin/payments/pending'); return data.data },
    refetchInterval: 30000,
  })

  const verifyMut = useMutation({
    mutationFn: async (id: string) => api.put(`/admin/payments/${id}/verify`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments-pending'] }); toast.success('Payment verified!') },
    onError: () => toast.error('Failed to verify'),
  })

  const rejectMut = useMutation({
    mutationFn: async (id: string) => api.put(`/admin/payments/${id}/reject`, { reason: 'Rejected by admin' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments-pending'] }); toast.success('Payment rejected') },
    onError: () => toast.error('Failed to reject'),
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Payment Verification</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Review and verify customer payment proofs
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : data?.length === 0 ? (
        <div className="card p-16 text-center">
          <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#16A34A' }} />
          <p className="font-semibold">All caught up!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>No pending payments to verify.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((payment: any) => (
            <div key={payment.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold">{payment.order?.orderNumber}</span>
                    <span className="badge badge-warning">Pending Verification</span>
                  </div>
                  <p className="font-semibold">{payment.order?.user?.firstName} {payment.order?.user?.lastName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{payment.order?.user?.email}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span><strong>Method:</strong> <span className="capitalize">{payment.method}</span></span>
                    <span><strong>Amount:</strong> {formatPrice(payment.amount)}</span>
                    <span><strong>Submitted:</strong> {formatDateTime(payment.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { if (confirm('Verify this payment?')) verifyMut.mutate(payment.id) }}
                    disabled={verifyMut.isPending}
                    className="btn btn-sm gap-1.5"
                    style={{ background: '#DCFCE7', color: '#16A34A', border: 'none' }}
                  >
                    <CheckCircle size={14} /> Verify
                  </button>
                  <button
                    onClick={() => { if (confirm('Reject this payment?')) rejectMut.mutate(payment.id) }}
                    disabled={rejectMut.isPending}
                    className="btn btn-sm gap-1.5"
                    style={{ background: '#FEF2F2', color: '#DC2626', border: 'none' }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>

              {/* Payment Proofs */}
              {payment.proofs?.length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Payment Proofs
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {payment.proofs.map((proof: any) => (
                      <a key={proof.id} href={proof.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={proof.imageUrl}
                          alt="Payment proof"
                          className="w-28 h-28 object-cover rounded-xl border hover:scale-105 transition-transform"
                          style={{ borderColor: 'var(--border)' }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
