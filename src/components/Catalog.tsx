import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useState } from 'react'
import { categories, formatPrice, products, type Category, type Product } from '../data/catalog'
import { photo } from '../data/media'
import { useCart } from '../state/cart'
import { Eyebrow, SplitTitle } from './fx'

export function Catalog() {
  const [cat, setCat] = useState<Category>('all')
  const list = cat === 'all' ? products : products.filter((p) => p.category === cat)

  return (
    <section id="catalog" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>каталог</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-tight">
              <SplitTitle text="Букеты этой недели" italic={[2]} />
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-nowrap" role="tablist">
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm transition-colors ${cat === c.id ? 'text-noir' : 'text-cream/70 hover:text-cream'}`}
              >
                {cat === c.id && (
                  <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-blush" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 60, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={i % 3 === 1 ? 'lg:translate-y-16' : ''}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 })
  const sry = useSpring(ry, { stiffness: 150, damping: 15 })
  const glareX = useTransform(sry, [-10, 10], ['0%', '100%'])
  const glare = useTransform(glareX, (x) => `radial-gradient(circle at ${x} 30%, rgba(255,240,240,0.28), transparent 55%)`)

  const onAdd = () => {
    add({ key: p.id, title: p.name, note: p.note, price: p.price, image: photo(p.image) })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="group" style={{ perspective: 1000 }}>
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-wine"
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        data-cursor="в корзину"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 14)
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14)
        }}
        onPointerLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        onClick={onAdd}
      >
        <img src={photo(p.image)} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-0" />
        <img src={photo(p.hover)} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />

        {p.tag && (
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-blush">{p.tag}</span>
        )}

        <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
          <span className="glass rounded-full px-4 py-2 text-xs text-cream/80">Соберём за 40 мин</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            className="grid h-12 w-12 place-items-center rounded-full bg-blush text-xl text-noir transition-transform hover:scale-110"
            aria-label={`Добавить «${p.name}» в корзину`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? 'ok' : 'plus'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                {added ? '✓' : '+'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="font-display text-3xl font-normal leading-none transition-colors group-hover:text-blush">{p.name}</h3>
          <p className="mt-2 text-sm text-cream/50">{p.note}</p>
        </div>
        <p className="whitespace-nowrap pt-1 font-display text-2xl text-champagne">{formatPrice(p.price)}</p>
      </div>
    </article>
  )
}
