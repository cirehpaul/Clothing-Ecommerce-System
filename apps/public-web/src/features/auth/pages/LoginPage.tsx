import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Lock } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data)
      const { user, token } = res.data.data
      if (user.role !== 'admin' && user.role !== 'staff') {
        toast.error('Admin access only')
        return
      }
      setAuth(user, token)
      toast.success(`Welcome back, ${user.firstName}!`)
      navigate('/admin')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left Brand Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden"
        style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
      >
        <Link to="/" className="flex items-center gap-2 z-10 relative">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black border"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}>J</div>
          <span className="font-black text-2xl" style={{ fontFamily: 'var(--font-display)' }}>JŌNEL</span>
        </Link>
        <div className="z-10 relative">
          <span className="text-xs font-bold tracking-widest uppercase opacity-50 block mb-4">
            Admin Portal
          </span>
          <h2 className="text-5xl font-black leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Manage your<br />store with ease.
          </h2>
          <p className="text-base opacity-60 max-w-xs leading-relaxed">
            Access your dashboard, manage products, track orders, and grow your business.
          </p>
        </div>
        <p className="text-sm opacity-30 z-10 relative">© {new Date().getFullYear()} JŌNEL Clothing</p>
        {/* Decorative */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="absolute right-20 -top-10 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden justify-center">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black"
              style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>J</div>
            <span className="font-black text-2xl" style={{ fontFamily: 'var(--font-display)' }}>JŌNEL</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}>
              <Lock size={15} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h1 className="text-2xl font-black">Admin Sign In</h1>
          </div>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Authorized personnel only. Visit the{' '}
            <Link to="/" style={{ color: 'var(--text-primary)' }} className="font-semibold underline">
              store
            </Link>{' '}to browse.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@jonel.com"
                autoComplete="email"
                id="admin-email"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  id="admin-password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="admin-login-btn"
              className="btn btn-primary btn-lg w-full justify-center gap-2"
            >
              {isSubmitting ? <span className="spinner" /> : null}
              {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Demo Credentials</p>
            <p>Email: <strong>admin@jonel.com</strong></p>
            <p>Password: <strong>admin123</strong></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
