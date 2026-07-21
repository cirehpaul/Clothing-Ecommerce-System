import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const LINKS = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'T-Shirts', href: '/category/t-shirts' },
    { label: 'Polo Shirts', href: '/category/polo-shirts' },
    { label: 'Hoodies', href: '/category/hoodies' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Sale', href: '/products?sale=true' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Addresses', href: '/account/addresses' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base"
                style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>J</div>
              <span className="font-black text-2xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>JŌNEL</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Premium clothing crafted for modern life. Every piece tells a story of quality, comfort, and contemporary design.
            </p>
            {/* Contact */}
            <div className="space-y-2.5">
              {[
                { icon: Mail, text: 'hello@jonel.ph' },
                { icon: Phone, text: '+63 917 123 4567' },
                { icon: MapPin, text: 'Manila, Philippines' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Shop', links: LINKS.shop },
            { title: 'Account', links: LINKS.account },
            { title: 'Help', links: LINKS.help },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors hover:opacity-100"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Subscribe to our newsletter
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get exclusive deals, style tips, and new arrivals straight to your inbox.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="input flex-1 md:w-64"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} JŌNEL Clothing. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Twitter, href: '#', label: 'Twitter' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>We accept:</span>
            {['GCash', 'Maya', 'COD'].map((method) => (
              <span key={method} className="text-xs font-medium px-2 py-1 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
