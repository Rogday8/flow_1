import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/** Появление блока при попадании в экран */
export function Reveal({ children, delay = 0, y = 40, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Заголовок, который поднимается из-под маски слово за словом */
export function SplitTitle({ text, className, delay = 0, italic = [] }: { text: string; className?: string; delay?: number; italic?: number[] }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${italic.includes(i) ? 'italic text-gradient' : ''}`}
            initial={{ y: '105%', rotate: 4 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.1, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

/** Надпись над секцией: тонкая линия + капс */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Reveal className={`flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-rose ${className}`}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-rose" />
      {children}
    </Reveal>
  )
}

/** Кнопка, которая тянется за курсором */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Кастомный курсор: точка + кольцо, кольцо растёт над ссылками и подписывает data-cursor */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })
  const [label, setLabel] = useState<string | null>(null)
  const [hover, setHover] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    document.body.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      const withLabel = t.closest<HTMLElement>('[data-cursor]')
      setLabel(withLabel?.dataset.cursor ?? null)
      setHover(!!t.closest('a, button, [role="button"], input, textarea, select, label'))
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [x, y])

  if (!enabled) return null
  const size = label ? 96 : hover ? 54 : 34

  return (
    <>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush" style={{ x, y }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[299] grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-blush/60 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-noir"
        style={{ x: rx, y: ry }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? 'rgba(244,201,204,0.95)' : hover ? 'rgba(244,201,204,0.12)' : 'rgba(244,201,204,0)',
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {label && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  )
}

/** Бегущая строка */
export function Ticker({ children, reverse = false, className = '' }: { children: ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`edge-fade flex overflow-hidden ${className}`}>
      <div className={`flex w-max shrink-0 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Счётчик, который докручивается при появлении */
export function Counter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1800)
        setV(to * (1 - Math.pow(1 - p, 4)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])
  return (
    <span ref={ref}>
      {v.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/**
 * Прогресс прокрутки секции, который всегда считается в JS.
 * Обычный useScroll + useTransform Motion иногда отдаёт браузерному ScrollTimeline,
 * и тот расходится с реальной позицией (особенно вместе с Lenis и sticky-блоками).
 * Функция-прослойка отключает это «ускорение» — анимации идут строго за скроллом.
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset']
