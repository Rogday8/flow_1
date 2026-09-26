import { useEffect, useRef } from 'react'

type Petal = { x: number; y: number; r: number; vx: number; vy: number; rot: number; vr: number; flip: number; vf: number; hue: string; a: number }

const COLORS = ['#f4c9cc', '#e8909f', '#f9e4e1', '#d97b90', '#e7d3b3', '#fbd5dc']

/**
 * Падающие лепестки на canvas. Курсор работает как ветер: лепестки
 * рядом с ним разлетаются в сторону движения мыши.
 */
export function PetalRain({ density = 1, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 }
    let petals: Petal[] = []

    const spawn = (top = false): Petal => ({
      x: Math.random() * w,
      y: top ? -20 - Math.random() * 80 : Math.random() * h,
      r: 6 + Math.random() * 9,
      vx: 0.2 + Math.random() * 0.5,
      vy: 0.4 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      vf: 0.01 + Math.random() * 0.03,
      hue: COLORS[(Math.random() * COLORS.length) | 0],
      a: 0.45 + Math.random() * 0.5,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(((w * h) / 26000) * density)
      petals = Array.from({ length: Math.min(n, 90) }, () => spawn())
    }

    const draw = (p: Petal) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2)
      ctx.globalAlpha = p.a
      const g = ctx.createLinearGradient(0, -p.r, 0, p.r)
      g.addColorStop(0, p.hue)
      g.addColorStop(1, 'rgba(140,47,75,0.85)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(0, p.r)
      ctx.bezierCurveTo(p.r * 0.9, p.r * 0.2, p.r * 0.6, -p.r, 0, -p.r * 0.9)
      ctx.bezierCurveTo(-p.r * 0.6, -p.r, -p.r * 0.9, p.r * 0.2, 0, p.r)
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      const t = performance.now() / 1000
      for (const p of petals) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 16000) {
          const f = 1 - d2 / 16000
          p.vx += mouse.vx * 0.02 * f + (dx / 140) * f * 0.6
          p.vy += mouse.vy * 0.02 * f + (dy / 140) * f * 0.6
        }
        p.vx += (0.35 + Math.sin(t * 0.6 + p.y * 0.01) * 0.3 - p.vx) * 0.02
        p.vy += (0.7 - p.vy) * 0.02
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr + p.vx * 0.004
        p.flip += p.vf
        if (p.y > h + 30 || p.x > w + 40 || p.x < -40) Object.assign(p, spawn(true))
        draw(p)
      }
      mouse.vx *= 0.9
      mouse.vy *= 0.9
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      mouse.vx = nx - mouse.x
      mouse.vy = ny - mouse.y
      if (Math.abs(mouse.vx) > 200) mouse.vx = 0
      if (Math.abs(mouse.vy) > 200) mouse.vy = 0
      mouse.x = nx
      mouse.y = ny
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    resize()
    loop()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [density])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />
}
