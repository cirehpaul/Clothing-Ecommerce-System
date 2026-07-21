import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useUIStore } from '@/stores/uiStore'
import Logo from '@/components/common/Logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'T-Shirts', href: '/category/t-shirts' },
  { label: 'Hoodies', href: '/category/hoodies' },
  { label: 'Polo', href: '/category/polo-shirts' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Sale', href: '/products?sale=true' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isDark, toggle } = useThemeStore()
  const { openSearch, isMobileNavOpen, openMobileNav, closeMobileNav } = useUIStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { closeMobileNav() }, [location.pathname])

  return (
    <>
      {/* Sale Banner */}
      <div style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
        className="text-center py-2 text-xs font-medium tracking-wider overflow-hidden">
        <div className="marquee-track">
          {Array(4).fill(null).map((_, i) => (
            <span key={i}>✦ FREE SHIPPING ON ORDERS ₱1,500+&nbsp;&nbsp;&nbsp;✦ USE CODE WELCOME10 FOR 10% OFF&nbsp;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'color-mix(in srgb, var(--bg) 95%, transparent)' : 'var(--bg)',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgb(0 0 0 / 0.08)' : 'none',
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-2">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    location.pathname === link.href.split('?')[0] && link.href.split('?')[0] !== '/'
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={openSearch} className="btn btn-ghost p-2 rounded-lg" aria-label="Search">
                <Search size={18} />
              </button>
              <button onClick={toggle} className="btn btn-ghost p-2 rounded-lg" aria-label="Toggle theme">
                <motion.div key={isDark ? 'moon' : 'sun'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </button>
              <button
                onClick={isMobileNavOpen ? closeMobileNav : openMobileNav}
                className="btn btn-ghost p-2 rounded-lg lg:hidden"
                aria-label="Menu"
              >
                {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: 'var(--overlay)' }}
              onClick={closeMobileNav}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden fixed top-[88px] left-0 right-0 z-40 border-b shadow-xl"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
            >
              <nav className="container py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-3 rounded-lg text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
