import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useState } from 'react'
import { photo, type PhotoName } from '../data/media'
import { Eyebrow, SplitTitle } from './fx'

const ROWS: { title: string; note: string; img: PhotoName; from: string }[] = [
  { title: 'День рождения', note: 'яркие, праздничные, с шарами по желанию', img: 'tulip-mix', from: 'от 4 900 ₽' },
  { title: 'Свидание', note: 'розы, пионы, всё, что заставляет краснеть', img: 'roses-vase', from: 'от 5 400 ₽' },
  { title: 'Свадьба', note: 'букет невесты, бутоньерки, оформление зала', img: 'bride-bouquet', from: 'от 12 000 ₽' },
  { title: 'Просто так', note: 'самый честный повод подарить цветы', img: 'tulips-coffee', from: 'от 2 900 ₽' },
  { title: 'Извинение', note: 'нежные оттенки и записка от сердца', img: 'blush-roses', from: 'от 4 200 ₽' },
  { title: 'Корпоратив', note: 'интерьерные композиции и подписка для офиса', img: 'lilac-vase', from: 'от 9 000 ₽' },
]

/** Список поводов: картинка плывёт за курсором */
export function Occasions() {
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })
  const rot = useSpring(0, { stiffness: 120, damping: 12 })

  return (
    <section
      className="relative px-5 py-28 sm:px-8 sm:py-36"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const nx = e.clientX - r.left
        rot.set((nx - x.get()) * 0.4)
        x.set(nx)
        y.set(e.clientY - r.top)
      }}
    >
      <div className="mx-auto max-w-7xl">
        <Eyebrow>поводы</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight">
          <SplitTitle text="Для любого момента" italic={[2]} />
        </h2>

        <ul className="mt-16 border-t border-white/10" onPointerLeave={() => setActive(null)}>
          {ROWS.map((r, i) => (
            <li key={r.title} onPointerEnter={() => setActive(i)} className="group relative border-b border-white/10">
              <a href="#catalog" className="flex items-center justify-between gap-6 py-7 sm:py-9">
                <span className="flex items-baseline gap-6">
                  <span className="text-xs text-rose">0{i + 1}</span>
                  <span className="font-display text-[clamp(2rem,5vw,4.5rem)] font-light leading-none transition-all duration-500 group-hover:translate-x-4 group-hover:italic group-hover:text-blush">
                    {r.title}
                  </span>
                </span>
                <span className="hidden text-right text-sm text-cream/50 md:block">
                  {r.note}
                  <span className="mt-1 block font-display text-xl text-champagne">{r.from}</span>
                </span>
              </a>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-rose to-champagne transition-all duration-700 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </div>

      <motion.div className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block" style={{ x: sx, y: sy, rotate: rot }}>
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="absolute -left-36 -top-48 h-96 w-72 overflow-hidden rounded-3xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.6, clipPath: 'inset(50% 50% 50% 50% round 24px)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={photo(ROWS[active].img)} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
