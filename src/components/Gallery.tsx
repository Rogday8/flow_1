import { AnimatePresence, motion, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { photo, type PhotoName } from '../data/media'
import { Eyebrow, SplitTitle, useSectionProgress } from './fx'

const COLS: PhotoName[][] = [
  ['peony-noir', 'hands-bouquet', 'window-roses'],
  ['shop-facade', 'carnation-vase', 'rose-drops', 'ranunculus-stems'],
  ['peony-dark', 'shop-street', 'tulips-love'],
  ['roses-dark', 'rose-basket', 'peony-garden', 'carnations'],
]
const SPEED = [0, -220, 80, -300]

/** «Лента инстаграма»: четыре колонки едут с разной скоростью, клик открывает фото */
export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useSectionProgress(ref, ['start end', 'end start'])
  const [open, setOpen] = useState<PhotoName | null>(null)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl text-center">
        <Eyebrow className="justify-center">@maison.petale</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight">
          <SplitTitle text="Живём цветами" italic={[1]} />
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-h-[150vh] max-w-7xl grid-cols-2 gap-4 overflow-hidden md:grid-cols-4">
        {COLS.map((col, i) => (
          <Column key={i} items={col} progress={scrollYProgress} speed={SPEED[i]} onOpen={setOpen} className={i > 1 ? 'hidden md:flex' : 'flex'} />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[150] grid place-items-center bg-noir/90 p-6 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              layoutId={`g-${open}`}
              src={photo(open)}
              alt=""
              className="max-h-[85vh] max-w-full rounded-3xl object-contain shadow-2xl"
            />
            <button className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-xl" aria-label="Закрыть">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Column({
  items,
  progress,
  speed,
  onOpen,
  className,
}: {
  items: PhotoName[]
  progress: MotionValue<number>
  speed: number
  onOpen: (p: PhotoName) => void
  className: string
}) {
  const y = useTransform(progress, [0, 1], [0, speed])
  return (
    <motion.div className={`flex-col gap-4 ${className}`} style={{ y }}>
      {items.map((p) => (
        <motion.button
          key={p}
          layoutId={`g-${p}`}
          onClick={() => onOpen(p)}
          className="group relative overflow-hidden rounded-2xl"
          data-cursor="открыть"
        >
          <img src={photo(p)} alt="" loading="lazy" className="w-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:saturate-150" />
          <span className="absolute inset-0 bg-berry/0 transition-colors duration-500 group-hover:bg-berry/20" />
        </motion.button>
      ))}
    </motion.div>
  )
}
