import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scene from './Scene'
import { Arrow } from './Reveal'

const GOLD = '#ffb100'

/**
 * Editorial category card with a restrained photo treatment and clear pricing.
 */
export default function PropertyCard({ cat, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        to={cat.to}
        aria-label={`${cat.cardTitle} — ${cat.price}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white text-ink shadow-[0_12px_32px_-24px_rgba(62,16,17,0.34)] transition-[border-color,box-shadow] duration-300 hover:border-brand/25 hover:shadow-[0_24px_52px_-26px_rgba(62,16,17,0.42)]"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[1800ms] ease-out group-hover:scale-[1.045]">
            <Scene kind="villa" variant={cat.key} tone={index % 2 ? 'gold' : 'dusk'} photo={cat.image} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b0808]/45 via-transparent to-[#1b0808]/15" />
          <span className="absolute left-5 top-5 border border-white/60 bg-[#1b0808]/65 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            0{index + 1} / 03 · {cat.short}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <div>
            <h3 className="display text-3xl font-semibold text-ink sm:text-4xl">{cat.cardTitle}</h3>
            <p className="mt-3 min-h-[52px] text-[16px] font-medium leading-relaxed text-ink/70">{cat.cardLine}</p>
            <ul className="mt-5 min-h-[92px] space-y-2.5 text-[15px] font-medium text-ink/80">
              {cat.cardBullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m4.5 10.3 3.4 3.4 7.6-7.5" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-3 pt-7 sm:grid-cols-2">
            <div className="flex min-h-[68px] min-w-0 flex-col items-center justify-center rounded-lg border border-ink/15 bg-[#fff3e8] px-3 py-3 text-center sm:min-h-[84px]">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink/55 sm:text-[10px]">Starting from</p>
              <p className="mt-1 font-display text-[16px] font-semibold leading-[1.08] text-ink sm:text-[17px]">{cat.price}</p>
            </div>
            <span className="flex min-h-[56px] min-w-0 items-center justify-center gap-2 rounded-lg border border-brand bg-brand px-3 py-3 text-center text-[11px] font-bold uppercase leading-tight tracking-[0.08em] text-white shadow-[0_8px_18px_-12px_rgba(222,58,13,0.8)] transition-[background-color,border-color,box-shadow,transform] duration-300 group-hover:border-champagne-light group-hover:bg-[#f59a18] group-hover:text-charcoal group-hover:shadow-[0_12px_26px_-10px_rgba(255,177,0,0.75)] group-active:scale-[0.97] group-active:border-[#be3318] group-active:bg-[#be3318] group-active:text-white sm:min-h-[84px] sm:text-[12px]">
              Explore Home <Arrow className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-2 group-active:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}