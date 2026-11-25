import { ADDRESS, EMAIL, MAPS_LINK, PHONE_DISPLAY, PHONE_TEL, waLink } from '../data/content'
import { Arrow, Reveal, WhatsAppIcon } from './Reveal'

function ContactIcon({ kind }) {
  const paths = {
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-6-6l2-2-2-5Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

export default function ContactSection({ standalone = false }) {
  const Heading = standalone ? 'h1' : 'h2'

  return (
    <section id="contact" className={`bg-ivory py-20 sm:py-28 ${standalone ? 'pt-32 sm:pt-40' : ''}`}>
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow !text-sm !font-semibold !text-[#bd2424]">Get in touch</p>
          <Heading className="display mt-4 text-4xl font-bold leading-tight text-[#481012] sm:text-6xl">
            Let’s plan your
            <br />
            <span className="italic text-[#bd2424]">future home.</span>
          </Heading>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-charcoal/70">
            Tell us what you’re looking for. Our team is happy to help you explore designs, pricing and next steps.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <Reveal className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(62,16,17,0.35)] sm:p-9">
            <h2 className="font-display text-3xl font-bold leading-tight text-[#481012]">
              Speak with
              <br />
              <span className="italic text-[#bd2424]">RS Builders</span>
            </h2>
            <div className="mt-7 divide-y divide-charcoal/10">
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="flex gap-4 py-5 first:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark"><ContactIcon kind="location" /></span>
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/55">Visit us</span>
                  <span className="mt-1 block text-base leading-relaxed text-charcoal">{ADDRESS}</span>
                </span>
              </a>
              <a href={`tel:${PHONE_TEL}`} className="flex gap-4 py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark"><ContactIcon kind="phone" /></span>
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/55">Call us</span>
                  <span className="mt-1 block text-base text-charcoal">{PHONE_DISPLAY}</span>
                </span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex gap-4 py-5 last:pb-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark"><ContactIcon kind="email" /></span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/55">Email us</span>
                  <span className="mt-1 block break-all text-base text-charcoal">{EMAIL}</span>
                </span>
              </a>
            </div>
            <a href={waLink("Hello RS Builders, I'd like to discuss a home.")} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1fb95a]">
              <WhatsAppIcon className="h-5 w-5" /> Message us on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.1} className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-[#d8ceff] bg-[#e7e2ff] px-7 py-10 text-center shadow-[0_20px_60px_-40px_rgba(62,16,17,0.25)] sm:p-10">
            <div className="relative flex flex-col items-center">
              <h2 className="font-display text-xl font-bold text-[#29151d]">RS Builders</h2>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-[#805563]">{ADDRESS}</p>
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#bd2424] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a91e1e]">
                Open in Google Maps <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
