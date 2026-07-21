import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Plus, Minus } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminInventory() {
  const qc = useQueryClient()
  const [adjusting, setAdjusting] = useState<{ variantId: string; name: string } | null>(null)
  const [adjQty, setAdjQty] = useState('')
  const [adjType, setAdjType] = useState<'stock_in' | 'stock_out' | 'adjustment'>('stock_in')
  const [adjReason, setAdjReason] = useState('')

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => { const { data } = await api.get('/admin/inventory'); return data.data },
  })

  const adjustMut = useMutation({
    mutationFn: async () =>
      api.post('/admin/inventory/adjust', {
        variantId: adjusting?.variantId,
        type: adjType,
        quantity: parseInt(adjQty),
        reason: adjReason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inventory'] })
      toast.success('Stock adjusted')
      setAdjusting(null)
      setAdjQty('')
      setAdjReason('')
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed'),
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Inventory</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage stock levels</p>
      </div>

      {/* Adjust Modal */}
      {adjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay)' }}>
          <div className="card p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">Adjust Stock</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>{adjusting.name}</p>
            <div className="space-y-3">
              <div>
                <label className="label">Adjustment Type</label>
                <select value={adjType} onChange={(e) => setAdjType(e.target.value as any)} className="input">
                  <option value="stock_in">Stock In (+)</option>
                  <option value="stock_out">Stock Out (-)</option>
                  <option value="adjustment">Set Exact Quantity</option>
                </select>
              </div>
              <div>
                <label className="label">Quantity</label>
                <input type="number" value={adjQty} onChange={(e) => setAdjQty(e.target.value)} className="input" placeholder="0" min={0} />
              </div>
              <div>
                <label className="label">Reason (optional)</label>
                <input value={adjReason} onChange={(e) => setAdjReason(e.target.value)} className="input" placeholder="e.g. New stock received" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setAdjusting(null)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={() => adjustMut.mutate()} disabled={!adjQty || adjustMut.isPending} className="btn btn-primary flex-1 gap-2">
                {adjustMut.isPending && <span className="spinner" />}
                Adjust
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-4">
        {isLoading && <div className="flex justify-center py-16"><div className="spinner" /></div>}
        {products?.map((product: any) => (
          <div key={product.id} className="card overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              {product.images?.[0] && (
                <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>SKU: {product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                {product.totalStock <= 10 && (
                  <AlertTriangle size={15} style={{ color: product.totalStock === 0 ? '#DC2626' : '#EA580C' }} />
                )}
                <span className="font-black text-lg" style={{ color: product.totalStock === 0 ? '#DC2626' : product.totalStock <= 10 ? '#EA580C' : 'var(--text-primary)' }}>
                  {product.totalStock}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>total</span>
              </div>
            </div>

            {/* Variants */}
            <div className="overflow-x-auto">
              <table className="data-table text-sm">
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Size</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants?.map((v: any) => (
                    <tr key={v.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border" style={{ background: v.color.hexCode, borderColor: 'var(--border)' }} />
                          {v.color.name}
                        </div>
                      </td>
                      <td><span className="font-semibold">{v.size.name}</span></td>
                      <td><span className="font-mono text-xs">{v.sku}</span></td>
                      <td>
                        <span className="font-bold" style={{ color: v.stock === 0 ? '#DC2626' : v.stock <= 5 ? '#EA580C' : 'var(--text-primary)' }}>
                          {v.stock}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setAdjusting({ variantId: v.id, name: `${product.name} - ${v.color.name} / ${v.size.name}` })}
                          className="btn btn-sm btn-secondary gap-1"
                        >
                          <Plus size={11} /> Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
