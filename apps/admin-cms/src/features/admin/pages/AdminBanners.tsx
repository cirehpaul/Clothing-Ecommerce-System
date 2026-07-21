import { useState } from 'react'
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminBanners() {
  const [banners, setBanners] = useState([
    { id: 1, title: 'Summer Collection', type: 'hero', isActive: true },
    { id: 2, title: 'Flash Sale 50% OFF', type: 'promotional', isActive: false },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Banners</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage homepage hero and promotional banners.</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <motion.div key={banner.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={20} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold">{banner.title}</h3>
                <p className="text-xs text-gray-500 capitalize">{banner.type} Banner</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <button className="btn btn-ghost p-2"><Edit2 size={14} /></button>
              <button className="btn btn-ghost p-2 text-red-500"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
