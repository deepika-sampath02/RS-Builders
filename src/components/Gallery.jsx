import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Scene from './Scene'
import { CATEGORIES, getCategory, waLink } from '../data/content'
import { Arrow, WhatsAppIcon } from './Reveal'

const FILTERS = [{ key: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.short }))]

/**
 * Immersive project gallery: filterable masonry-style grid + full-screen lightbox
 * with keyboard (← → Esc) and swipe navigation.
 */
export default function Gallery({ projects, showFilters = true }) {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)

  const list = filter === 'all' ? projects : projects.filter((p) => p.type === filter)

  const step = useCallback(
    (d) => {
      setActive((a) => {
        if (a === null) return a
        const i = list.findIndex((p) => p.id === a)
        return list[(i + d + list.length) % list.length].id
      })
    },
    [list]
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, step])

  const current = projects.find((p) => p.id === active)
  const currentCat = current && getCategory(current.type)

  return (
    <div>
      {showFilters && (
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.2em] transition ${
                filter === f.key ? 'border-champagne bg-champagne text-charcoal' : 'border-ivory/20 text-ivory/70 hover:border-champagne hover:text-champagne'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <LayoutGroup>
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(p.id)}
                className={`group relative overflow-hidden rounded-2xl border border-ivory/10 text-left ${i % 4 === 0 ? 'aspect-[4/5] sm:row-span-1' : 'aspect-[4/5] lg:aspect-[5/6]'}`}
                aria-label={`Open ${p.name}`}
              >
                <div className="absolute inset-0 transition-transform duration-[2000ms] ease-out group-hover:scale-110">
                  <Scene kind="villa" variant={p.variant} tone={p.tone} photo={p.photo} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b0808]/90 via-[#1b0808]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow !text-[10px]" style={{ color: "#ffca52" }}>{getCategory(p.type).short} · {p.year}</p>
                  <h3 className="display mt-2 text-3xl text-white transition-transform duration-700 group-hover:-translate-y-1">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{p.area}</p>
                </div>
                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 bg-charcoal/40 text-ivory opacity-0 backdrop-blur transition duration-500 group-hover:opacity-100">
                  <Arrow className="-rotate-45" />
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/95 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={current.name}
          >
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) step(1)
                else if (info.offset.x > 80) step(-1)
              }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-champagne/20 bg-charcoal-800 md:grid-cols-[1.6fr_1fr]"
            >
              <div className="aspect-[4/3] md:aspect-auto md:min-h-[520px]">
                <Scene kind="villa" variant={current.variant} tone={current.tone} photo={current.photo} />
              </div>
              <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
                <div>
                  <p className="eyebrow">{currentCat.short} · {current.year}</p>
                  <h3 className="display mt-3 text-4xl text-ivory sm:text-5xl">{current.name}</h3>
                  <p className="mt-2 text-ivory/60">{current.area}</p>
                  <p className="mt-6 font-display text-2xl italic leading-snug text-champagne-light">{current.story}</p>
                </div>
                <div className="space-y-4">
                  <a href={waLink(`Hello RS Builders, I loved "${current.name}". I'd like something similar — can we talk?`)} target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center">
                    <WhatsAppIcon className="h-4 w-4" /> I want a home like this
                  </a>
                  <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-ivory/60">
                    <button onClick={() => step(-1)} className="flex items-center gap-2 hover:text-champagne"><Arrow className="rotate-180" /> Prev</button>
                    <button onClick={() => setActive(null)} className="hover:text-champagne">Close</button>
                    <button onClick={() => step(1)} className="flex items-center gap-2 hover:text-champagne">Next <Arrow /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
