import { useState } from 'react'
import { Plus, Edit2, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminPages() {
  const queryClient = useQueryClient()
  const [editingPage, setEditingPage] = useState<any>(null)

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data } = await api.get('/admin/pages')
      return data.data
    }
  })

  const updatePage = useMutation({
    mutationFn: async (updatedPage: any) => {
      const { data } = await api.put(`/admin/pages/${updatedPage.id}`, updatedPage)
      return data.data
    },
    onSuccess: () => {
      toast.success('Page updated successfully')
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      setEditingPage(null)
    },
    onError: () => {
      toast.error('Failed to update page')
    }
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPage) return
    updatePage.mutate(editingPage)
  }

  if (isLoading) return <div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>Loading pages...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Content Pages</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage text content for policies and info pages.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pages.map((page: any) => (
          <motion.div key={page.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                <FileText size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{page.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${page.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {page.isPublished ? 'PUBLISHED' : 'DRAFT'}
              </span>
              <button 
                className="btn btn-ghost p-2"
                onClick={() => setEditingPage(page)}
              >
                <Edit2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit {editingPage.title}</h2>
                <button onClick={() => setEditingPage(null)} className="btn btn-ghost p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                <div className="space-y-4 overflow-y-auto pr-2 pb-4 flex-1">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input 
                      type="text" 
                      className="input w-full" 
                      value={editingPage.title}
                      onChange={e => setEditingPage({...editingPage, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Content (HTML allowed)</label>
                    <textarea 
                      className="input w-full h-64 font-mono text-sm resize-none" 
                      value={editingPage.content}
                      onChange={e => setEditingPage({...editingPage, content: e.target.value})}
                      placeholder="<p>Enter your content here...</p>"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={editingPage.isPublished}
                      onChange={e => setEditingPage({...editingPage, isPublished: e.target.checked})}
                    />
                    <span className="text-sm font-medium">Published</span>
                  </label>
                </div>
                
                <div className="pt-4 border-t flex justify-end gap-3 mt-auto" style={{ borderColor: 'var(--border)' }}>
                  <button 
                    type="button"
                    onClick={() => setEditingPage(null)} 
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={updatePage.isPending}
                  >
                    {updatePage.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
