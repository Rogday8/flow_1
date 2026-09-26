import { motion, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { cut, photo } from '../data/media'
import { Counter, Eyebrow, Reveal, useSectionProgress } from './fx'

const TEXT =
  'Мы не продаём цветы охапками. Каждый букет — это маленькое письмо: мы подбираем оттенки под человека, под повод и даже под погоду за окном. Утром — рынок, днём — мастерская, вечером — чья-то улыбка у двери.'

/** Манифест: слова «зажигаются» по мере прокрутки */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSectionProgress(ref, ['start 80%', 'end 45%'])
  const words = TEXT.split(' ')

  const p2 = useSectionProgress(ref, ['start end', 'end start'])
  const imgY = useTransform(p2, [0, 1], ['20%', '-20%'])
  const rot = useTransform(p2, [0, 1], [-30, 60])
  const orchidY = useTransform(p2, [0, 1], ['-10%', '30%'])

  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-40">
      <motion.img
        src={cut('protea')}
        alt=""
        style={{ y: imgY, rotate: rot }}
        className="pointer-events-none absolute -right-16 top-10 w-52 opacity-80 sm:w-80"
      />
      <motion.img
        src={cut('white-orchid')}
        alt=""
        style={{ y: orchidY }}
        className="pointer-events-none absolute -left-10 bottom-0 w-40 opacity-60 blur-[1px] sm:w-64"
      />

      <div className="relative mx-auto max-w-6xl">
        <Eyebrow>о нас</Eyebrow>
        <div ref={ref} className="mt-10 font-display text-[clamp(1.9rem,4.6vw,4.2rem)] font-light leading-[1.12] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 12000, s: '+', l: 'букетов собрали за прошлый год' },
            { v: 90, s: ' мин', l: 'средняя доставка по городу' },
            { v: 4.9, s: '', l: 'рейтинг на Яндекс Картах', d: 1 },
            { v: 7, s: ' дней', l: 'гарантия свежести или заменим' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.1}>
              <div className="font-display text-6xl font-light text-blush sm:text-7xl">
                <Counter to={s.v} suffix={s.s} decimals={s.d ?? 0} />
              </div>
              <p className="mt-3 max-w-[14rem] text-sm text-cream/55">{s.l}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid items-center gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem]" data-cursor="смотреть">
              <img src={photo('florist-desk')} alt="Мастерская флориста" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
              <p className="absolute bottom-6 left-6 font-display text-2xl italic">Мастерская на Патриарших</p>
            </div>
          </Reveal>
          <div className="md:col-span-7 md:pl-10">
            <Reveal delay={0.1}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                <img src={photo('shop-buckets')} alt="Свежие цветы в вёдрах" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-cream/60">
                Цветы приезжают к нам трижды в неделю напрямую с плантаций Эквадора, Кении и Голландии, а летом — с подмосковных ферм. Мы не держим запасов: всё, что вы видите, срезано не раньше, чем три дня назад.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const color = useTransform(progress, range, ['#f6eee6', /[—,.:]$/.test(children) ? '#f4c9cc' : '#f6eee6'])
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}
