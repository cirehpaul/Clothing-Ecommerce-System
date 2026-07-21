import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import AdminLayout from '@/components/layout/AdminLayout'
import PageLoader from '@/components/common/PageLoader'

// ── Admin Auth ────────────────────────────────────────────
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// ── Admin Pages ───────────────────────────────────────────
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'))
const AdminProducts = lazy(() => import('@/features/admin/pages/AdminProducts'))
const AdminProductForm = lazy(() => import('@/features/admin/pages/AdminProductForm'))
const AdminCategories = lazy(() => import('@/features/admin/pages/AdminCategories'))
const AdminOrders = lazy(() => import('@/features/admin/pages/AdminOrders'))
const AdminOrderDetail = lazy(() => import('@/features/admin/pages/AdminOrderDetail'))
const AdminPayments = lazy(() => import('@/features/admin/pages/AdminPayments'))
const AdminCustomers = lazy(() => import('@/features/admin/pages/AdminCustomers'))
const AdminInventory = lazy(() => import('@/features/admin/pages/AdminInventory'))
const AdminReports = lazy(() => import('@/features/admin/pages/AdminReports'))
const AdminCoupons = lazy(() => import('@/features/admin/pages/AdminCoupons'))
const AdminBanners = lazy(() => import('@/features/admin/pages/AdminBanners'))
const AdminAnnouncements = lazy(() => import('@/features/admin/pages/AdminAnnouncements'))
const AdminPages = lazy(() => import('@/features/admin/pages/AdminPages'))
const AdminSettings = lazy(() => import('@/features/admin/pages/AdminSettings'))

// ── Guards ────────────────────────────────────────────────
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin' && user?.role !== 'staff') return <Navigate to="/login" replace />
  return <>{children}</>
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated && (user?.role === 'admin' || user?.role === 'staff')) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Admin Login ──────────────────────────────── */}
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />

        {/* ── Admin Panel ──────────────────────────────── */}
        <Route path="/" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 → go to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
