/** @type {import('tailwindcss').Config} */
// Colors are CSS variables (see src/index.css) so the site theme stays consistent
// across dark sections, cream surfaces, and section-level light variants.
const c = (v) => `rgb(var(${v}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: { DEFAULT: c('--charcoal'), 900: c('--charcoal-900'), 800: c('--charcoal-800'), 700: c('--charcoal-700'), 600: c('--charcoal-600') },
        ivory: { DEFAULT: c('--ivory'), 50: c('--ivory-50'), 200: c('--ivory-200'), 300: c('--ivory-300') },
        champagne: { DEFAULT: c('--champagne'), light: c('--champagne-light'), dark: c('--champagne-dark') },
        brand: c('--brand'),
        ink: c('--ink'),
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost Variable"', 'Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.32em' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        glow: { '0%,100%': { opacity: '0.85' }, '50%': { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        glow: 'glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
