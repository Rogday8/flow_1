import { motion, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cut, type CutName } from '../data/media'
import { Eyebrow, Reveal, SplitTitle, useSectionProgress } from './fx'

const STEPS: { t: string; d: string; bloom: CutName }[] = [
  { t: 'Выбираете', d: 'Готовый букет из каталога или свой — в конструкторе. Можно просто описать настроение в чате.', bloom: 'pink-ranunculus' },
  { t: 'Собираем', d: 'Флорист собирает букет из утренней поставки и присылает вам фото до отправки.', bloom: 'anemone' },
  { t: 'Везём', d: 'Курьер в термобоксе, чтобы цветы не замёрзли зимой и не завяли летом. В среднем — 90 минут.', bloom: 'lily' },
  { t: 'Радуем', d: 'Вручаем лично в руки, с запиской от руки и памяткой по уходу. Свежесть — 7 дней, или заменим.', bloom: 'gold-ranunculus' },
]

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSectionProgress(ref, ['start 70%', 'end 60%'])
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>как это работает</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight">
              <SplitTitle text="Четыре шага до улыбки" italic={[3]} />
            </h2>
          </div>
          <Reveal className="max-w-md lg:justify-self-end">
            <p className="text-cream/55">Заказ до 21:00 — доставим сегодня. Работаем без выходных, а в праздники открываем ночную смену.</p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-white/10 lg:block">
            <motion.div className="h-full bg-gradient-to-r from-berry via-rose to-champagne" style={{ width: line }} />
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.12}>
                <div className="group">
                  <div className="relative h-[6.5rem] w-[6.5rem]">
                    <div className="absolute inset-0 rounded-full border border-white/10 bg-wine transition-colors duration-500 group-hover:border-rose/50" />
                    <motion.img
                      src={cut(s.bloom)}
                      alt=""
                      className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain transition-transform duration-700 group-hover:rotate-45 group-hover:scale-125"
                    />
                    <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-blush text-xs font-bold text-noir">{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-4xl">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/55">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
