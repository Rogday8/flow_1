import { AnimatePresence, motion } from 'motion/react'
import type { Stem } from '../data/catalog'
import { head } from '../data/media'

export type Picked = { uid: number; stem: Stem }
type Wrap = { color: string; edge: string }

const GOLDEN = 2.39996 // золотой угол — цветы раскладываются спиралью без пустот
const CX = 50
const CY = 39

/**
 * Раскладка головок куполом: первые цветы в центре, следующие — по спирали наружу.
 * Радиус купола растёт с количеством, поэтому маленький букет остаётся плотным,
 * а при добавлении цветов остальные мягко раздвигаются.
 */
function layout(n: number) {
  const spread = Math.max(0.5, Math.sqrt(n / 15))
  return Array.from({ length: n }, (_, i) => {
    const t = Math.sqrt((i + 0.5) / n) * spread
    const a = i * GOLDEN - Math.PI / 2
    const x = CX + Math.cos(a) * t * 36
    // нижние края купола не должны вылезать из-под упаковки по бокам
    const y = Math.min(CY + Math.sin(a) * t * 23 - (1 - t) * 4, 54 - Math.abs(x - CX) * 0.3)
    return { x, y, rot: (x - CX) * 0.7, z: Math.round(y * 10) }
  })
}

/** Веточки эвкалипта и рускуса за цветами: [угол°, длина, оттенок] */
const SPRIGS: [number, number, string][] = [
  [-96, 50, '#7e9870'],
  [-82, 58, '#8fa582'],
  [-64, 58, '#6f8a63'],
  [-46, 54, '#9db38e'],
  [-26, 50, '#7e9870'],
  [-8, 56, '#8fa582'],
  [10, 54, '#6f8a63'],
  [28, 52, '#9db38e'],
  [48, 54, '#7e9870'],
  [66, 58, '#8fa582'],
  [84, 58, '#6f8a63'],
  [98, 50, '#9db38e'],
]

/** Облачка гипсофилы по краю купола */
const GYPSO: [number, number][] = [
  [-150, 1.05],
  [-30, 1.05],
  [-100, 1.12],
  [-75, 1.1],
  [180, 0.95],
  [0, 0.95],
  [-125, 0.9],
  [-50, 0.9],
]

export function BouquetStage({ picked, wrap, onRemove }: { picked: Picked[]; wrap: Wrap; onRemove: (uid: number) => void }) {
  const pos = layout(picked.length)
  const spread = Math.max(0.5, Math.sqrt(picked.length / 15))
  const greens = picked.length ? 0.85 + spread * 0.35 : 0.7
  const tint = picked.length ? picked[picked.length - 1].stem.tint : '#f4c9cc'

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_35%,#fffaf7,#f6e3de_55%,#efd2cc)] shadow-[0_60px_120px_-50px_rgba(140,47,75,0.45)] sm:aspect-square">
      {/* мягкий свет под цвет последнего добавленного цветка */}
      <motion.div
        className="absolute left-1/2 top-[30%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{ backgroundColor: tint, opacity: picked.length ? 0.35 : 0.15 }}
        transition={{ duration: 1.2 }}
      />
      <div className="absolute left-5 top-5 z-[950] rounded-full bg-white/75 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-berry backdrop-blur">
        {picked.length} / 15 стеблей
      </div>
      {/* тень на столе */}
      <div className="absolute bottom-[3%] left-1/2 h-[5%] w-[34%] -translate-x-1/2 rounded-[50%] bg-[#6b2a3a]/20 blur-md" />

      <div className="absolute inset-x-[5%] bottom-[2%] top-[4%]">
        {/* тишью-бумага за букетом */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tissue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="1" stopColor={wrap.color} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <motion.g
            style={{ transformOrigin: '50px 92px' }}
            animate={{ scale: 0.8 + spread * 0.25, opacity: picked.length ? 1 : 0.5 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          >
            <path d="M50 92 L8 50 C7 38 16 33 23 38 C24 27 35 24 40 31 C43 21 57 21 60 31 C65 24 76 27 77 38 C84 33 93 38 92 50 Z" fill="url(#tissue)" />
            <path d="M50 92 L8 50 C7 38 16 33 23 38 C24 27 35 24 40 31 C43 21 57 21 60 31 C65 24 76 27 77 38 C84 33 93 38 92 50 Z" fill="none" stroke={wrap.edge} strokeOpacity="0.35" strokeWidth="0.3" />
          </motion.g>
        </svg>

        {/* зелень */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <motion.g
            style={{ transformOrigin: '50px 62px' }}
            animate={{ scale: greens }}
            transition={{ type: 'spring', stiffness: 80, damping: 14 }}
          >
            {SPRIGS.map(([deg, len, color], i) => (
              <Sprig key={i} deg={deg} len={len} color={color} ruscus={i % 3 === 1} delay={i * 0.04} />
            ))}
          </motion.g>
        </svg>

        {/* гипсофила */}
        <AnimatePresence>
          {GYPSO.slice(0, Math.min(GYPSO.length, Math.ceil(picked.length / 1.4))).map(([deg, k], i) => {
            const a = (deg * Math.PI) / 180
            const x = CX + Math.cos(a) * 36 * spread * k
            const y = CY + Math.sin(a) * 25 * spread * k
            return (
              <motion.div
                key={i}
                className="absolute w-[19%] -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 5 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, left: `${x}%`, top: `${y}%` }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                <Gypsophila seed={i} />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* головки цветов */}
        <AnimatePresence>
          {picked.map((p, i) => {
            const { x, y, rot, z } = pos[i]
            const size = (picked.length < 6 ? 40 : 35) * p.stem.scale
            return (
              <motion.button
                key={p.uid}
                onClick={() => onRemove(p.uid)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ width: `${size}%`, zIndex: 10 + z }}
                initial={{ left: `${x}%`, top: `${y - 30}%`, scale: 0.2, rotate: rot - 60, opacity: 0 }}
                animate={{ left: `${x}%`, top: `${y}%`, scale: 1, rotate: rot, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0, top: `${y - 20}%`, rotate: rot + 60, transition: { duration: 0.35 } }}
                whileHover={{ scale: 1.08, zIndex: 999 }}
                transition={{ type: 'spring', stiffness: 110, damping: 15 }}
                aria-label={`Убрать: ${p.stem.name}`}
                data-cursor="убрать"
              >
                <img
                  src={head(p.stem.head)}
                  alt={p.stem.name}
                  draggable={false}
                  className="w-full drop-shadow-[0_10px_14px_rgba(70,20,35,0.32)] transition-[filter] duration-300 group-hover:brightness-105"
                />
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* передняя упаковка и бант */}
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 800 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="paper-shade" x1="0" x2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0.2" />
              <stop offset="0.45" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#000" stopOpacity="0.25" />
            </linearGradient>
            <filter id="paper-grain">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" result="n" />
              <feColorMatrix in="n" type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.08" />
              </feComponentTransfer>
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <motion.g animate={{ color: wrap.color }} transition={{ duration: 0.6 }}>
            {/* левая и правая створки конуса */}
            <path d="M50 97 L13 55 C21 60 31 63 42 62 Z" fill="currentColor" />
            <path d="M50 97 L87 55 C79 60 69 63 58 62 Z" fill="currentColor" />
            <path d="M50 97 L20 58 C30 64 40 65 50 63 C60 65 70 64 80 58 Z" fill="currentColor" />
            <path d="M50 97 L13 55 C21 60 31 63 42 62 L50 63 C60 65 70 64 80 58 L87 55 Z" fill="url(#paper-shade)" />
            <path d="M50 97 L13 55 C21 60 31 63 42 62 L50 63 C60 65 70 64 80 58 L87 55 Z" filter="url(#paper-grain)" fill="#fff" />
            {/* сгибы бумаги */}
            <path d="M50 97 L42 62 M50 97 L58 62" stroke="#000" strokeOpacity="0.1" strokeWidth="0.35" />
            <path d="M13 55 C21 60 31 63 42 62 C44 63 47 63.4 50 63 C60 65 70 64 80 58 L87 55" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.4" />
          </motion.g>
          {/* бант */}
          <g>
            <path d="M40.5 80 C44 82 56 82 59.5 80 L59 83.5 C55 85 45 85 41 83.5 Z" fill="#8c2f4b" />
            <path d="M50 82 C44 76 36 76 37 80 C38 84 45 84 50 82 Z" fill="#a23a5a" />
            <path d="M50 82 C56 76 64 76 63 80 C62 84 55 84 50 82 Z" fill="#a23a5a" />
            <path d="M50 82 C47 80 42 79 40 80 M50 82 C53 80 58 79 60 80" stroke="#6e2039" strokeWidth="0.4" fill="none" />
            <path d="M49 83 C47 88 45 92 43 95 L45.5 95.5 C47 92 49 88 50 84 Z" fill="#8c2f4b" />
            <path d="M51 83 C53 88 55 92 57.5 94.5 L55.2 95.2 C53.5 92 51.5 88 50 84 Z" fill="#7a2842" />
            <ellipse cx="50" cy="82" rx="2" ry="1.7" fill="#b24a69" />
          </g>
        </svg>
      </div>

      {!picked.length && (
        <p className="absolute inset-x-0 top-[30%] z-[900] text-center font-display text-3xl italic text-berry/50">Добавьте первый цветок</p>
      )}
    </div>
  )
}

/** Веточка: изогнутый стебель и листья парами; у эвкалипта круглые, у рускуса узкие */
function Sprig({ deg, len, color, ruscus, delay }: { deg: number; len: number; color: string; ruscus: boolean; delay: number }) {
  const count = ruscus ? 9 : 8
  const bend = deg > 0 ? 2.5 : -2.5
  return (
    <motion.g
      style={{ transformOrigin: '50px 62px' }}
      initial={{ rotate: deg, scale: 0 }}
      animate={{ rotate: deg, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 80, damping: 12 }}
    >
      <path d={`M50 ${62 - len * 0.3} Q ${50 + bend} ${62 - len * 0.65} 50 ${62 - len}`} stroke="#56694a" strokeWidth="0.45" fill="none" />
      {Array.from({ length: count }, (_, i) => {
        const t = 0.32 + (i / count) * 0.7
        const y = 62 - len * t
        const x = 50 + bend * 4 * t * (1 - t)
        const s = ruscus ? 3.8 - t * 1.6 : 5.4 - t * 2.6
        const side = i % 2 ? 1 : -1
        const leaf = ruscus
          ? `M0 0 C ${s * 0.5} ${-s * 0.6} ${s * 0.45} ${-s * 2} 0 ${-s * 2.6} C ${-s * 0.45} ${-s * 2} ${-s * 0.5} ${-s * 0.6} 0 0Z`
          : `M0 0 C ${s * 0.9} ${-s * 0.1} ${s * 1.1} ${-s * 1.6} 0 ${-s * 1.9} C ${-s * 1.1} ${-s * 1.6} ${-s * 0.9} ${-s * 0.1} 0 0Z`
        return (
          <path
            key={i}
            d={leaf}
            transform={`translate(${x} ${y}) rotate(${side * (ruscus ? 38 : 62)})`}
            fill={color}
            opacity={0.8 + (i % 3) * 0.07}
            stroke="#4f6444"
            strokeOpacity="0.25"
            strokeWidth="0.2"
          />
        )
      })}
      {!ruscus && <circle cx="50" cy={62 - len - 1} r="1.4" fill={color} />}
    </motion.g>
  )
}

/** Облачко гипсофилы: россыпь мелких белых цветочков на тонких веточках */
function Gypsophila({ seed }: { seed: number }) {
  const dots = Array.from({ length: 16 }, (_, i) => {
    const a = i * 2.4 + seed
    const r = 8 + ((i * 37 + seed * 13) % 30)
    return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r * 0.75, s: 2.4 + ((i * 7 + seed) % 4) * 0.6 }
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full overflow-visible">
      {dots.map((d, i) => (
        <path key={`l${i}`} d={`M${d.x} ${d.y} l ${(50 - d.x) * 0.15} ${d.s * 2.2}`} stroke="#8aa07c" strokeWidth="0.7" opacity="0.6" />
      ))}
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={d.s} fill="#fffdf8" />
          <circle cx={d.x} cy={d.y} r={d.s * 0.35} fill="#efe6cf" />
        </g>
      ))}
    </svg>
  )
}
