import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { formatPrice } from '../data/catalog'
import { cut } from '../data/media'
import { useCart } from '../state/cart'
import { BagIcon } from './Nav'

const FREE_DELIVERY = 7000
const DELIVERY = 490

export function CartDrawer() {
  const { items, total, open, setOpen, change, clear } = useCart()
  const [step, setStep] = useState<'cart' | 'form' | 'done'>('cart')
  const delivery = total >= FREE_DELIVERY || total === 0 ? 0 : DELIVERY

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    if (step === 'done') window.setTimeout(() => setStep('cart'), 500)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    clear()
    setStep('done')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[120] bg-noir/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[130] flex w-full max-w-md flex-col bg-ink shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-label="Корзина"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-3xl">
                {step === 'form' ? 'Оформление' : step === 'done' ? 'Готово' : 'Корзина'}
              </h2>
              <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-lg hover:border-blush" aria-label="Закрыть">
                ×
              </button>
            </header>

            {step === 'done' ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <motion.img
                  src={cut('pink-ranunculus')}
                  alt=""
                  className="h-44"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                />
                <h3 className="mt-6 font-display text-4xl italic text-blush">Спасибо за заказ!</h3>
                <p className="mt-4 text-sm text-cream/60">Флорист уже выбирает для вас самые красивые цветы. Мы позвоним в течение 5 минут, чтобы подтвердить детали.</p>
                <button onClick={close} className="mt-10 rounded-full bg-blush px-8 py-4 text-sm font-semibold text-noir">
                  Вернуться на сайт
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <BagIcon className="h-14 w-14 text-rose/40" />
                <p className="mt-6 font-display text-3xl italic">Здесь пока пусто</p>
                <p className="mt-2 text-sm text-cream/50">Самое время выбрать что-нибудь красивое</p>
                <a href="#catalog" onClick={close} className="mt-8 rounded-full border border-cream/20 px-7 py-3.5 text-sm hover:border-blush hover:text-blush">
                  В каталог
                </a>
              </div>
            ) : step === 'cart' ? (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="flex gap-4 rounded-2xl bg-white/[0.03] p-3"
                      >
                        <img src={it.image} alt="" className="h-24 w-20 shrink-0 rounded-xl bg-wine object-cover" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-display text-xl leading-tight">{it.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-cream/45">{it.note}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1">
                              <button onClick={() => change(it.key, -1)} className="h-6 w-6 rounded-full hover:bg-white/10" aria-label="Меньше">
                                −
                              </button>
                              <span className="w-4 text-center text-sm">{it.qty}</span>
                              <button onClick={() => change(it.key, 1)} className="h-6 w-6 rounded-full hover:bg-white/10" aria-label="Больше">
                                +
                              </button>
                            </div>
                            <span className="font-display text-xl text-champagne">{formatPrice(it.price * it.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <Summary total={total} delivery={delivery}>
                  <button onClick={() => setStep('form')} className="w-full rounded-full bg-blush py-4 text-sm font-semibold text-noir transition-colors hover:bg-cream">
                    Оформить заказ →
                  </button>
                </Summary>
              </>
            ) : (
              <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6" data-lenis-prevent>
                  <Field label="Ваше имя" name="name" placeholder="Анна" />
                  <Field label="Телефон" name="phone" type="tel" placeholder="+7 (___) ___-__-__" />
                  <Field label="Адрес доставки" name="address" placeholder="Улица, дом, квартира" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Дата" name="date" type="date" />
                    <label className="block">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cream/45">Время</span>
                      <select name="time" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blush">
                        {['Как можно скорее', '09:00–12:00', '12:00–15:00', '15:00–18:00', '18:00–21:00', '21:00–23:00'].map((t) => (
                          <option key={t} className="bg-ink">
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="flex items-center gap-3 text-sm text-cream/70">
                    <input type="checkbox" name="anon" className="h-4 w-4 accent-[#e8909f]" /> Доставить анонимно
                  </label>
                  <button type="button" onClick={() => setStep('cart')} className="text-sm text-cream/50 hover:text-blush">
                    ← Назад в корзину
                  </button>
                </div>
                <Summary total={total} delivery={delivery}>
                  <button type="submit" className="w-full rounded-full bg-blush py-4 text-sm font-semibold text-noir transition-colors hover:bg-cream">
                    Подтвердить заказ
                  </button>
                </Summary>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Summary({ total, delivery, children }: { total: number; delivery: number; children: React.ReactNode }) {
  const left = FREE_DELIVERY - total
  return (
    <div className="border-t border-white/10 px-6 py-5">
      {left > 0 && (
        <div className="mb-4">
          <p className="text-xs text-cream/50">До бесплатной доставки — {formatPrice(left)}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-gradient-to-r from-berry to-blush" animate={{ width: `${Math.min(100, (total / FREE_DELIVERY) * 100)}%` }} />
          </div>
        </div>
      )}
      <div className="flex justify-between text-sm text-cream/60">
        <span>Доставка</span>
        <span>{delivery ? formatPrice(delivery) : 'бесплатно'}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-sm">Итого</span>
        <span className="font-display text-4xl">{formatPrice(total + delivery)}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Field({ label, name, type = 'text', placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cream/45">{label}</span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-cream/25 focus:border-blush [color-scheme:dark]"
      />
    </label>
  )
}
