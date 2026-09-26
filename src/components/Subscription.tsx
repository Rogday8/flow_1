import { motion } from 'motion/react'
import { formatPrice } from '../data/catalog'
import { cut, type CutName } from '../data/media'
import { useCart } from '../state/cart'
import { Eyebrow, Reveal, SplitTitle } from './fx'

const PLANS: { id: string; name: string; per: string; price: number; perks: string[]; bloom: CutName; hot?: boolean }[] = [
  { id: 'petit', name: 'Petit', per: 'раз в 2 недели', price: 3900, perks: ['Компактный сезонный букет', 'Бесплатная доставка', 'Пауза в любой момент'], bloom: 'anemone' },
  { id: 'maison', name: 'Maison', per: 'каждую неделю', price: 5900, perks: ['Большой авторский букет', 'Ваза в подарок при старте', 'Приоритетная доставка', 'Скидка 15% на каталог'], bloom: 'coral-rose', hot: true },
  { id: 'atelier', name: 'Atelier', per: 'для офиса', price: 14900, perks: ['2–3 интерьерные композиции', 'Замена каждую неделю', 'Персональный флорист'], bloom: 'lotus' },
]

export function Subscription() {
  const { add, setOpen } = useCart()
  return (
    <section id="subscription" className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(140,47,75,0.35),transparent_60%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <Eyebrow className="justify-center">цветочная подписка</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight">
            <SplitTitle text="Цветы без повода, по расписанию" italic={[2]} />
          </h2>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12} className="h-full">
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 sm:p-10 ${
                  p.hot ? 'bg-gradient-to-br from-blush to-rose text-noir' : 'glass'
                }`}
              >
                <img
                  src={cut(p.bloom)}
                  alt=""
                  className="pointer-events-none absolute -right-12 -top-12 w-48 opacity-90 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-4 group-hover:translate-y-4 group-hover:rotate-45"
                />
                {p.hot && <span className="mb-6 w-fit rounded-full bg-noir px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-blush">выбор гостей</span>}
                <h3 className="font-display text-5xl italic">{p.name}</h3>
                <p className={`mt-1 text-sm ${p.hot ? 'text-noir/60' : 'text-cream/50'}`}>{p.per}</p>
                <p className="mt-10 font-display text-6xl font-light">
                  {formatPrice(p.price)}
                  <span className={`ml-2 font-sans text-sm ${p.hot ? 'text-noir/50' : 'text-cream/40'}`}>/ доставка</span>
                </p>
                <ul className="relative mt-8 shrink-0 space-y-3 text-sm">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.6rem] ${p.hot ? 'bg-noir text-blush' : 'bg-blush/15 text-blush'}`}>✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <button
                  onClick={() => {
                    add({ key: `sub-${p.id}`, title: `Подписка ${p.name}`, note: p.per, price: p.price, image: cut(p.bloom) })
                    setOpen(true)
                  }}
                  className={`relative w-full shrink-0 rounded-full py-4 text-sm font-semibold transition-colors ${
                    p.hot ? 'mt-10 bg-noir text-cream hover:bg-wine' : 'mt-10 border border-cream/20 hover:border-blush hover:bg-blush hover:text-noir'
                  }`}
                >
                  Оформить
                </button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
