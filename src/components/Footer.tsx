import { AnimatePresence, motion, useTransform } from 'motion/react'
import { useRef, useState, type FormEvent } from 'react'
import { cut } from '../data/media'
import { Magnetic, useSectionProgress } from './fx'
import { LogoMark } from './Logo'
import { PetalRain } from './PetalRain'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useSectionProgress(ref, ['start end', 'end end'])
  const wordY = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const bloomRotate = useTransform(scrollYProgress, [0, 1], [-60, 0])
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <footer id="contacts" ref={ref} className="grain relative overflow-hidden bg-ink pt-28">
      <PetalRain density={0.4} />
      <motion.img src={cut('orange-rose')} alt="" style={{ rotate: bloomRotate }} className="pointer-events-none absolute -right-28 -top-10 z-0 w-64 opacity-60 sm:w-80" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-[0.95]">
            Не знаете, <span className="italic text-gradient">что выбрать?</span>
          </h2>
          <p className="mt-6 max-w-md text-cream/60">Оставьте номер — флорист перезвонит за 5 минут, расспросит о получателе и соберёт букет, который попадёт в сердце.</p>

          <form onSubmit={submit} className="mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
            <input
              required
              type="tel"
              name="phone"
              placeholder="+7 (___) ___-__-__"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm outline-none transition-colors placeholder:text-cream/30 focus:border-blush"
            />
            <Magnetic>
              <button className="w-full rounded-full bg-blush px-7 py-4 text-sm font-semibold text-noir transition-colors hover:bg-cream">Жду звонка</button>
            </Magnetic>
          </form>
          <AnimatePresence>
            {sent && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-blush">
                Спасибо! Мы уже набираем ваш номер ✿
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm lg:pt-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose">Мастерская</p>
            <p className="mt-4 leading-relaxed text-cream/70">
              Москва, Малая Бронная, 24
              <br />
              ежедневно 8:00 — 23:00
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose">Связь</p>
            <p className="mt-4 leading-relaxed text-cream/70">
              <a href="tel:+79991234567" className="hover:text-blush">+7 (999) 123-45-67</a>
              <br />
              <a href="mailto:hello@maisonpetale.ru" className="hover:text-blush">hello@maisonpetale.ru</a>
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose">Соцсети</p>
            <ul className="mt-4 space-y-1 text-cream/70">
              {['Telegram', 'Instagram', 'VK', 'Pinterest'].map((s) => (
                <li key={s}>
                  <a href="#" className="group inline-flex items-center gap-2 hover:text-blush">
                    {s}
                    <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose">Покупателям</p>
            <ul className="mt-4 space-y-1 text-cream/70">
              {['Доставка и оплата', 'Уход за цветами', 'Корпоративным', 'Вакансии'].map((s) => (
                <li key={s}>
                  <a href="#" className="hover:text-blush">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mt-24 overflow-hidden">
        <motion.p
          style={{ y: wordY }}
          className="select-none whitespace-nowrap text-center font-display text-[18.5vw] font-light leading-[0.8] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(244,201,204,0.35)]"
        >
          Maison <span className="italic text-blush/90 [-webkit-text-stroke:0]">Pétale</span>
        </motion.p>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-8 text-xs text-cream/40 sm:flex-row sm:px-8">
        <span className="flex items-center gap-3">
          <LogoMark className="h-6 w-6" /> © {new Date().getFullYear()} Maison Pétale. Сделано с любовью к цветам.
        </span>
        <a href="#top" className="hover:text-blush">
          Наверх ↑
        </a>
      </div>
    </footer>
  )
}
