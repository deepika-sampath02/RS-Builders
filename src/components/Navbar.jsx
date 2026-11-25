import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { NAV } from '../data/content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  const lightHeader = scrolled || pathname === '/contact'
  const primaryNav = NAV.filter((item) => item.to !== '/our-projects' && item.to !== '/contact')
  const goToContact = (event) => {
    event.preventDefault()
    setOpen(false)
    if (pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollToContact: true } })
    }
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          lightHeader ? 'bg-ivory/95 py-3 text-charcoal shadow-[0_8px_24px_-20px_rgba(62,16,17,0.4)] backdrop-blur-xl' : 'bg-gradient-to-b from-charcoal-900/90 to-transparent py-5 text-ivory'
        }`}
      >
        <div className="container-x flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 text-champagne" aria-label="RS Builders home">
            <img src="/images/Terracotta R&S Architectural Monogram.png" alt="" aria-hidden="true" className="h-10 w-10 rounded-full object-cover ring-1 ring-champagne/40 transition-transform duration-700 group-hover:-translate-y-0.5" />
            <span className="font-serif text-2xl font-bold tracking-normal text-brand">RS Builders</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {primaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 font-sans text-sm font-medium tracking-normal transition-colors duration-300 ${
                    lightHeader
                      ? `hover:text-brand ${isActive ? 'text-brand' : 'text-charcoal/75'}`
                      : `hover:text-champagne ${isActive ? 'text-champagne' : 'text-ivory/80'}`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-1 h-px bg-champagne" />}
                  </>
                )}
              </NavLink>
            ))}
            <a href="/#contact" onClick={goToContact} className="rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-champagne-dark">
              Contact Us
            </a>
          </nav>

          <button
            className="relative z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`absolute h-px w-6 transition ${lightHeader ? 'bg-charcoal' : 'bg-ivory'} ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-px w-6 transition ${lightHeader ? 'bg-charcoal' : 'bg-ivory'} ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-champagne" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[55] flex flex-col justify-center bg-charcoal px-8 lg:hidden"
          >
            <p className="eyebrow mb-8">Your Dream. Our Foundation.</p>
            {primaryNav.map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.6 }}>
                <Link to={n.to} className="display block border-b border-ivory/10 py-4 text-4xl text-ivory hover:text-champagne">
                  {n.label}
                </Link>
              </motion.div>
            ))}
            <a href="/#contact" onClick={goToContact} className="mt-10 inline-flex justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-champagne-dark">
              Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
