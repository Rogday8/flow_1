import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Eyebrow, Reveal, SplitTitle } from './fx'

const QA = [
  { q: 'Как быстро вы доставляете?', a: 'В пределах МКАД — в среднем за 90 минут с момента оплаты. Можно выбрать точный интервал в час или доставку ко времени, например, ровно в полночь.' },
  { q: 'Букет будет таким же, как на фото?', a: 'Да, по составу и настроению. Цветы живые, поэтому оттенок бутона может чуть отличаться. Перед отправкой мы пришлём фото именно вашего букета.' },
  { q: 'Сколько простоят цветы?', a: 'Мы гарантируем свежесть 7 дней при соблюдении памятки по уходу, которую кладём в каждый заказ. Если что-то пойдёт не так — бесплатно заменим букет.' },
  { q: 'Можно ли доставить анонимно?', a: 'Конечно. Курьер не назовёт отправителя, а записку подпишем так, как скажете — или оставим загадку.' },
  { q: 'Как оплатить?', a: 'Картой на сайте, по СБП, по ссылке в мессенджере или по счёту для юрлиц. Оплата курьеру тоже возможна.' },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>вопросы</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] font-light leading-[0.92] tracking-tight">
            <SplitTitle text="Частые вопросы" italic={[1]} />
          </h2>
          <Reveal>
            <p className="mt-8 max-w-sm text-cream/55">
              Не нашли ответ? Напишите нам в Telegram — флорист ответит за пару минут.
            </p>
          </Reveal>
        </div>
        <ul className="border-t border-white/10">
          {QA.map((item, i) => (
            <li key={item.q} className="border-b border-white/10">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-7 text-left">
                <span className={`font-display text-2xl transition-colors sm:text-3xl ${open === i ? 'text-blush' : ''}`}>{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl transition-colors ${open === i ? 'border-blush bg-blush text-noir' : 'border-white/15'}`}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-8 leading-relaxed text-cream/60">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
