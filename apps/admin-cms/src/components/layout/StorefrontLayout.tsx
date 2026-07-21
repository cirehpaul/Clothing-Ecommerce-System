import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SearchModal from '@/components/common/SearchModal'

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SearchModal />
    </div>
  )
}
