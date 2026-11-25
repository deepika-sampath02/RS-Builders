import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Scene from './Scene'
import { Lines } from './Reveal'

/**
 * Cinematic hero: parallax scene, grain, gradient scrims and a masked headline.
 */
export default function PageHero({ eyebrow, lines, price, sub, line, variant = 'home2', tone = 'dusk', photo, tall = false, children, italicLast = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className={`grain relative isolate overflow-hidden ${tall ? 'min-h-[100svh]' : 'min-h-[88svh]'}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Scene kind="villa" variant={variant} tone={tone} photo={photo} />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-900/80 via-charcoal-800/30 to-brand/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-charcoal-900/70 to-transparent" />

      <motion.div style={{ y: textY, opacity: fade }} className="container-x flex min-h-[inherit] flex-col justify-end pb-20 pt-40 sm:pb-28 lg:pb-32">
        {eyebrow && (
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-6">
            {eyebrow}
          </motion.p>
        )}
        <h1 className="display max-w-3xl text-[3.4rem] text-ivory sm:text-7xl lg:text-[6.4rem]">
          <Lines lines={lines} italicLast={italicLast} delay={0.3} />
        </h1>
        {price && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="mt-6 font-sans text-xl font-normal tracking-wide text-ivory sm:text-2xl">
            {price}
          </motion.p>
        )}
        {line && (
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 1 }} className="mt-4 font-display text-2xl italic text-champagne-light sm:text-3xl">
            {line}
          </motion.p>
        )}
        {sub && (
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }} className="mt-5 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
            {sub}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }} className="mt-9 flex flex-wrap items-center gap-4">
            {children}
          </motion.div>
        )}
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-luxe text-ivory/50 md:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-champagne to-transparent" />
      </motion.div>
    </section>
  )
}
