import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data.data },
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; description: string }>()

  const saveMut = useMutation({
    mutationFn: async (d: { name: string; description: string }) => {
      if (editing) {
        return api.put(`/admin/categories/${editing.id}`, d)
      }
      return api.post('/admin/categories', d)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(editing ? 'Category updated' : 'Category created')
      setShowForm(false)
      setEditing(null)
      reset()
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed'),
  })

  const deleteMut = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category deactivated')
    },
  })

  const openEdit = (cat: any) => {
    setEditing(cat)
    reset({ name: cat.name, description: cat.description || '' })
    setShowForm(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Categories</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage product categories</p>
        </div>
        <button onClick={() => { setEditing(null); reset(); setShowForm(true) }} className="btn btn-primary gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6">
          <h2 className="font-bold mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit((d) => saveMut.mutate(d))} className="space-y-4">
            <div>
              <label className="label">Category Name *</label>
              <input {...register('name', { required: true })} className="input" placeholder="e.g. T-Shirts" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea {...register('description')} rows={2} className="input resize-none" placeholder="Short description..." />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset() }} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary gap-2">
                {isSubmitting && <span className="spinner" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array(4).fill(0).map((_, i) => (
              <tr key={i}>
                {Array(5).fill(0).map((_, j) => (
                  <td key={j}><div className="skeleton h-4 w-full rounded" /></td>
                ))}
              </tr>
            ))}
            {categories?.map((cat: any) => (
              <tr key={cat.id}>
                <td><span className="font-semibold">{cat.name}</span></td>
                <td><span className="font-mono text-xs">{cat.slug}</span></td>
                <td><span className="text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{cat.description || '—'}</span></td>
                <td>
                  <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-secondary)' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => confirm('Deactivate category?') && deleteMut.mutate(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50" style={{ color: '#DC2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && (!categories || categories.length === 0) && (
              <tr><td colSpan={5} className="text-center py-10" style={{ color: 'var(--text-tertiary)' }}>No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
