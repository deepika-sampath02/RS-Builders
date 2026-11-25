import { motion } from 'framer-motion'

/** Fade-and-rise on scroll. */
export function Reveal({ children, delay = 0, y = 36, className = '', as = 'div', once = true }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

/** Headline that reveals line by line (masked rise). */
export function Lines({ lines, className = '', delay = 0, italicLast = false, lastLineClassName = '' }) {
  return (
    <span className={`block overflow-visible ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className={`block ${i === lines.length - 1 ? 'overflow-visible pb-[0.25em]' : 'overflow-hidden pb-[0.08em]'}`}>
          <motion.span
            className={`block ${i === lines.length - 1 ? lastLineClassName : ''} ${italicLast && i === lines.length - 1 ? 'italic text-champagne-light' : ''}`}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: delay + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Arrow({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}

export function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M8 34 32 12l24 22" />
      <path d="M16 31v21h32V31" />
      <path d="M26 52V38h12v14" />
      <path d="M22 24 32 15l10 9" opacity="0.6" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 3C8.84 3 3 8.8 3 15.96c0 2.28.6 4.5 1.74 6.46L3 29l6.76-1.7a13.1 13.1 0 0 0 6.28 1.6C23.2 28.9 29 23.1 29 15.96 29 8.8 23.2 3 16.04 3Zm0 23.7c-1.96 0-3.88-.52-5.56-1.5l-.4-.24-4.02 1 1.06-3.9-.26-.4a10.6 10.6 0 0 1-1.64-5.7c0-5.86 4.8-10.62 10.7-10.62 5.9 0 10.7 4.76 10.7 10.62 0 5.84-4.8 10.74-10.58 10.74Zm5.86-7.96c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.5-.16-.72.16-.22.32-.84 1.04-1.02 1.26-.2.2-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.6a9.7 9.7 0 0 1-1.78-2.2c-.18-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.2.22-.32.32-.54.1-.22.06-.4-.02-.56-.08-.16-.72-1.74-1-2.38-.26-.62-.52-.54-.72-.54h-.6c-.22 0-.56.08-.86.4-.3.32-1.12 1.1-1.12 2.68s1.14 3.1 1.3 3.32c.16.2 2.24 3.4 5.4 4.76.76.32 1.34.52 1.8.66.76.24 1.44.2 2 .12.6-.1 1.9-.78 2.16-1.52.26-.76.26-1.4.18-1.52-.08-.14-.3-.22-.62-.38Z" />
    </svg>
  )
}
