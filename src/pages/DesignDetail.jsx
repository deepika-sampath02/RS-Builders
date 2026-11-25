import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Scene from '../components/Scene'
import { slidesFor } from '../components/MiniCarousel'
import { Arrow, Reveal, WhatsAppIcon } from '../components/Reveal'
import { emiK, fmtEmi, fmtPrice, getCategoryBySlug, perSqft, waLink } from '../data/content'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'calculator', label: 'EMI Calculator' },
  { id: 'similar', label: 'Similar designs' },
]
const TABS_WITHOUT_CALCULATOR = TABS.filter((tab) => tab.id !== 'calculator')

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'front-view', label: 'Front view', matches: (label) => label.toLowerCase().includes('front view') },
  { id: 'bedrooms', label: 'Bedrooms', matches: (label) => label.toLowerCase().includes('bedroom') },
  { id: 'bathrooms', label: 'Bathrooms', matches: (label) => label.toLowerCase().includes('bathroom') },
  { id: 'living', label: 'Hall & living', matches: (label) => /hall|living|pooja/i.test(label) },
  { id: 'kitchen', label: 'Kitchen', matches: (label) => label.toLowerCase().includes('kitchen') },
  { id: 'balcony', label: 'Balcony', matches: (label) => label.toLowerCase().includes('balcony') },
  { id: 'entrance', label: 'Entrance', matches: (label) => label.toLowerCase().includes('entrance') },
  { id: 'stairs', label: 'Stairs', matches: (label) => label.toLowerCase().includes('stairs') },
  { id: 'video', label: 'Video tour', matches: (label) => label.toLowerCase().includes('video') },
]

const Check = () => (
  <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-champagne-dark" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" />
    <path d="m6.5 10.3 2.4 2.4 4.6-5" />
  </svg>
)

function Calculator({ price }) {
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const emi = emiK(price, down / 100, rate, years)
  const loan = price * (1 - down / 100)
  const pct = (v, min, max) => `${((v - min) / (max - min)) * 100}%`

  const Row = ({ label, value, min, max, step, set, show }) => (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-ivory/60">{label}</span>
        <span className="font-display text-xl text-ivory">{show}</span>
      </div>
      <input type="range" className="gold mt-3" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} style={{ '--p': pct(value, min, max) }} aria-label={label} />
    </div>
  )

  return (
    <div className="grid gap-10 rounded-3xl bg-charcoal p-7 text-ivory sm:p-10 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-8">
        <Row label="Down payment" value={down} min={10} max={60} step={5} set={setDown} show={`${down}%`} />
        <Row label="Interest rate (p.a.)" value={rate} min={7} max={13} step={0.25} set={setRate} show={`${rate}%`} />
        <Row label="Loan tenure" value={years} min={5} max={30} step={1} set={setYears} show={`${years} yrs`} />
      </div>
      <div className="flex flex-col justify-center rounded-2xl border border-champagne/25 bg-charcoal-800 p-7 text-center">
        <p className="eyebrow">Monthly EMI</p>
        <p className="display mt-3 text-5xl text-champagne-light sm:text-6xl">{fmtEmi(emi)}</p>
        <p className="mt-4 text-sm text-ivory/55">
          Loan amount ≈ {fmtPrice(Math.round(loan * 10) / 10)} on {fmtPrice(price)}
        </p>
        <p className="mt-1 text-xs text-ivory/35">Indicative only. Confirm with your bank.</p>
      </div>
    </div>
  )
}

function ContactCard({ cat, l }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(true)
  const [loan, setLoan] = useState(false)

  const send = (e) => {
    e.preventDefault()
    const price = Number.isFinite(l.price) ? fmtPrice(l.price) : 'price on request'
    const area = Number.isFinite(l.area) ? `${l.area} sq.ft` : 'area on request'
    const msg =
      `Hello RS Builders,\nI'm interested in "${l.name}" (${cat.short}, ${price}, ${area}).\n` +
      (name ? `Name: ${name}\n` : '') +
      (phone ? `Phone: ${phone}\n` : '') +
      (loan ? 'I am also interested in home loan guidance.\n' : '') +
      'Please share the plan, availability and next steps.'
    window.open(waLink(msg), '_blank', 'noopener')
  }
  const field = 'w-full border-b border-charcoal/20 bg-transparent py-3 text-[15px] outline-none transition placeholder:text-charcoal/35 focus:border-champagne-dark'

  return (
    <form onSubmit={send} className="rounded-2xl border border-charcoal/10 bg-ivory-50 p-6 shadow-[0_20px_50px_-30px_rgba(20,18,14,0.5)]">
      <div className="-mx-6 -mt-6 mb-5 rounded-t-2xl bg-charcoal px-6 py-3 text-sm text-ivory">Interested? Talk to the builder directly.</div>
      <h3 className="font-display text-2xl font-medium">Contact RS Builders</h3>
      <p className="mt-1 text-sm text-charcoal/55">Direct from the builder · Panruti</p>
      <p className="mt-5 text-sm font-medium">Please share your contact details</p>
      <div className="mt-2 space-y-3">
        <input className={field} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <input className={field} placeholder="Phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-charcoal/75">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[#cd441a]" />
        <span>I agree to be contacted by RS Builders via WhatsApp, phone or email.</span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm text-charcoal/75">
        <input type="checkbox" checked={loan} onChange={(e) => setLoan(e.target.checked)} className="mt-1 h-4 w-4 accent-[#cd441a]" />
        <span>I am interested in home loan guidance.</span>
      </label>
      <button type="submit" disabled={!agree} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#1fb95a] disabled:opacity-50">
        <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
      </button>
    </form>
  )
}

export default function DesignDetail() {
  const { slug, id } = useParams()
  const cat = getCategoryBySlug(slug)
  const l = cat?.listings.find((x) => x.id === id)
  const [slide, setSlide] = useState(0)
  const [active, setActive] = useState('overview')
  const [galleryCategory, setGalleryCategory] = useState('all')
  const hasPrice = Number.isFinite(l?.price)
  const tabs = hasPrice ? TABS : TABS_WITHOUT_CALCULATOR

  useEffect(() => {
    setSlide(0)
    setGalleryCategory('all')
  }, [id])

  useEffect(() => {
    if (!l) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' }
    )
    tabs.forEach((t) => {
      const el = document.getElementById(t.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [l, tabs])

  if (!cat || !l) return <Navigate to="/" replace />

  const slides = slidesFor(cat, l)
  const galleryCategories = GALLERY_CATEGORIES.filter((category) =>
    category.id === 'all' || slides.some((item) => category.matches(item.label))
  )
  const selectedGalleryCategory = galleryCategories.some((category) => category.id === galleryCategory)
    ? galleryCategory
    : 'all'
  const visibleSlides = selectedGalleryCategory === 'all'
    ? slides
    : slides.filter((item) => galleryCategories.find((category) => category.id === selectedGalleryCategory).matches(item.label))
  const currentSlide = visibleSlides[slide] || visibleSlides[0]
  const others = cat.listings.filter((x) => x.id !== l.id)
  const emi = hasPrice ? emiK(l.price) : null
  const price = hasPrice ? fmtPrice(l.price) : 'Price on request'
  const area = Number.isFinite(l.area) ? `${l.area.toLocaleString('en-IN')} sq.ft` : 'To be confirmed'

  const stats = [
    [area, 'Built-up area'],
    [
      hasPrice && Number.isFinite(l.area) ? perSqft(l.price, l.area) : hasPrice ? price : 'Contact for details',
      hasPrice && Number.isFinite(l.area) ? 'Avg. price' : 'Price',
    ],
    ...(l.age ? [[l.age, 'Age of property']] : []),
    [l.timeline, l.timeline === 'Contact for details' ? 'Availability & specs' : 'Possession status'],
    [`${l.facing} facing`, 'Facing'],
    [l.furnishing, 'Furnishing'],
  ]
  const overview = [
    ['Brokerage', 'None — direct from builder'],
    ['Price', price],
    ['Carpet area', Number.isFinite(l.carpet) ? `${l.carpet.toLocaleString('en-IN')} sq.ft` : 'To be confirmed'],
    ['Built-up area', area],
    ['Bedrooms', l.beds],
    ['Bathrooms', l.baths ?? 'To be confirmed'],
    ['Floors', l.floors ? (l.floors > 1 ? '2 (duplex)' : '1') : 'To be confirmed'],
    ['Parking', l.parking],
    ['Balcony', l.balcony ?? 'To be confirmed'],
    ['Facing', l.facing],
  ]
  const jump = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* title band */}
      <section className="bg-white pb-10 pt-28 text-charcoal sm:pt-32">
        <div className="container-x">
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-charcoal/55" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-champagne-dark">Home</Link> /
            <Link to={cat.to} className="hover:text-champagne-dark">{cat.short}</Link> /
            <span className="text-charcoal/80">{l.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="display text-4xl text-charcoal sm:text-5xl">
                {cat.key === 'home2' ? l.name : <>{l.beds} BHK {cat.key === 'villa' ? 'Duplex Villa' : 'Independent Home'} <span className="italic text-champagne-light">· {l.name}</span></>}
              </h1>
              <p className="mt-2 text-charcoal/65">Panruti & surrounding areas</p>
                <span className="mt-4 inline-block rounded bg-champagne px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal">RS Builders Design</span>
            </div>
            <div className="text-left sm:text-right">
              <p className="display text-5xl text-charcoal">{price}</p>
              {emi !== null && <p className="mt-1 text-sm text-champagne-dark">EMI starts at {fmtEmi(emi)}</p>}
              {hasPrice && Number.isFinite(l.area) && <p className="text-sm text-charcoal/60">{perSqft(l.price, l.area)}</p>}
              <a href={waLink(`Hello RS Builders, I'm interested in "${l.name}" (${cat.short}, ${price}).`)} target="_blank" rel="noreferrer" className="btn-whatsapp mt-4">
                <WhatsAppIcon className="h-4 w-4" /> Contact Builder
              </a>
            </div>
          </div>

          {/* gallery */}
          <div className="mt-8">
            <div className="flex gap-2 overflow-x-auto border-b border-charcoal/15 pb-3" role="tablist" aria-label="Photo categories">
              {galleryCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedGalleryCategory === category.id}
                  onClick={() => {
                    setGalleryCategory(category.id)
                    setSlide(0)
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                    selectedGalleryCategory === category.id
                      ? 'border-champagne bg-champagne text-charcoal'
                      : 'border-charcoal/20 text-charcoal/75 hover:border-champagne/60 hover:text-charcoal'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="relative mt-4">
              <div className="relative md:mx-12">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-charcoal/10 bg-gray-300">
                  <AnimatePresence mode="wait">
                    <motion.div key={`${selectedGalleryCategory}-${slide}`} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
                      <Scene kind={currentSlide.kind} variant={cat.key} tone={currentSlide.tone} photo={currentSlide.photo} video={currentSlide.video} poster={currentSlide.poster} />
                    </motion.div>
                  </AnimatePresence>
                  {!currentSlide.photo && !currentSlide.video && (
                    <span className="absolute bottom-4 left-4 rounded bg-charcoal/70 px-3 py-1 text-[11px] text-ivory/80 backdrop-blur">Illustrative design concept</span>
                  )}
                </div>
              </div>
              {visibleSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setSlide((index) => (index - 1 + visibleSlides.length) % visibleSlides.length)}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/25 bg-charcoal/65 text-ivory shadow-lg backdrop-blur transition hover:border-champagne hover:bg-charcoal/90 md:left-0"
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">‹</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setSlide((index) => (index + 1) % visibleSlides.length)}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/25 bg-charcoal/65 text-ivory shadow-lg backdrop-blur transition hover:border-champagne hover:bg-charcoal/90 md:right-0"
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">›</span>
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-charcoal/65">
              <span>{currentSlide.label}</span>
              <span>{slide + 1} / {visibleSlides.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* stat strip */}
      <section className="border-b border-charcoal/10 bg-ivory-50 text-charcoal">
        <div className={`container-x grid grid-cols-2 divide-charcoal/10 py-2 md:divide-x ${stats.length === 6 ? 'md:grid-cols-6' : 'md:grid-cols-5'}`}>
          {stats.map(([v, k]) => (
            <div key={k} className="px-4 py-5 text-center">
              <p className="text-lg font-medium text-champagne-dark">{v}</p>
              <p className="mt-0.5 text-sm text-charcoal/55">{k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tabs */}
      <div className="sticky top-[60px] z-30 border-b border-charcoal/10 bg-ivory-50/95 text-charcoal backdrop-blur">
        <div className="container-x flex gap-7 overflow-x-auto whitespace-nowrap">
          {tabs.map((t) => (
            <a key={t.id} href={`#${t.id}`} onClick={jump(t.id)} className={`border-b-2 py-4 text-[13px] font-medium uppercase tracking-[0.14em] transition ${active === t.id ? 'border-champagne-dark text-champagne-dark' : 'border-transparent hover:text-champagne-dark'}`}>
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* body */}
      <section className="bg-ivory text-charcoal">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <Reveal>
              <div id="highlights" className="scroll-mt-36 rounded-2xl border border-charcoal/10 border-l-4 border-l-champagne bg-ivory-50 p-7 sm:p-9">
                <h2 className="font-display text-3xl font-medium">Special Highlights</h2>
                <div className="my-5 h-px bg-charcoal/10" />
                <ul className="grid gap-4 sm:grid-cols-2">
                  {l.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3">
                      <Check /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div id="overview" className="scroll-mt-36 rounded-2xl border border-charcoal/10 bg-ivory-50 p-7 sm:p-9">
                <h2 className="font-display text-3xl font-medium">Property Overview</h2>
                <div className="my-5 h-px bg-charcoal/10" />
                <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {overview.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-sm text-charcoal/50">{k}</dt>
                      <dd className="mt-1 text-[16px] font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <h3 className="mt-9 font-display text-2xl font-medium">About this design</h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{l.desc}</p>
                <p className="mt-4 text-xs text-charcoal/45">Illustrative design concept. Actual layout, specifications and availability may vary; please confirm with RS Builders.</p>
              </div>
            </Reveal>

            <Reveal>
              {hasPrice && (
                <div id="calculator" className="scroll-mt-36">
                  <h2 className="mb-5 font-display text-3xl font-medium">Home loan EMI calculator</h2>
                  <Calculator price={l.price} />
                </div>
              )}
            </Reveal>

            <div id="similar" className="scroll-mt-36">
              <h2 className="mb-5 font-sans text-[1.35rem] font-semibold leading-7 text-charcoal">Similar designs</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {others.slice(0, 3).map((o) => (
                  <Link key={o.id} to={`${cat.to}/${o.id}`} className="group overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory-50 transition hover:shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden">
                      <div className="h-full w-full transition-transform duration-[1800ms] group-hover:scale-110">
                        <Scene
                          kind="villa"
                          variant={cat.key}
                          tone="gold"
                          photo={o.media?.find((item) => item.label === 'Front view')?.photo || o.media?.find((item) => item.photo)?.photo || `/images/${cat.slug}-${o.id}.jpg`}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-sans text-base font-semibold leading-6 text-charcoal">{cat.key === 'home2' ? o.name : `${o.beds} BHK ${cat.key === 'villa' ? 'Duplex Villa' : 'Independent Home'} · ${o.name}`}</p>
                      <p className="mt-1 font-sans text-sm font-medium leading-5 text-charcoal/75">{Number.isFinite(o.price) ? fmtPrice(o.price) : 'Price on request'} · {Number.isFinite(o.area) ? `${o.area.toLocaleString('en-IN')} sq.ft` : 'Area on request'}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to={cat.to} className="btn-dark mt-6">
                All {cat.short} <Arrow />
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-36 lg:self-start">
            <ContactCard cat={cat} l={l} />
          </aside>
        </div>
      </section>
    </>
  )
}
