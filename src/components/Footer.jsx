import { Link } from 'react-router-dom'
import { NAV, waLink } from '../data/content'
import { Reveal, WhatsAppIcon } from './Reveal'

export function WhatsAppBand({ title = "Let's Build Your Dream Home", text = 'Talk to us on WhatsApp for a personalised consultation.', message }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 py-14 sm:py-16">
      <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal>
          <h3 className="display text-3xl text-ivory sm:text-4xl">{title}</h3>
          <p className="mt-2 max-w-md text-ivory/65">{text}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_12px_40px_-12px_rgba(37,211,102,0.55)] transition hover:-translate-y-0.5 hover:bg-[#1fb95a]"
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#200b0a] via-[#45100f] to-[#711b19]">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 py-8 md:flex-row md:items-center">
          <Link to="/" className="flex items-center gap-3" aria-label="RS Builders home">
            <img src="/images/Terracotta R&S Architectural Monogram.png" alt="" aria-hidden="true" className="h-10 w-10 rounded-full border border-champagne/40 bg-ivory object-cover" />
            <span className="font-display text-2xl font-bold text-ivory">RS Builders</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-ivory/80" aria-label="Footer">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="transition-colors hover:text-champagne-light">
                {n.label}
              </Link>
            ))}
            <Link to="/contact" className="transition-colors hover:text-champagne-light">Contact Us</Link>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/15 py-5 text-xs text-ivory/70 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RS Builders. All rights reserved.</span>
          <p>
            Designed &amp; Developed by <span className="font-semibold text-ivory">Deepika S</span>
            <span className="mx-1.5">·</span>
            Ph. No. <a href="tel:+919360321472" className="font-semibold text-champagne-light transition hover:text-white">+919360321472</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
