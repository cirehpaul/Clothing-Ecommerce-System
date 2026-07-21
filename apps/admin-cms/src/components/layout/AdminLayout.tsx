import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, Tag, ShoppingCart, CreditCard,
  Users, BarChart2, Warehouse, Ticket, Settings, LogOut,
  Bell, ChevronRight, Menu, X, Image, Megaphone, FileText
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Tag, label: 'Categories', href: '/categories' },
  { icon: Warehouse, label: 'Inventory', href: '/inventory' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: CreditCard, label: 'Payments', href: '/payments' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: BarChart2, label: 'Reports', href: '/reports' },
  { icon: Ticket, label: 'Coupons', href: '/coupons' },
  { icon: Image, label: 'Banners', href: '/banners' },
  { icon: Megaphone, label: 'Announcements', href: '/announcements' },
  { icon: FileText, label: 'Content Pages', href: '/pages' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    logout()
    navigate('/login')
    toast.success('Logged out')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black"
            style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>J</div>
          <div>
            <p className="font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>JŌNEL</p>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Admin CMS</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setIsMobileOpen(false)}
                className={cn('sidebar-item', active && 'active')}
              >
                <Icon size={16} />
                <span>{label}</span>
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
          style={{ background: 'var(--bg-tertiary)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
            {user ? getInitials(user.firstName, user.lastName || 'A') : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] capitalize" style={{ color: 'var(--text-tertiary)' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-left"
          style={{ color: '#DC2626' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'var(--overlay)' }}
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-56 flex flex-col lg:hidden border-r"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="btn btn-ghost p-2 rounded-lg lg:hidden">
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {NAV_ITEMS.find((n) => location.pathname.startsWith(n.href) && (n.href !== '/' || location.pathname === '/'))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative btn btn-ghost p-2 rounded-lg">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
