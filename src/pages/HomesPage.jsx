import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import MiniCarousel from '../components/MiniCarousel'
import { Arrow, Reveal, WhatsAppIcon } from '../components/Reveal'
import { CATEGORIES, fmtPrice, getCategory, perSqft, waLink } from '../data/content'

const SORTS = [
  { v: 'relevance', l: 'Relevance' },
  { v: 'low', l: 'Price: Low to High' },
  { v: 'high', l: 'Price: High to Low' },
  { v: 'area', l: 'Largest area' },
]
const STATUS = [
  { v: 'all', l: 'All' },
  { v: 'ready', l: 'Ready to move' },
  { v: 'build', l: 'New booking' },
]

function ListingCard({ cat, l, i }) {
  const nav = useNavigate()
  const to = `${cat.to}/${l.id}`
  const price = Number.isFinite(l.price) ? fmtPrice(l.price) : 'Price on request'
  const area = Number.isFinite(l.area) ? `${l.area.toLocaleString('en-IN')} sq.ft` : 'Details on request'
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="grid cursor-pointer overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory-50 shadow-[0_2px_20px_-12px_rgba(20,18,14,0.4)] transition duration-500 hover:shadow-[0_30px_60px_-30px_rgba(20,18,14,0.55)] sm:grid-cols-[270px_1fr]"
      onClick={() => nav(to)}
    >
      <div className="relative h-60 sm:h-auto sm:min-h-[250px]">
        <MiniCarousel cat={cat} listing={l} />
        <span className="absolute left-3 top-3 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-medium text-charcoal">{l.tag}</span>
      </div>

      <div className="flex flex-col p-5 text-charcoal sm:p-6">
        <span className="w-fit rounded-md bg-champagne/15 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-champagne-dark">{l.tag}</span>
        <h3 className="mt-3 font-sans text-xl font-semibold leading-tight text-charcoal sm:text-[1.4rem]">
          {cat.key === 'home2' ? l.name : `${l.beds} BHK ${cat.key === 'villa' ? 'Duplex Villa' : 'Independent Home'} · ${l.name}`}
        </h3>
        <p className="mt-1 text-[15px] font-normal text-charcoal/75">Panruti & surrounding areas</p>

        <div className="mt-5 grid grid-cols-2 gap-y-4 text-charcoal sm:grid-cols-3 sm:divide-x sm:divide-charcoal/10">
          <div className="sm:pr-5">
            <p className="font-sans text-[1.65rem] font-semibold leading-tight text-champagne-dark">{price}</p>
            {Number.isFinite(l.price) && Number.isFinite(l.area) && (
              <p className="mt-1 text-[13px] text-charcoal/70">Avg. price: {perSqft(l.price, l.area)}</p>
            )}
          </div>
          <div className="sm:px-5">
            <p className="text-base font-semibold">{area}</p>
            <p className="mt-1 text-[13px] text-charcoal/70">Built-up area</p>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:pl-5">
            <p className="text-base font-semibold">{l.timeline}</p>
            <p className="mt-1 text-[13px] text-charcoal/70">{l.timeline === 'Contact for details' ? 'Availability & specs' : 'Possession status'}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {l.highlights.map((h) => (
            <span key={h} className="chip">{h}</span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="text-sm text-charcoal/70">{l.beds} Bed · {l.baths} Bath{l.floors > 1 ? ' · 2 Floors' : ''}</span>
          <div className="flex items-center gap-3">
            <Link to={to} onClick={(e) => e.stopPropagation()} className="rounded-full border border-charcoal/30 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal transition hover:border-champagne-dark hover:text-champagne-dark">
              View details
            </Link>
            <a
              href={waLink(`Hello RS Builders, I'm interested in "${l.name}" (${cat.short}, ${price}). Please share more details.`)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffad00] to-[#ff6f24] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" /> Contact
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/** Listing-style landing page, shared by 2BHK / 3BHK / Duplex Villas. */
export default function HomesPage({ catKey }) {
  const cat = getCategory(catKey)
  const [sort, setSort] = useState('relevance')
  const [status, setStatus] = useState('all')
  const [activeCta, setActiveCta] = useState(null)
  const others = CATEGORIES.filter((c) => c.key !== catKey)
  const ctaOutline = 'btn-ghost border-white/60 bg-white/10 text-white hover:border-[#ff6a1a] hover:bg-[#ff6a1a]/15 hover:text-white'

  const list = useMemo(() => {
    let r = cat.listings.filter((l) => (status === 'all' ? true : status === 'ready' ? l.ready === true : l.ready === false))
    if (sort === 'low') r = [...r].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    if (sort === 'high') r = [...r].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    if (sort === 'area') r = [...r].sort((a, b) => (b.area ?? -Infinity) - (a.area ?? -Infinity))
    return r
  }, [cat, sort, status])

  const reset = () => {
    setSort('relevance')
    setStatus('all')
  }
  const changed = sort !== 'relevance' || status !== 'all'

  return (
    <>
      <PageHero variant={cat.key} tone="dusk" photo={cat.image} lines={cat.title} price={cat.price} line={cat.heroLine}>
        <div
          className="flex flex-wrap items-center gap-4"
          onMouseLeave={() => setActiveCta(null)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setActiveCta(null)
          }}
        >
          <a
            href="#designs"
            onPointerEnter={() => setActiveCta('explore')}
            onFocus={() => setActiveCta('explore')}
            className={activeCta === 'enquire' ? ctaOutline : 'btn-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-light'}
          >
            Explore Designs <Arrow />
          </a>
          <a
            href={waLink(`Hello RS Builders, I'm interested in ${cat.short} (${cat.price}). Please share more details.`)}
            target="_blank"
            rel="noreferrer"
            onPointerEnter={() => setActiveCta('enquire')}
            onFocus={() => setActiveCta('enquire')}
            className={activeCta === 'enquire'
              ? 'btn-whatsapp px-7 uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-light'
              : ctaOutline}
          >
            <WhatsAppIcon className="h-4 w-4" /> Enquire
          </a>
        </div>
      </PageHero>

      <section id="designs" className="scroll-mt-14 bg-ivory text-charcoal">
        {/* filter bar */}
        <div className="z-30 border-b md:sticky md:top-[60px] border-charcoal/10 bg-ivory/95 backdrop-blur">
          <div className="container-x flex flex-wrap items-center gap-2.5 py-3.5">
            <span className="hidden md:inline-block rounded-lg border border-champagne-dark bg-champagne/15 px-4 py-2 text-[13px] text-charcoal">{cat.key === 'villa' ? 'Duplex Villa' : 'Independent Home'}</span>
            <span className="hidden md:inline-block rounded-lg border border-champagne-dark bg-champagne/15 px-4 py-2 text-[13px]">{cat.short.split(' ')[0]}</span>
            <span className="hidden md:inline-block rounded-lg border border-charcoal/15 bg-ivory-50 px-4 py-2 text-[13px]">{cat.price}</span>
            <div className="mx-1 hidden h-6 w-px bg-charcoal/15 md:block" />
            {STATUS.map((s) => (
              <button
                key={s.v}
                onClick={() => setStatus(s.v)}
                className={`rounded-lg border px-4 py-2 text-[13px] transition ${status === s.v ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/15 bg-ivory-50 hover:border-champagne-dark'}`}
              >
                {s.l}
              </button>
            ))}
            {changed && (
              <button onClick={reset} className="px-2 text-[13px] font-medium underline underline-offset-4 hover:text-champagne-dark">
                Reset filters
              </button>
            )}
          </div>
        </div>

        <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-charcoal/55">
                  Showing {list.length ? `1 – ${list.length}` : '0'} of {cat.listings.length} designs
                </p>
                <h2 className="mt-1 font-display text-3xl font-medium sm:text-4xl">{cat.listTitle}</h2>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <span className="text-charcoal/60">Sort by:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-charcoal/15 bg-ivory-50 px-3 py-2.5 text-sm outline-none focus:border-champagne-dark">
                  {SORTS.map((s) => (
                    <option key={s.v} value={s.v}>{s.l}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-6">
              {list.map((l, i) => (
                <ListingCard key={l.id} cat={cat} l={l} i={i} />
              ))}
              {!list.length && (
                <div className="rounded-2xl border border-dashed border-charcoal/20 p-10 text-center">
                  <p className="font-display text-2xl">No designs match these filters.</p>
                  <button onClick={reset} className="mt-4 text-sm font-medium underline underline-offset-4">Reset filters</button>
                </div>
              )}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-charcoal/50">
              Illustrative design concepts with indicative prices. Actual layouts, specifications, pricing and availability may vary; please confirm with RS Builders.
            </p>
          </div>

          {/* sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">
            <Reveal>
              <div className="overflow-hidden rounded-2xl bg-charcoal p-7 text-ivory">
                <p className="eyebrow">{cat.short}</p>
                <h3 className="display mt-3 text-3xl">Planning to build your dream home?</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">Talk to RS Builders on WhatsApp for designs, pricing and a personal consultation.</p>
                <a href={waLink(`Hello RS Builders, I'm interested in ${cat.short} (${cat.price}).`)} target="_blank" rel="noreferrer" className="btn-whatsapp mt-6 w-full justify-center">
                  <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                </a>
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/40">Indicative range · {cat.price}</p>
              </div>
            </Reveal>
            <div className="rounded-2xl border border-charcoal/10 bg-ivory-50 p-6">
              <p className="eyebrow !text-champagne-dark">Also explore</p>
              <div className="mt-4 divide-y divide-charcoal/10">
                {others.map((o) => (
                  <Link key={o.key} to={o.to} className="group flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-display text-xl transition group-hover:text-champagne-dark">{o.short}</p>
                      <p className="text-sm text-charcoal/55">{o.price}</p>
                    </div>
                    <Arrow className="text-champagne-dark transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
