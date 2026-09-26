import { motion } from 'motion/react'

const PETAL = 'M0 0 C-9 -8 -8 -22 0 -25 C8 -22 9 -8 0 0Z'

/** Знак: пять лепестков вокруг золотой сердцевины. При наведении цветок раскрывается. */
export function LogoMark({ className = 'h-9 w-9', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <motion.svg viewBox="-32 -32 64 64" className={className} whileHover={{ rotate: 72 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      <defs>
        <linearGradient id="petal-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8c2f4b" />
          <stop offset="55%" stopColor="#e8909f" />
          <stop offset="100%" stopColor="#f9e4e1" />
        </linearGradient>
      </defs>
      <g className={spin ? 'origin-center animate-spin-slow' : undefined}>
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d={PETAL} transform={`rotate(${r})`} fill="url(#petal-grad)" fillOpacity={0.95} />
        ))}
      </g>
      <circle r="4.2" fill="#c9a36a" />
    </motion.svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Maison Pétale — на главную">
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.55rem] font-medium tracking-tight text-cream">
            Maison <span className="italic text-blush">Pétale</span>
          </span>
          <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.42em] text-champagne/60">цветочный дом</span>
        </span>
      )}
    </a>
  )
}

export { PETAL }
