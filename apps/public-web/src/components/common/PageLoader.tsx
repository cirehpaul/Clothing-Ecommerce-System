import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl"
          style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
          J
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--text-tertiary)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
