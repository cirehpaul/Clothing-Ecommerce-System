import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const logoControls = useAnimationControls()
  const bloomControls = useAnimationControls()

  useEffect(() => {
    // Progress ticker
    const ticks = [18, 38, 60, 82, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < ticks.length) { setProgress(ticks[i]); i++ }
      else clearInterval(interval)
    }, 420)

    // Logo entrance → overshoot → breathe
    const runLogoAnim = async () => {
      // 1. Entrance: scale from tiny → full with overshoot
      await logoControls.start({
        scale: [0.16, 1.04, 1.0],
        opacity: [0, 1, 1],
        transition: {
          duration: 1.9,
          times: [0, 0.78, 1],
          ease: LUXURY_EASE,
        },
      })

      // 2. Breathing — runs until dismiss
      logoControls.start({
        scale: [1.0, 1.013, 1.0],
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      })
    }

    // Bloom pulse
    const runBloom = async () => {
      await bloomControls.start({
        opacity: [0, 0.22, 0.12],
        scale: [0.6, 1.2, 1.0],
        transition: { duration: 2.2, ease: LUXURY_EASE },
      })
      bloomControls.start({
        opacity: [0.12, 0.2, 0.12],
        scale: [1.0, 1.05, 1.0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      })
    }

    runLogoAnim()
    runBloom()

    // Dismiss after 3s
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: LUXURY_EASE }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#090909',
            overscrollBehavior: 'none',
          }}
        >
          {/* ── Ambient radial glow ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(100,55,210,0.13) 0%, transparent 72%)',
            }}
          />

          {/* ── Edge vignette ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
            }}
          />

          {/* ── Corner accents ── */}
          {/* Top-left */}
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.55 }}
            transition={{ duration: 1.1, delay: 0.3, ease: LUXURY_EASE }}
            style={{
              position: 'absolute', top: 28, left: 28,
              display: 'block', width: 44, height: 1,
              transformOrigin: 'left',
              background: 'linear-gradient(to right, rgba(175,130,255,0.9), transparent)',
            }}
          />
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.55 }}
            transition={{ duration: 1.1, delay: 0.3, ease: LUXURY_EASE }}
            style={{
              position: 'absolute', top: 28, left: 28,
              display: 'block', width: 1, height: 44,
              transformOrigin: 'top',
              background: 'linear-gradient(to bottom, rgba(175,130,255,0.9), transparent)',
            }}
          />
          {/* Bottom-right */}
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.55 }}
            transition={{ duration: 1.1, delay: 0.3, ease: LUXURY_EASE }}
            style={{
              position: 'absolute', bottom: 28, right: 28,
              display: 'block', width: 44, height: 1,
              transformOrigin: 'right',
              background: 'linear-gradient(to left, rgba(175,130,255,0.9), transparent)',
            }}
          />
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.55 }}
            transition={{ duration: 1.1, delay: 0.3, ease: LUXURY_EASE }}
            style={{
              position: 'absolute', bottom: 28, right: 28,
              display: 'block', width: 1, height: 44,
              transformOrigin: 'bottom',
              background: 'linear-gradient(to top, rgba(175,130,255,0.9), transparent)',
            }}
          />

          {/* ── Logo area ── */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Animated light bloom */}
            <motion.div
              animate={bloomControls}
              style={{
                position: 'absolute',
                width: '86%',
                height: '100%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(120,70,240,0.28) 0%, transparent 68%)',
                filter: 'blur(36px)',
                pointerEvents: 'none',
                willChange: 'transform, opacity',
              }}
            />

            {/* Logo — GPU-accelerated entrance + breathing */}
            <motion.div
              animate={logoControls}
              style={{
                willChange: 'transform, opacity',
                borderRadius: '24px', // Slightly curved box corners
                overflow: 'hidden',
                // Keep a very slight feather right at the border to avoid harsh aliased edges,
                // but let the box itself be fully visible.
              }}
            >
              <img
                src="/images/preloader-logo.png"
                alt="TIMELESS SELECTION"
                style={{
                  display: 'block',
                  // Responsive: comfortable on every screen
                  width: 'clamp(220px, 68vw, 400px)',
                  height: 'auto',
                  filter:
                    'drop-shadow(0 0 32px rgba(140, 80, 255, 0.4)) drop-shadow(0 4px 24px rgba(0,0,0,0.85))',
                  // No layout shifts — keep natural ratio
                  objectFit: 'contain',
                }}
              />
            </motion.div>
          </div>

          {/* ── Tagline ── */}
          <motion.p
            initial={{ opacity: 0, y: 14, letterSpacing: '0.2em' }}
            animate={{ opacity: 0.38, y: 0, letterSpacing: '0.48em' }}
            transition={{ duration: 1.6, delay: 0.9, ease: LUXURY_EASE }}
            style={{
              marginTop: 22,
              fontSize: 'clamp(8px, 2.2vw, 11px)',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              fontWeight: 300,
              letterSpacing: '0.48em',
              fontFamily: 'var(--font-display, Georgia, serif)',
              userSelect: 'none',
            }}
          >
            Curated · Timeless · Sustainable
          </motion.p>

          {/* ── Loading bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              position: 'absolute',
              bottom: 'clamp(18px, 4.5vh, 38px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(90px, 28vw, 150px)',
            }}
          >
            {/* Track */}
            <div
              style={{
                width: '100%',
                height: 1,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              {/* Fill */}
              <div
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background:
                    'linear-gradient(to right, rgba(120,70,230,0.65), rgba(205,160,255,1))',
                  width: `${progress}%`,
                  transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 0 10px rgba(195,140,255,0.7)',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
