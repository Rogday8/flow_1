import { cut, type CutName } from '../data/media'
import { Ticker } from './fx'

const ROW1: [string, CutName][] = [
  ['Пионы', 'yellow-peony'],
  ['Ранункулюсы', 'blush-ranunculus'],
  ['Садовые розы', 'orange-rose'],
  ['Анемоны', 'anemone'],
  ['Орхидеи', 'white-orchid'],
  ['Протеи', 'protea'],
]
const ROW2 = ['доставка за 90 минут', 'записка от руки', 'свежесть 7 дней', 'фото перед отправкой', 'сезонные цветы', 'упаковка без пластика']

export function Marquee() {
  return (
    <section className="relative z-10 -mt-10 space-y-3 overflow-hidden py-10" aria-label="Наши цветы">
      <div className="-rotate-2 bg-blush py-5 text-noir shadow-[0_30px_80px_-30px_rgba(232,144,159,0.6)]">
        <Ticker>
          {ROW1.map(([name, img]) => (
            <span key={name} className="flex items-center gap-6 px-6">
              <span className="font-display text-4xl italic sm:text-5xl">{name}</span>
              <img src={cut(img)} alt="" className="h-14 w-14 animate-spin-slow object-contain sm:h-16 sm:w-16" />
            </span>
          ))}
        </Ticker>
      </div>
      <div className="rotate-1 border-y border-white/10 bg-ink py-4">
        <Ticker reverse>
          {ROW2.map((t) => (
            <span key={t} className="flex items-center gap-6 px-6 text-xs font-semibold uppercase tracking-[0.35em] text-champagne/80">
              {t}
              <span className="text-rose">✿</span>
            </span>
          ))}
        </Ticker>
      </div>
    </section>
  )
}
