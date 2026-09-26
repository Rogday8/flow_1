import { motion, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { cut, photo, type CutName, type PhotoName } from '../data/media'
import { Eyebrow, useSectionProgress } from './fx'

const ITEMS: { title: string; sub: string; img: PhotoName; bloom: CutName; season: string }[] = [
  { title: 'Весенний сад', sub: 'тюльпаны, мускари, ветки вишни', img: 'tulip-market', bloom: 'pink-ranunculus', season: 'Март — Май' },
  { title: 'Пионовый сезон', sub: 'Sarah Bernhardt, Coral Charm, Red Charm', img: 'peony-bush', bloom: 'yellow-peony', season: 'Май — Июль' },
  { title: 'Свадебная', sub: 'белое, пудра и зелень эвкалипта', img: 'bride-bouquet', bloom: 'white-orchid', season: 'Круглый год' },
  { title: 'Нуар', sub: 'бордо, слива, тёмные ранункулюсы', img: 'moody-roses', bloom: 'noir-ranunculus', season: 'Осень — Зима' },
  { title: 'Полевая', sub: 'ромашки, васильки, колоски', img: 'daisies', bloom: 'poppy', season: 'Июнь — Август' },
  { title: 'Для него', sub: 'строгие формы, протея, листья', img: 'purple-tulips', bloom: 'protea', season: 'Круглый год' },
]

/** Горизонтальная лента коллекций: вертикальный скролл двигает её вбок */
export function Collections() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const scrollYProgress = useSectionProgress(ref, ['start start', 'end end'])
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useLayoutEffect(() => {
    const measure = () => setDist(Math.max(0, track.current!.scrollWidth - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section id="collections" ref={ref} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-5 sm:px-8">
          <div>
            <Eyebrow>коллекции</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-[0.95]">
              Сезоны <span className="italic text-gradient">в цветах</span>
            </h2>
          </div>
          <div className="hidden h-px w-60 bg-white/10 md:block">
            <motion.div className="h-full bg-blush" style={{ width: bar }} />
          </div>
        </div>

        <motion.div ref={track} className="flex w-max gap-6 px-5 sm:px-8" style={{ x }}>
          {ITEMS.map((it, i) => (
            <article
              key={it.title}
              className="group relative h-[58svh] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] sm:w-[46vw] lg:w-[32vw]"
              data-cursor="открыть"
            >
              <img src={photo(it.img)} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent" />
              <img
                src={cut(it.bloom)}
                alt=""
                className="absolute -right-8 -top-8 w-40 rotate-12 opacity-0 drop-shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:right-4 group-hover:top-4 group-hover:rotate-0 group-hover:opacity-100 sm:w-48"
              />
              <span className="absolute left-6 top-6 font-display text-7xl font-light text-cream/25">0{i + 1}</span>
              <div className="absolute inset-x-6 bottom-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose">{it.season}</p>
                <h3 className="mt-2 font-display text-4xl font-normal sm:text-5xl">{it.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm text-cream/70 transition-all duration-700 group-hover:max-h-20 max-lg:max-h-20">{it.sub}</p>
              </div>
            </article>
          ))}
          <div className="flex h-[58svh] w-[60vw] shrink-0 flex-col items-start justify-center pr-8 sm:w-[30vw]">
            <p className="font-display text-5xl font-light italic text-blush">и ещё десятки</p>
            <a href="#catalog" className="mt-6 rounded-full border border-cream/20 px-7 py-3.5 text-sm hover:border-blush hover:text-blush">
              В каталог →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
