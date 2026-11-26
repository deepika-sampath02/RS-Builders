import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Scene from './Scene'
import { Lines } from './Reveal'
import { CONFIG, createFrameScroll } from '../lib/frameScroll'

/**
 * Scroll-controlled frame-animation hero.
 * Same text, buttons and look as the old hero — the background is now a <canvas>
 * that plays your frames as you scroll. All animation logic lives in lib/frameScroll.js.
 *
 * Structure:
 *   <section>  (tall, ~500vh)  ← the scroll distance
 *     <div sticky>  (stays on screen, 100svh)
 *        fallback picture · canvas · dark gradients · hero text · hints
 */
export default function ScrollHero({ eyebrow, lines, sub, children, lastLineClassName = '', storyStages = [] }) {
  const section = useRef(null)
  const sticky = useRef(null)
  const canvas = useRef(null)
  const text = useRef(null)
  const scrim = useRef(null)
  const hint = useRef(null)
  const loader = useRef(null)
  const loaderFill = useRef(null)
  const loaderLabel = useRef(null)
  const story = useRef(null)

  useEffect(() => {
    const stop = createFrameScroll({
      section: section.current,
      sticky: sticky.current,
      canvas: canvas.current,
      text: text.current,
      scrim: scrim.current,
      hint: hint.current,
      loader: loader.current,
      loaderFill: loaderFill.current,
      loaderLabel: loaderLabel.current,
      story: story.current,
    })
    return stop
  }, [])

  return (
    <section ref={section} className="relative" style={{ height: CONFIG.heroHeight }}>
      <div ref={sticky} className="grain sticky top-0 isolate overflow-hidden" style={{ height: '100vh' }}>
        {/* Backup picture: visible while frame 1 loads, or if the frames can't be found */}
        <div className="absolute inset-0 z-0">
          <Scene kind="villa" variant="home3" tone="dusk" photo="/images/hero.jpg" />
        </div>

        <canvas ref={canvas} className="absolute inset-0 z-[1] h-full w-full opacity-0 transition-opacity duration-700" aria-hidden="true" />

        {/* The left gradient fades with the intro text; the bottom gradient blends into the next section. */}
        <div ref={scrim} className="absolute inset-0 z-[2] bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-1/4 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

        {/* Hero text (fades out + moves up in the first 10% of scroll) */}
        <div ref={text} className="absolute inset-0 z-10 will-change-transform">
          <div className="container-x flex h-full flex-col justify-center pb-16 pt-20 md:pb-20 md:pt-24">
            {eyebrow && (
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-4">
                {eyebrow}
              </motion.p>
            )}
            <h1 className="display max-w-3xl translate-y-8 overflow-visible text-[2.7rem] font-semibold leading-[1.06] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-[6.4rem]">
              <Lines lines={lines} delay={0.3} lastLineClassName={lastLineClassName} />
            </h1>
            {sub && (
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }} className="mt-4 max-w-xl text-lg leading-relaxed text-ivory/90 sm:text-xl">
                {sub}
              </motion.p>
            )}
            {children && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }} className="mt-5 flex flex-wrap items-center gap-4">
                {children}
              </motion.div>
            )}
          </div>
        </div>

        {storyStages.length > 0 && (
          <div ref={story} className="pointer-events-none absolute inset-0 z-[8] opacity-0 transition-opacity duration-500">
            {storyStages.map((stage, index) => (
              <div
                key={stage.title}
                data-story-stage
                data-active="false"
                aria-hidden="true"
                className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100"
              >
                <div className={`container-x flex h-full items-end pb-20 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <article className="w-full max-w-xs rounded-xl border-2 border-champagne-dark bg-slate-100/55 p-5 text-charcoal shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)] backdrop-blur-[3px]">
                    <p className="eyebrow mb-2 inline-flex w-fit items-center rounded-full border border-champagne-dark/50 bg-champagne/20 px-2.5 py-1 text-xs font-bold !text-[#481012]">Step {stage.n} · {stage.title}</p>
                    <h2 className="display text-[1.65rem] text-charcoal">{stage.title}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{stage.text}</p>
                  </article>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* "Scroll" hint */}
        <div ref={hint} className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-luxe text-ivory/60">
          Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-champagne to-transparent" />
        </div>

        {/* Loading percentage (fades out when every frame is loaded) */}
        <div ref={loader} className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex flex-col items-center gap-2 transition-opacity duration-500">
          <span ref={loaderLabel} className="text-[11px] uppercase tracking-[0.25em] text-ivory/70">
            Loading 0%
          </span>
          <div className="h-px w-40 bg-ivory/20">
            <div ref={loaderFill} className="h-px bg-champagne-light" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
