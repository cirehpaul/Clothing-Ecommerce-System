import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  material: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  salePrice: z.string().optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  sku: z.string().min(1, 'SKU is required'),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isEdit = !!id

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data.data },
  })

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`)
      return data.data
    },
    enabled: isEdit,
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: product ? {
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId || '',
      brand: product.brand || '',
      material: product.material || '',
      price: product.price,
      salePrice: product.salePrice || '',
      discount: product.discount || 0,
      sku: product.sku,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
    } : undefined,
  })

  const saveMut = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        discount: data.discount || 0,
        salePrice: data.salePrice || undefined,
        categoryId: data.categoryId || undefined,
      }
      if (isEdit) {
        return api.put(`/admin/products/${id}`, payload)
      }
      return api.post('/admin/products', payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      navigate('/admin/products')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to save'),
  })

  const BOOLEAN_FIELDS = [
    { name: 'isFeatured' as const, label: 'Featured Product' },
    { name: 'isBestSeller' as const, label: 'Best Seller' },
    { name: 'isNewArrival' as const, label: 'New Arrival' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {isEdit ? 'Update product information' : 'Fill in the details to create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => saveMut.mutate(d))} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-sm">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Product Name *</label>
              <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Essential Cotton Tee" />
              {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">SKU *</label>
              <input {...register('sku')} className={`input ${errors.sku ? 'input-error' : ''}`} placeholder="JNL-ECT-001" />
              {errors.sku && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.sku.message}</p>}
            </div>

            <div>
              <label className="label">Category</label>
              <select {...register('categoryId')} className="input">
                <option value="">Select category</option>
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Brand</label>
              <input {...register('brand')} className="input" placeholder="JŌNEL" />
            </div>

            <div>
              <label className="label">Material</label>
              <input {...register('material')} className="input" placeholder="100% Cotton" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea {...register('description')} rows={4} className="input resize-none" placeholder="Product description..." />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-sm">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (₱) *</label>
              <input {...register('price')} type="text" className={`input ${errors.price ? 'input-error' : ''}`} placeholder="899.00" />
              {errors.price && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.price.message}</p>}
            </div>
            <div>
              <label className="label">Sale Price (₱)</label>
              <input {...register('salePrice')} type="text" className="input" placeholder="699.00" />
            </div>
            <div>
              <label className="label">Discount (%)</label>
              <input {...register('discount')} type="number" min={0} max={100} className="input" placeholder="0" />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6 space-y-3">
          <h2 className="font-bold text-sm">Product Tags</h2>
          <div className="flex flex-col gap-3">
            {BOOLEAN_FIELDS.map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input {...register(name)} type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary gap-2 flex-1 justify-center">
            {isSubmitting ? <span className="spinner" /> : <Save size={16} />}
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  )
}
