import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { useCart } from '../state/cart'
import { Logo } from './Logo'

const LINKS = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#builder', label: 'Собрать букет' },
  { href: '#collections', label: 'Коллекции' },
  { href: '#subscription', label: 'Подписка' },
  { href: '#contacts', label: 'Контакты' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { count, setOpen, pulse } = useCart()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400 && !menu)
    setSolid(y > 40)
  })

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            solid ? 'glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]' : 'border border-transparent'
          }`}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative block overflow-hidden rounded-full px-4 py-2 text-sm text-cream/75 transition-colors hover:text-cream">
                  <span className="relative z-10 block transition-transform duration-500 group-hover:-translate-y-full">{l.label}</span>
                  <span className="absolute inset-0 z-10 flex translate-y-full items-center justify-center font-display text-base italic text-blush transition-transform duration-500 group-hover:translate-y-0">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-blush px-4 py-2.5 text-sm font-semibold text-noir transition-colors hover:bg-cream"
              aria-label="Открыть корзину"
            >
              <BagIcon />
              <span className="hidden sm:inline">Корзина</span>
              <motion.span
                key={pulse}
                initial={{ scale: 1.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-noir px-1 text-[0.65rem] text-blush"
              >
                {count}
              </motion.span>
            </button>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-label="Меню"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-cream transition-all duration-500 ${menu ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-5 bg-cream transition-all duration-500 ${menu ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-wine px-8 lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={l.href} onClick={() => setMenu(false)} className="font-display text-5xl text-cream">
                    <span className="mr-4 font-sans text-xs text-rose">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12 text-sm text-cream/60">
              +7 (999) 123-45-67 · ежедневно 8:00–23:00
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function BagIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  )
}
