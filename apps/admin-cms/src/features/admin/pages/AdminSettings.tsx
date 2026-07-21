import { Save } from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Global Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage website branding, contact info, and footer links.</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5 space-y-4">
          <h3 className="font-bold border-b pb-2">Branding</h3>
          <div>
            <label className="label">Store Name</label>
            <input type="text" className="input" defaultValue="JŌNEL Clothing" />
          </div>
          <div>
            <label className="label">Store Description (SEO)</label>
            <textarea className="input min-h-[100px]" defaultValue="Premium minimalist streetwear." />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-bold border-b pb-2">Contact Information</h3>
          <div>
            <label className="label">Support Email</label>
            <input type="email" className="input" defaultValue="support@jonel.com" />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="text" className="input" defaultValue="+63 912 345 6789" />
          </div>
          <div>
            <label className="label">Store Address</label>
            <textarea className="input min-h-[60px]" defaultValue="Manila, Philippines" />
          </div>
        </div>
      </div>
    </div>
  )
}
