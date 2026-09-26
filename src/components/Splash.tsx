import { motion } from 'motion/react'
import { useEffect } from 'react'
import { PETAL } from './Logo'

const DURATION = 2100
const WORD = 'Maison Pétale'

/** Заставка: цветок распускается лепесток за лепестком, название собирается по буквам. */
export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DURATION)
    const skip = () => onDone()
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-noir"
      exit={{ clipPath: 'circle(0% at 50% 45%)' }}
      initial={{ clipPath: 'circle(150% at 50% 45%)' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(40% 40% at 50% 45%, #4a1f2e 0%, transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1.3 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <svg viewBox="-40 -40 80 80" className="h-36 w-36 sm:h-44 sm:w-44">
          <defs>
            <linearGradient id="splash-petal" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#8c2f4b" />
              <stop offset="60%" stopColor="#e8909f" />
              <stop offset="100%" stopColor="#f9e4e1" />
            </linearGradient>
          </defs>
          {[0, 72, 144, 216, 288].map((r, i) => (
            <motion.path
              key={r}
              d={PETAL}
              fill="url(#splash-petal)"
              initial={{ rotate: r - 90, scale: 0, opacity: 0 }}
              animate={{ rotate: r, scale: 1.25, opacity: 0.95 }}
              transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          {[36, 108, 180, 252, 324].map((r, i) => (
            <motion.path
              key={r}
              d={PETAL}
              fill="#f4c9cc"
              initial={{ rotate: r + 60, scale: 0, opacity: 0 }}
              animate={{ rotate: r, scale: 0.8, opacity: 0.55 }}
              transition={{ duration: 1.1, delay: 0.45 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          <motion.circle
            r="5"
            fill="#c9a36a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 12 }}
          />
        </svg>

        <div className="flex overflow-hidden font-display text-4xl tracking-tight sm:text-5xl">
          {WORD.split('').map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className={i > 6 ? 'italic text-blush' : 'text-cream'}
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </div>

        <div className="h-px w-48 overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-berry via-rose to-champagne"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: DURATION / 1000, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
