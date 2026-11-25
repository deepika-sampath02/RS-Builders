import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import Counter from '../components/Counter'
import { WhatsAppBand } from '../components/Footer'
import { Arrow, Reveal } from '../components/Reveal'
import { PROCESS, PROJECTS, STATS } from '../data/content'

export default function Projects() {
  return (
    <>
      <PageHero variant="villa" tone="gold" photo="/images/hero%20section.png" lines={['Our', 'Projects']} line="Every Home Has a Story." sub="Completed homes, honest craftsmanship and families who trusted us with their dream.">
        <a href="#gallery" className="btn-gold">
          View the gallery <Arrow />
        </a>
      </PageHero>

      <section id="gallery" className="scroll-mt-16 bg-charcoal py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">A legacy of excellence</p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">
              Explore our completed projects and experience the <span className="italic text-champagne-light">quality we deliver</span>
            </h2>
          </Reveal>
          <Gallery projects={PROJECTS} />
        </div>
      </section>

      {/* Story */}
      <section className="bg-ivory py-24 text-charcoal sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="eyebrow !text-champagne-dark">About RS Builders</p>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              We don’t just build houses. <span className="italic text-champagne-dark">We build where your life’s most beautiful moments begin.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-lg leading-relaxed text-charcoal/70">
              RS Builders builds thoughtfully planned homes in Panruti and the surrounding areas. A home is the most personal thing a family will ever build, so we treat every project with care, clear communication and attention to detail.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
              From a comfortable 2BHK to a spacious 3BHK or a duplex villa, the standard stays the same: quality construction, thoughtful planning and transparent conversations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-charcoal-900 py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow">Our process</p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">From first sketch to first sunrise</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/10 md:grid-cols-5">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08} className="group bg-charcoal-900 p-7 transition hover:bg-charcoal-700">
                <p className="font-display text-5xl italic text-champagne/60 transition group-hover:text-champagne">{p.n}</p>
                <h3 className="mt-6 font-display text-2xl text-ivory">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/55">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-champagne/15 bg-charcoal py-12">
        <div className="container-x grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="display text-6xl text-champagne-light sm:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="eyebrow mt-3 !text-ivory/55">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <WhatsAppBand title="Your story could be next" text="Tell us about the home you’ve always imagined." message="Hello RS Builders, I saw your projects and I'd like to build my own home." />
    </>
  )
}
