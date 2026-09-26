import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cut } from '../data/media'
import { Eyebrow, Ticker } from './fx'

const REVIEWS = [
  { text: 'Заказал пионы жене в 22:40 — в 23:50 они уже стояли на столе. Жена до сих пор думает, что я планировал это за неделю.', name: 'Артём', where: 'Патриаршие' },
  { text: 'Прислали фото букета перед отправкой, я попросила добавить немного зелени — и через 10 минут прислали новое. Сервис уровня ювелирного бутика.', name: 'Мария', where: 'Хамовники' },
  { text: 'Беру подписку Maison уже полгода. Каждую пятницу — маленький праздник, и ни разу букет не повторился.', name: 'Екатерина', where: 'Сити' },
  { text: 'Оформляли нашу свадьбу. Гости фотографировали столы чаще, чем нас с мужем. Спасибо за эту красоту!', name: 'Алина и Денис', where: 'Барвиха' },
  { text: 'Ранункулюсы простояли 12 дней. Двенадцать! Я считала.', name: 'Ольга', where: 'Замоскворечье' },
]

export function Reviews() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 6000)
    return () => window.clearInterval(t)
  }, [i])
  const r = REVIEWS[i]

  return (
    <section className="relative overflow-hidden bg-wine py-28 sm:py-36">
      <img src={cut('white-blossom')} alt="" className="pointer-events-none absolute -left-20 top-10 w-72 rotate-12 animate-sway opacity-40" />
      <img src={cut('pink-ranunculus')} alt="" className="pointer-events-none absolute -right-10 bottom-0 w-56 -rotate-12 animate-sway opacity-50 [animation-delay:-3s]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Eyebrow className="justify-center">отзывы</Eyebrow>
        <div className="mt-6 flex items-center justify-center gap-1 text-xl text-champagne">{'★★★★★'}</div>

        <div className="relative mt-10 min-h-[16rem] sm:min-h-[13rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-[clamp(1.7rem,3.6vw,3rem)] font-light italic leading-[1.2]">«{r.text}»</blockquote>
              <figcaption className="mt-8 text-sm text-cream/60">
                <span className="font-semibold text-blush">{r.name}</span> · {r.where}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {REVIEWS.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/15" aria-label={`Отзыв ${k + 1}`}>
              {k === i && <motion.span className="absolute inset-y-0 left-0 bg-blush" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />}
              {k < i && <span className="absolute inset-0 bg-blush/60" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-24 border-y border-white/10 py-6">
        <Ticker>
          {['Яндекс Карты 4.9', '2ГИС 5.0', 'Google 4.9', 'Flowwow — топ-10 Москвы', 'Wedding Awards 2025', 'Vogue — «лучшие флористы»'].map((t) => (
            <span key={t} className="flex items-center gap-8 px-8 font-display text-3xl italic text-cream/60">
              {t}
              <span className="text-base not-italic text-rose">✿</span>
            </span>
          ))}
        </Ticker>
      </div>
    </section>
  )
}
