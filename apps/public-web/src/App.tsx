import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import StorefrontLayout from '@/components/layout/StorefrontLayout'
import PageLoader from '@/components/common/PageLoader'

import Preloader from '@/components/common/Preloader'

// ── Storefront Pages (all public) ─────────────────────────
const HomePage = lazy(() => import('@/features/shop/pages/HomePage'))
const ProductsPage = lazy(() => import('@/features/shop/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/features/shop/pages/ProductDetailPage'))
const CategoryPage = lazy(() => import('@/features/shop/pages/CategoryPage'))

export default function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <>
      <Preloader />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Storefront ─── */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    </>
  )
}
