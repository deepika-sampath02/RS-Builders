import { useState } from 'react'
import Scene from './Scene'

export const slidesFor = (cat, listing) => {
  if (!listing.media) {
    return [
      { label: 'Building', kind: 'villa', tone: 'dusk', photo: `/images/${cat.slug}-${listing.id}.jpg` },
      { label: 'Evening view', kind: 'villa', tone: 'gold', photo: `/images/${cat.slug}-${listing.id}-2.jpg` },
      { label: 'Living room', kind: 'interior', photo: `/images/${cat.slug}-${listing.id}-3.jpg` },
    ]
  }

  const frontViewIndex = listing.media.findIndex((item) => item.label.toLowerCase().includes('front view') && item.photo)
  return frontViewIndex > 0
    ? [listing.media[frontViewIndex], ...listing.media.slice(0, frontViewIndex), ...listing.media.slice(frontViewIndex + 1)]
    : listing.media
}

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

/** Small swipe-through image carousel used in listing cards. */
export default function MiniCarousel({ cat, listing, className = '' }) {
  const slides = slidesFor(cat, listing)
  const [i, setI] = useState(0)
  const go = (d) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setI((x) => (x + d + slides.length) % slides.length)
  }
  const s = slides[i]
  return (
    <div className={`group/c relative h-full w-full overflow-hidden ${className}`}>
      <div key={i} className="absolute inset-0 transition-transform duration-[2000ms] group-hover/c:scale-110">
        <Scene kind={s.kind} variant={cat.key} tone={s.tone} photo={s.photo} video={s.video} poster={s.poster} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-charcoal/10" />
      <button onClick={go(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow transition group-hover/c:opacity-100 max-sm:opacity-100">
        <Chevron flip />
      </button>
      <button onClick={go(1)} aria-label="Next image" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow transition group-hover/c:opacity-100 max-sm:opacity-100">
        <Chevron />
      </button>
      <span className="absolute bottom-3 right-3 rounded-full bg-charcoal/70 px-2.5 py-1 text-[11px] text-ivory backdrop-blur">
        {i + 1}/{slides.length}
      </span>
    </div>
  )
}
