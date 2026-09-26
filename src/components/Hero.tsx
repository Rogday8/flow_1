import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { cut, type CutName } from '../data/media'
import { Magnetic, useSectionProgress } from './fx'
import { PetalRain } from './PetalRain'

type Bloom = { name: CutName; x: string; y: string; w: string; depth: number; rot: number; delay: number; blur?: boolean; drift: number }

/** Парящие цветы: depth — насколько сильно слой реагирует на мышь и скролл */
const BLOOMS: Bloom[] = [
  { name: 'pink-rose', x: '4%', y: '14%', w: 'clamp(140px,17vw,280px)', depth: 1.4, rot: -18, delay: 0.1, drift: 220 },
  { name: 'yellow-peony', x: '78%', y: '8%', w: 'clamp(120px,14vw,240px)', depth: 0.8, rot: 12, delay: 0.2, drift: 160 },
  { name: 'coral-rose', x: '84%', y: '58%', w: 'clamp(150px,19vw,320px)', depth: 1.8, rot: -8, delay: 0.3, drift: 300 },
  { name: 'anemone', x: '-3%', y: '62%', w: 'clamp(150px,18vw,300px)', depth: 1.6, rot: 14, delay: 0.25, drift: 260 },
  { name: 'blush-ranunculus', x: '62%', y: '78%', w: 'clamp(110px,12vw,200px)', depth: 0.6, rot: 20, delay: 0.4, blur: true, drift: 120 },
  { name: 'iris', x: '20%', y: '76%', w: 'clamp(90px,10vw,170px)', depth: 0.5, rot: -24, delay: 0.45, blur: true, drift: 100 },
  { name: 'white-blossom', x: '60%', y: '-4%', w: 'clamp(100px,11vw,190px)', depth: 0.45, rot: 8, delay: 0.5, blur: true, drift: 80 },
  { name: 'amber-ranunculus', x: '28%', y: '2%', w: 'clamp(80px,8vw,140px)', depth: 0.35, rot: -10, delay: 0.55, blur: true, drift: 60 },
]

const TITLE = [
  { t: 'Цветы,', i: false },
  { t: 'которые', i: true },
  { t: 'говорят', i: false },
  { t: 'за вас', i: true },
]

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useSectionProgress(ref, ['start start', 'end start'])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.6])

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-noir pb-28 pt-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
    >
      {/* свечение за заголовком */}
      <motion.div className="absolute inset-0" style={{ scale: glowScale }}>
        <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-[radial-gradient(circle,#6b2440_0%,#3a1422_40%,transparent_70%)] blur-2xl" />
        <div className="absolute -left-1/4 top-0 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(201,163,106,0.18),transparent_65%)] blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(232,144,159,0.16),transparent_65%)] blur-3xl" />
      </motion.div>

      <PetalRain density={0.9} className="z-[5]" />

      {BLOOMS.map((b, i) => (
        <FloatingBloom key={b.name} bloom={b} index={i} sx={sx} sy={sy} progress={scrollYProgress} ready={ready} />
      ))}

      <motion.div className="relative z-20 px-4 text-center" style={{ y: titleY, opacity: titleOpacity }}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={ready ? { opacity: 1, letterSpacing: '0.45em' } : {}}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-[0.65rem] font-semibold uppercase text-champagne/80 sm:text-xs"
        >
          цветочный дом · с 2014 года
        </motion.p>

        <h1 className="font-display text-[clamp(3.2rem,min(15vw,12.5vh),10rem)] font-light leading-[0.86] tracking-[-0.02em]">
          {TITLE.map((w, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`inline-block ${w.i ? 'italic text-gradient' : 'text-cream'}`}
                initial={{ y: '110%', rotate: 6 }}
                animate={ready ? { y: '0%', rotate: 0 } : {}}
                transition={{ duration: 1.3, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {w.t}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mt-8 max-w-md text-balance text-sm leading-relaxed text-cream/65 sm:text-base"
        >
          Авторские букеты из сезонных цветов. Собираем вручную в день заказа и привозим за 90 минут — вместе с запиской, написанной от руки.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#catalog"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-blush px-8 py-4 text-sm font-semibold text-noir"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-cream transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              <span className="relative">Выбрать букет</span>
              <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#builder" className="inline-flex items-center gap-3 rounded-full border border-cream/20 px-8 py-4 text-sm font-medium text-cream transition-colors hover:border-blush hover:text-blush">
              Собрать свой
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 z-20 flex [@media(max-height:820px)]:hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-cream/40"
      >
        листайте
        <span className="relative h-12 w-px overflow-hidden bg-cream/15">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-blush" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-noir to-transparent" />
    </section>
  )
}

function FloatingBloom({
  bloom,
  index,
  sx,
  sy,
  progress,
  ready,
}: {
  bloom: Bloom
  index: number
  sx: MotionValue<number>
  sy: MotionValue<number>
  progress: MotionValue<number>
  ready: boolean
}) {
  const k = bloom.depth * 60
  const x = useTransform(sx, (v) => v * -k)
  const y1 = useTransform(sy, (v) => v * -k)
  const scrollY = useTransform(progress, [0, 1], [0, -bloom.drift])
  const y = useTransform([y1, scrollY], ([a, b]) => (a as number) + (b as number))
  const rotate = useTransform(progress, [0, 1], [bloom.rot, bloom.rot + (index % 2 ? 40 : -40)])

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: bloom.x, top: bloom.y, width: bloom.w, x, y, rotate, zIndex: bloom.blur ? 1 : 15 }}
      initial={{ opacity: 0, scale: 0.4, filter: 'blur(20px)' }}
      animate={ready ? { opacity: bloom.blur ? 0.55 : 1, scale: 1, filter: bloom.blur ? 'blur(3px)' : 'blur(0px)' } : {}}
      transition={{ duration: 1.8, delay: 0.3 + bloom.delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="animate-float" style={{ animationDelay: `${-index * 1.7}s`, animationDuration: `${10 + index * 1.3}s` }}>
        <img src={cut(bloom.name)} alt="" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" draggable={false} />
      </div>
    </motion.div>
  )
}
