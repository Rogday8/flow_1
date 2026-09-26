import { motion, useMotionTemplate, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cut, photo } from '../data/media'
import { useSectionProgress } from './fx'

/**
 * Прилипающая сцена: фото раскрывается из круга на весь экран,
 * пока поверх него разъезжаются слова и вращается пион.
 */
export function BloomReveal() {
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref, ['start start', 'end end'])

  // радиус считаем числом и собираем строку сами — так clip-path гарантированно пересчитывается покадрово
  const radius = useTransform(p, [0, 0.55], [12, 75])
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`
  const imgScale = useTransform(p, [0, 0.6], [1.5, 1])
  const leftX = useTransform(p, [0, 0.5], ['0%', '-60%'])
  const rightX = useTransform(p, [0, 0.5], ['0%', '60%'])
  const wordsOpacity = useTransform(p, [0.35, 0.55], [1, 0])
  const peonyRotate = useTransform(p, [0, 1], [0, 220])
  const peonyScale = useTransform(p, [0, 0.4, 0.6], [0.6, 1, 0.2])
  const peonyOpacity = useTransform(p, [0.45, 0.6], [1, 0])
  const captionOpacity = useTransform(p, [0.6, 0.75], [0, 1])
  const captionY = useTransform(p, [0.6, 0.8], [60, 0])

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.img src={photo('peony-window')} alt="Пионы у окна" className="h-full w-full object-cover" style={{ scale: imgScale }} />
          <div className="absolute inset-0 bg-noir/35" />
        </motion.div>

        <motion.div className="pointer-events-none relative z-10 flex w-full items-center justify-center gap-[18vw] font-display text-[clamp(3rem,12vw,12rem)] font-light leading-none" style={{ opacity: wordsOpacity }}>
          <motion.span style={{ x: leftX }}>живые</motion.span>
          <motion.span style={{ x: rightX }} className="italic text-gradient">
            цветы
          </motion.span>
        </motion.div>

        <motion.img
          src={cut('yellow-peony')}
          alt=""
          className="absolute z-20 w-[34vmin] drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
          style={{ rotate: peonyRotate, scale: peonyScale, opacity: peonyOpacity }}
        />

        <motion.div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-12" style={{ opacity: captionOpacity, y: captionY }}>
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-end">
            <h3 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[0.95]">
              Срезаны на рассвете — <span className="italic text-blush">у вас к обеду</span>
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-cream/75">
              Мы работаем только с живым сезонным сырьём. Никаких крашеных роз и сухой пены — только вода, свежий срез и немного магии флориста.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
