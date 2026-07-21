import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, ...payload } = data
      const res = await api.post('/auth/register', payload)
      setAuth(res.data.data.user, res.data.data.token)
      toast.success('Account created! Welcome to JŌNEL!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black"
            style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>J</div>
          <span className="font-black text-2xl" style={{ fontFamily: 'var(--font-display)' }}>JŌNEL</span>
        </Link>

        <h1 className="text-2xl font-black mb-1">Create Account</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold underline" style={{ color: 'var(--text-primary)' }}>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name</label>
              <input {...register('firstName')} placeholder="Juan" className={`input ${errors.firstName ? 'input-error' : ''}`} />
              {errors.firstName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register('lastName')} placeholder="Dela Cruz" className={`input ${errors.lastName ? 'input-error' : ''}`} />
              {errors.lastName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <input {...register('email')} type="email" placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`} />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Phone Number <span style={{ color: 'var(--text-tertiary)' }}>(optional)</span></label>
            <input {...register('phone')} type="tel" placeholder="+63 917 123 4567" className="input" />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Repeat password"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
            />
            {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full justify-center gap-2">
            {isSubmitting && <span className="spinner" />}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: 'var(--text-tertiary)' }}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="underline">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  )
}
