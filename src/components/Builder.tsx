import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { formatPrice, stems, wraps, type Stem } from '../data/catalog'
import { head } from '../data/media'
import { BouquetStage, type Picked } from './BouquetStage'
import { useCart } from '../state/cart'
import { Eyebrow, Magnetic, SplitTitle } from './fx'

const MAX = 15
const WRAP_PRICE = 450

let uidSeq = 0

/** Сочетания, которые собрал бы флорист: сначала акцент, потом основа */
const PALETTES = [
  ['peony', 'pink-rose', 'blush-ranunculus', 'pink-ranunculus', 'anemone', 'blossom'],
  ['lily', 'coral-rose', 'orange-rose', 'amber-ranunculus', 'blush-ranunculus'],
  ['iris', 'anemone', 'pink-rose', 'blossom', 'pink-ranunculus'],
  ['protea', 'pink-rose', 'blush-ranunculus', 'anemone', 'blossom'],
  ['coral-rose', 'blush-ranunculus', 'amber-ranunculus', 'blossom', 'pink-ranunculus'],
]

export function Builder() {
  const [picked, setPicked] = useState<Picked[]>(() =>
    ['peony', 'pink-rose', 'blush-ranunculus', 'anemone', 'coral-rose', 'pink-ranunculus', 'blossom'].map((id) => ({ uid: uidSeq++, stem: stems.find((s) => s.id === id)! })),
  )
  const [wrap, setWrap] = useState(wraps[1])
  const [note, setNote] = useState('')
  const { add, setOpen } = useCart()

  const total = useMemo(() => picked.reduce((s, p) => s + p.stem.price, 0) + WRAP_PRICE, [picked])
  const full = picked.length >= MAX

  const addStem = (stem: Stem) => {
    if (full) return
    setPicked((p) => [...p, { uid: uidSeq++, stem }])
  }
  const remove = (uid: number) => setPicked((p) => p.filter((x) => x.uid !== uid))

  /** «Удивите меня»: случайная палитра флориста — первый цветок в ней акцентный, он идёт один */
  const surprise = () => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    const [accent, ...rest] = palette.map((id) => stems.find((s) => s.id === id)!)
    const n = 11 + Math.floor(Math.random() * 4)
    const list = [accent, ...Array.from({ length: n - 1 }, (_, i) => rest[(i + Math.floor(i / rest.length)) % rest.length])]
    setPicked(list.map((stem) => ({ uid: uidSeq++, stem })))
  }

  const toCart = () => {
    if (!picked.length) return
    const counts = picked.reduce<Record<string, number>>((acc, p) => ((acc[p.stem.name] = (acc[p.stem.name] ?? 0) + 1), acc), {})
    const desc = Object.entries(counts)
      .map(([n, c]) => `${n} ×${c}`)
      .join(', ')
    add({
      key: `custom-${picked.map((p) => p.stem.id).sort().join('-')}-${wrap.id}`,
      title: 'Букет по вашему эскизу',
      note: `${desc} · упаковка «${wrap.name}»${note ? ` · «${note}»` : ''}`,
      price: total,
      image: head(picked[0].stem.head),
    })
    setOpen(true)
  }

  return (
    <section id="builder" className="relative overflow-hidden bg-powder px-5 py-28 text-noir sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(232,144,159,0.35),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(201,163,106,0.3),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow className="!text-berry">конструктор</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight [--grad:linear-gradient(100deg,#8c2f4b,#d9687f,#b8894a,#8c2f4b)]">
              <SplitTitle text="Соберите свой букет" italic={[2]} />
            </h2>
          </div>
          <p className="max-w-md text-noir/60 lg:justify-self-end">
            Нажимайте на цветы — они сразу встают в букет. Нажмите на цветок в букете, чтобы убрать его. Флорист доведёт композицию до идеала и пришлёт фото перед доставкой.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <BouquetStage picked={picked} wrap={wrap} onRemove={remove} />

          {/* выбор */}
          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {stems.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => addStem(s)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.92 }}
                  disabled={full}
                  className="group relative flex flex-col items-center rounded-2xl bg-white/60 p-3 text-center backdrop-blur transition-colors hover:bg-white disabled:opacity-40"
                >
                  <span className="absolute inset-x-6 top-4 aspect-square rounded-full opacity-40 blur-xl transition-opacity group-hover:opacity-80" style={{ background: s.tint }} />
                  <img src={head(s.head)} alt="" className="relative h-16 w-16 object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 sm:h-20 sm:w-20" />
                  <span className="relative mt-2 text-[0.7rem] font-semibold leading-tight">{s.name}</span>
                  <span className="relative text-[0.7rem] text-noir/50">{formatPrice(s.price)}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-noir/50">Упаковка</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {wraps.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWrap(w)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                      wrap.id === w.id ? 'border-noir bg-noir text-cream' : 'border-noir/15 hover:border-noir/40'
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: w.color }} />
                    {w.name}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-8 block">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-noir/50">Записка от руки</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 80))}
                placeholder="С днём рождения, мама!"
                className="mt-3 w-full border-b border-noir/20 bg-transparent py-3 font-display text-2xl italic outline-none placeholder:text-noir/30 focus:border-berry"
              />
            </label>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-noir/50">Итого с упаковкой</p>
                <motion.p key={total} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-5xl">
                  {formatPrice(total)}
                </motion.p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPicked([])} className="rounded-full border border-noir/15 px-5 py-4 text-sm hover:border-noir/40">
                  Очистить
                </button>
                <button onClick={surprise} className="rounded-full border border-berry/30 px-5 py-4 text-sm text-berry hover:border-berry">
                  ✿ Удивите меня
                </button>
                <Magnetic>
                  <button
                    onClick={toCart}
                    disabled={!picked.length}
                    className="rounded-full bg-noir px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-berry disabled:opacity-40"
                  >
                    В корзину →
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
