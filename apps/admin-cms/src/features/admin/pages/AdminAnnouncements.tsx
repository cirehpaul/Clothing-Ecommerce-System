import { useState } from 'react'
import { Plus, Edit2, Trash2, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminAnnouncements() {
  const [items, setItems] = useState([
    { id: 1, message: 'Free shipping on all orders over ₱3,000!', isActive: true },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage sitewide announcement bars.</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2">
          <Plus size={16} /> Add Announcement
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Megaphone size={16} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{item.message}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {item.isActive ? 'ACTIVE' : 'INACTIVE'}
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
