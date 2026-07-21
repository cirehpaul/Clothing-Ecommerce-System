import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--bg-tertiary)' }}>
          <Mail size={28} style={{ color: 'var(--text-primary)' }} />
        </div>
        <h1 className="text-2xl font-black mb-2">Forgot Password?</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
          <div>
            <label className="label">Email Address</label>
            <input type="email" placeholder="you@example.com" className="input" />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            Send Reset Link
          </button>
        </form>
        <Link to="/login" className="inline-flex items-center gap-2 mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </motion.div>
    </div>
  )
}
