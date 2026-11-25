import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

/** Counts up from 0 once the number is comfortably on screen. Even pace, ~3s. */
export default function Counter({ value, suffix = '', duration = 3 }) {
  const ref = useRef(null)
  // start only when the number is fully visible and a little above the bottom edge
  const inView = useInView(ref, { once: true, amount: 'all', margin: '0px 0px -12% 0px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, {
      duration,
      ease: [0.33, 0.0, 0.2, 1], // gentle ease-out: visibly counts through the middle numbers
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => c.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {n}
      {suffix}
    </span>
  )
}