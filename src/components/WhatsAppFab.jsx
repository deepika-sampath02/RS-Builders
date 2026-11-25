import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { waLink } from '../data/content'
import { WhatsAppIcon } from './Reveal'

export default function WhatsAppFab() {
  const [show, setShow] = useState(false)
  const [tip, setTip] = useState(false)

  useEffect(() => {
    const on = () => setShow(window.scrollY > 300)
    on()
    window.addEventListener('scroll', on, { passive: true })
    const t = setTimeout(() => setTip(true), 6000)
    const t2 = setTimeout(() => setTip(false), 12000)
    return () => {
      window.removeEventListener('scroll', on)
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7">
          <AnimatePresence>
            {tip && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden rounded-full bg-ivory px-4 py-2 text-xs text-charcoal shadow-xl sm:block"
              >
                Planning your dream home? Chat with us.
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_40px_-8px_rgba(37,211,102,0.55)] transition hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/35" style={{ animationDuration: '3s' }} />
            <WhatsAppIcon className="relative h-7 w-7" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
