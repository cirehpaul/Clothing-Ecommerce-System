import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Star, Shield, Truck, RotateCcw } from 'lucide-react'
import { useFeaturedProducts, useNewArrivals, useBestSellers, useCategories } from '@/features/shop/hooks/useProducts'
import ProductCard from '@/components/common/ProductCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
]

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₱1,500' },
  { icon: Shield, title: 'Secure Payment', desc: 'GCash, Maya, COD' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Star, title: 'Premium Quality', desc: '100% authentic products' },
]

const TESTIMONIALS = [
  {
    name: 'Maria Santos',
    avatar: 'https://i.pravatar.cc/48?img=1',
    rating: 5,
    text: 'Absolutely love the quality! The fabric is so soft and the fit is perfect. Will definitely be ordering more.',
    product: 'Essential Cotton Tee',
  },
  {
    name: 'Juan dela Cruz',
    avatar: 'https://i.pravatar.cc/48?img=3',
    rating: 5,
    text: 'Fast delivery and the packaging was beautiful. The hoodie is worth every peso — thick, cozy, and stylish.',
    product: 'Minimalist Hoodie',
  },
  {
    name: 'Ana Reyes',
    avatar: 'https://i.pravatar.cc/48?img=5',
    rating: 5,
    text: 'TIMELESS is my go-to brand now. The oversized tee fits perfectly and gets so many compliments.',
    product: 'Oversized Drop Shoulder Tee',
  },
]

function SectionHeader({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10"
    >
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
      <h2 className="text-3xl lg:text-4xl font-black mt-2 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      {desc && <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>{desc}</p>}
    </motion.div>
  )
}

function ProductRow({ title, label, desc, products, isLoading, linkHref }: any) {
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
            <h2 className="text-2xl lg:text-3xl font-black mt-1" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
            {desc && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{desc}</p>}
          </motion.div>
          <Link to={linkHref} className="btn btn-secondary btn-sm gap-1 hidden md:flex">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="product-grid">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.slice(0, 4).map((p: any, i: number) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link to={linkHref} className="btn btn-secondary gap-2">
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { data: featured, isLoading: fl } = useFeaturedProducts()
  const { data: newArrivals, isLoading: nl } = useNewArrivals()
  const { data: bestSellers, isLoading: bl } = useBestSellers()
  const { data: categories } = useCategories()

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[0]}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgb(0 0 0 / 0.7) 0%, rgb(0 0 0 / 0.3) 60%, transparent 100%)' }} />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
              style={{ background: 'rgb(255 255 255 / 0.15)', color: 'white', backdropFilter: 'blur(8px)' }}
            >
              ✦ New Collection 2026
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Wear Your<br />
              <span style={{ color: '#E5E5E5' }}>Story.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-white/80 mb-8 max-w-sm leading-relaxed"
            >
              Premium clothing crafted for modern life. Every piece is designed to make you feel as good as you look.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/products"
                className="btn btn-lg gap-2"
                style={{ background: 'white', color: '#111111', borderColor: 'white' }}
              >
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link
                to="/products?sort=newest"
                className="btn btn-lg gap-2"
                style={{ background: 'transparent', color: 'white', borderColor: 'rgb(255 255 255 / 0.4)' }}
              >
                New Arrivals <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-10 right-0 flex gap-8 pr-6"
          >
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  <Icon size={18} style={{ color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader label="Browse" title="Shop by Category" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((cat: any, i: number) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/category/${cat.slug}`} className="block group">
                    <div className="rounded-2xl overflow-hidden aspect-square relative"
                      style={{ background: 'var(--bg-tertiary)' }}>
                      {cat.image && (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                      )}
                      <div className="absolute inset-0 flex items-end p-3"
                        style={{ background: 'linear-gradient(to top, rgb(0 0 0 / 0.5), transparent)' }}>
                        <span className="text-white text-sm font-bold">{cat.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ─────────────────────────── */}
      <div style={{ background: 'var(--bg-secondary)' }}>
        <ProductRow
          label="Curated"
          title="Featured Products"
          desc="Hand-picked styles for every occasion"
          products={featured}
          isLoading={fl}
          linkHref="/products?featured=true"
        />
      </div>

      {/* ── PROMO BANNER ─────────────────────────────── */}
      <section>
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl px-8 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: 'linear-gradient(135deg, #111111 0%, #333 100%)' }}
          >
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-white/50">Limited Time</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Flash Sale: Up to<br />
                <span style={{ color: '#FCD34D' }}>40% Off Selected</span>
              </h2>
              <p className="text-white/70 text-sm max-w-xs">
                Grab your favorite pieces at incredible prices. Limited stock available.
              </p>
            </div>
            <Link
              to="/products?sale=true"
              className="btn btn-lg flex-shrink-0"
              style={{ background: 'white', color: '#111111' }}
            >
              Shop Sale <ArrowRight size={16} />
            </Link>
            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: 'white' }} />
            <div className="absolute -right-4 -bottom-16 w-64 h-64 rounded-full opacity-5" style={{ background: 'white' }} />
          </motion.div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────── */}
      <ProductRow
        label="Fresh"
        title="New Arrivals"
        desc="The latest additions to our collection"
        products={newArrivals}
        isLoading={nl}
        linkHref="/products?sort=newest"
      />

      {/* ── BEST SELLERS ─────────────────────────────── */}
      <div style={{ background: 'var(--bg-secondary)' }}>
        <ProductRow
          label="Popular"
          title="Best Sellers"
          desc="Our most-loved styles by our community"
          products={bestSellers}
          isLoading={bl}
          linkHref="/products?sort=popular"
        />
      </div>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeader label="Reviews" title="What Our Customers Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, avatar, rating, text, product }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="star-filled" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
