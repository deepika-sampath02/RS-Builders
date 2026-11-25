import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollHero from '../components/ScrollHero'
import PropertyCard from '../components/PropertyCard'
import Scene from '../components/Scene'
import ContactSection from '../components/ContactSection'
import { Arrow, Reveal, WhatsAppIcon } from '../components/Reveal'
import { ACHIEVEMENTS, ADVANTAGES, CATEGORIES, PROCESS, waLink } from '../data/content'

function MdPortrait() {
  const [broken, setBroken] = useState(false)
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-[10rem] rounded-b-2xl border border-champagne/30 bg-gradient-to-b from-charcoal-700 to-charcoal-900">
      {!broken ? (
        <img src="/images/md.jpeg" alt="R. Sambathkumar, Managing Director" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-champagne">
          <span className="font-display text-8xl italic">RS</span>
          <span className="mt-2 text-[10px] uppercase tracking-luxe text-ivory/40">Managing Director</span>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [activeCta, setActiveCta] = useState(null)
  const ctaBase = 'px-6 py-3 text-xs font-bold tracking-[0.12em] text-white transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-light sm:px-7 sm:py-3.5 sm:text-[13px]'
  const ctaFilled = 'btn-gold text-white hover:brightness-110 active:brightness-90'
  const ctaOutline = 'btn-ghost border-white/60 text-white hover:border-[#ff6a1a] hover:bg-[#ff6a1a]/15 hover:text-white active:border-[#ff6a1a] active:bg-[#ff6a1a]/25'

  return (
    <>
      <ScrollHero
      lines={['Building Homes.', 'Creating Futures.']}
      lastLineClassName="w-fit text-[0.96em] font-display font-medium italic leading-[1.25] text-white"
      sub="Thoughtfully planned homes in and around Panruti, crafted with care, quality and attention to every detail."
      storyStages={PROCESS}
      >
        <div className="w-full">
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
              className={`${ctaBase} ${activeCta === 'talk' ? ctaOutline : ctaFilled}`}
            >
              Explore Our Homes <Arrow />
            </a>
            <a
              href={waLink("Hello RS Builders, I'd love to know more about your homes.")}
              target="_blank"
              rel="noreferrer"
              onPointerEnter={() => setActiveCta('talk')}
              onFocus={() => setActiveCta('talk')}
              className={`${ctaBase} ${activeCta === 'talk' ? ctaFilled : ctaOutline}`}
            >
              <WhatsAppIcon className="h-4 w-4" /> Talk to Our Team
            </a>
          </div>
          <div className="mt-5 grid w-full max-w-[500px] grid-cols-3 divide-x divide-white/35">
            {ACHIEVEMENTS.map((stat) => (
              <div key={stat.label} className="px-3 first:pl-0 last:pr-0">
                <p className="font-display text-[32px] font-semibold leading-none text-champagne-light sm:text-[36px]">{stat.value}{stat.suffix}</p>
                <p className="mt-1 text-sm font-semibold leading-tight text-ivory sm:text-base">{stat.label}</p>
                <p className="mt-1 text-[11px] leading-tight text-ivory/70 sm:text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollHero>

      {/* Designs */}
      <section id="designs" className="on-light scroll-mt-16 bg-charcoal py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Designed for different ways of living</p>
            <h2 className="display mt-5 text-4xl text-ivory sm:text-6xl">
              Explore the <span className="italic text-champagne-dark">possibilities.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory/65">
              Discover home designs that bring together comfort, thoughtful layouts and everyday functionality. Find a space that suits your family and future.
            </p>
            <div className="hairline mx-auto mt-8 w-40" />
          </Reveal>

          <div className="rail mt-14">
            {CATEGORIES.map((c, i) => (
              <PropertyCard key={c.key} cat={c} index={i} />
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-ivory/35 md:hidden">Swipe to explore →</p>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-ivory/40">
            Illustrative design concepts only. Actual layouts, specifications and availability may vary; please confirm with RS Builders.
          </p>
        </div>
      </section>

      {/* RS Advantage */}
      <section className="bg-ivory text-charcoal">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px] lg:min-h-[640px]">
            <Scene kind="interior" photo="/images/aak-villa-moriq-img~bfb142f40881bf44_14-5915-1-0322bf0.jpg" className="absolute inset-0" />
          </div>
          <div className="px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
            <Reveal>
              <p className="eyebrow !text-champagne-dark">The RS Advantage</p>
              <h2 className="display mt-5 text-4xl sm:text-6xl">
                Four reasons to <span className="italic text-champagne-dark">build with confidence.</span>
              </h2>
              <p className="mt-4 text-[11px] uppercase tracking-luxe text-charcoal/50">Quality · Planning · Transparency</p>
            </Reveal>
            <div className="mt-10 space-y-7">
              {ADVANTAGES.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.08} className="flex gap-5 border-t border-charcoal/15 pt-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal font-sans text-sm font-medium text-ivory">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-medium">{a.title}</h3>
                    <p className="mt-1 text-charcoal/65">{a.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="grain relative isolate mt-16 overflow-hidden py-28 sm:mt-24 sm:py-40">
        <div className="absolute inset-0 -z-10">
          <Scene kind="villa" variant="villa" tone="gold" photo="/images/101908_87474.jpg" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-900/75 via-charcoal-800/45 to-brand/20" />
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Your dream home starts here</p>
            <h2 className="display mx-auto mt-6 max-w-3xl text-5xl text-ivory sm:text-7xl">
              A place to call yours.
              <br />
              <span className="italic text-champagne-light">A future to look forward to.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ivory/70">
              From a comfortable 2BHK to a spacious 3BHK or duplex villa, RS Builders can help you explore a home in Panruti and surrounding areas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.22em] text-ivory/60">
              {CATEGORIES.map((c) => (
                <Link key={c.key} to={c.to} className="transition hover:text-champagne">{c.short}</Link>
              ))}
            </div>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn-gold mt-10">
              <WhatsAppIcon className="h-4 w-4" /> Start building your dream home
            </a>
          </Reveal>
        </div>
      </section>

      {/* Managing Director */}
      <section className="on-light bg-charcoal-900 py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <MdPortrait />
          </Reveal>
          <Reveal delay={0.12}>
            <p className="eyebrow">Meet our Managing Director</p>
            <h2 className="display mt-4 text-5xl text-ivory sm:text-6xl">R. Sambathkumar</h2>
            <p className="mt-2 text-[11px] uppercase tracking-luxe text-champagne/80">RS Builders · Panruti</p>
            <p className="mt-8 border-l-4 border-champagne pl-5 font-display text-3xl italic leading-snug text-ink sm:text-4xl" style={{ color: "rgb(var(--ink))" }}>
              A personal commitment: building homes with purpose.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/70">
              As Managing Director, R. Sambathkumar is committed to understanding what home means to each family. He guides RS Builders’ work to create thoughtfully planned 2BHK homes, 3BHK homes and duplex villas for people in Panruti and surrounding areas.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory/70">
              From the first conversation through the building process, his focus is on clear communication, careful planning and helping families move confidently toward a place of their own.
            </p>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
