import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, UserPlus, Check, X } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Logo from '@/components/common/Logo'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const passwordValue = watch('password') || ''
  const hasMinLength = passwordValue.length >= 8
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(passwordValue)

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/register', data)
      toast.success('Account created successfully. Please sign in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
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
        <Link to="/" className="inline-block z-10 relative">
          <Logo />
        </Link>
        <div className="z-10 relative">
          <span className="text-xs font-bold tracking-widest uppercase opacity-50 block mb-4">
            Admin Portal
          </span>
          <h2 className="text-5xl font-black mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-display)' }}>
            Join the team.
          </h2>
          <p className="text-lg opacity-70 max-w-md">
            Create an administrator account to manage products, orders, and premium experiences.
          </p>
        </div>
        <p className="text-sm opacity-30 z-10 relative">© {new Date().getFullYear()} TIMELESS Clothing</p>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-white/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      </motion.div>

      {/* Right Register Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-sm py-12">
          {/* Logo */}
          <Link to="/" className="inline-block mb-10 group lg:hidden">
            <Logo />
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}>
              <UserPlus size={15} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h1 className="text-2xl font-black">Create Account</h1>
          </div>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Enter your details below to create an admin account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="Jonel Doe"
                autoComplete="name"
                className={`input ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@timeless.com"
                autoComplete="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Phone Number <span className="opacity-50 font-normal">(Optional)</span></label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+63 912 345 6789"
                autoComplete="tel"
                className={`input ${errors.phone ? 'input-error' : ''}`}
              />
              {errors.phone && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.phone.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordValue.length > 0 && (
                <div className="mt-2 flex gap-4 text-[11px] font-medium">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-400 dark:text-gray-600'}`}>
                    {hasMinLength ? <Check size={12} /> : <X size={12} />} 8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-green-600' : 'text-gray-400 dark:text-gray-600'}`}>
                    {hasNumberOrSymbol ? <Check size={12} /> : <X size={12} />} Number/Symbol
                  </span>
                </div>
              )}

              {errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full justify-center gap-2"
              >
                {isSubmitting ? <span className="spinner" /> : null}
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--text-primary)' }} className="font-semibold underline hover:opacity-80 transition-opacity">
                  Sign In
                </Link>
              </p>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  )
}
