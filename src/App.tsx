import Lenis from 'lenis'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { BloomReveal } from './components/BloomReveal'
import { Builder } from './components/Builder'
import { CartDrawer } from './components/CartDrawer'
import { Catalog } from './components/Catalog'
import { Collections } from './components/Collections'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Cursor } from './components/fx'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Manifesto } from './components/Manifesto'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Occasions } from './components/Occasions'
import { Process } from './components/Process'
import { Reviews } from './components/Reviews'
import { Splash } from './components/Splash'
import { Subscription } from './components/Subscription'
import { CartProvider, useCart } from './state/cart'

export default function App() {
  return (
    <CartProvider>
      <Site />
    </CartProvider>
  )
}

function Site() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  const { open } = useCart()

  useSmoothScroll(loading || open)

  return (
    <>
      <AnimatePresence>{loading && <Splash key="splash" onDone={done} />}</AnimatePresence>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <Manifesto />
        <Catalog />
        <BloomReveal />
        <Builder />
        <Collections />
        <Occasions />
        <Process />
        <Subscription />
        <Reviews />
        <Gallery />
        <Faq />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-berry via-rose to-champagne" style={{ scaleX }} />
}

/** Инерционный скролл; на время заставки и открытой корзины — стоп */
function useSmoothScroll(paused: boolean) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.2, smoothWheel: true, anchors: { offset: -20 } })
    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])

  useEffect(() => {
    if (!lenis) {
      document.body.style.overflow = paused ? 'hidden' : ''
      return
    }
    if (paused) lenis.stop()
    else lenis.start()
  }, [lenis, paused])
}
