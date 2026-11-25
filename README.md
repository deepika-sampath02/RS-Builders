# RS Builders — Building Homes. Creating Futures.

Editorial, luxury-architecture website. React 18 + Vite + Tailwind CSS + Framer Motion + React Router.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run build:single # one self-contained file → dist-single/index.html
```

## Pages
| Route | Page |
|---|---|
| `/` | Home — Panruti hero, achievements, 3 design cards, featured designs, RS Advantage, CTA, Managing Director |
| `/2bhk-homes` | 2BHK Homes · ₹30–50 Lakhs — listing page (sort, filters, image carousels) |
| `/3bhk-homes` | 3BHK Homes · ₹50–70 Lakhs |
| `/duplex-villas` | Duplex Villas · ₹70 Lakhs–₹1 Crore |
| `/2bhk-homes/aria` etc. | Design detail page — gallery, stats, highlights, overview, EMI calculator, WhatsApp contact card |
| `/our-projects` | Our Projects & About — filterable gallery + lightbox, story, process, trust |

## Before launch — edit `src/data/content.js`
1. WhatsApp number, phone, email and address are set to RS Builders' details at the top of the file.
2. **Design listings** (names, sq.ft, prices, timelines, highlights) and **`PROJECTS`** are illustrative placeholders — replace with real designs and completed work.
3. Add the Managing Director's photo as `public/images/md.jpg`.

## Adding real photography
The site ships with illustrated architectural scenes so it looks complete out of the box.
Drop real photos into `public/images/` and they automatically overlay the illustrations
(if a file is missing, the illustration stays — nothing breaks):

| File | Used for |
|---|---|
| `hero.jpg` | Home hero |
| `2bhk-homes.jpg`, `3bhk-homes.jpg`, `private-villas.jpg` | Category cards + page heroes |
| `2bhk-homes-1.jpg` … `-3.jpg` (same for the other two) | Design showcase |
| `2bhk-homes-interior.jpg` etc. | Interior image on each page |
| `interior.jpg` | "RS Advantage" section |
| `md.jpg` | Managing Director portrait |
| `2bhk-homes-aria.jpg`, `2bhk-homes-aria-2.jpg`, `-3.jpg` | Per-design photos (pattern: `<category>-<design-id>[-2/-3].jpg`) |
| `our-projects.jpg` | Projects hero |

For projects, add `photo: '/images/aurum.jpg'` to an entry in `PROJECTS`.

## Brand
Deep navy `#101E33` · Warm off-white `#FAF7F2` · Champagne gold `#C8A25A` — Cormorant Garamond + Jost. Colours are CSS variables in `src/index.css`; add class `on-light` to a section to flip it to a light surface.

## Backend (optional, later)
Enquiries go straight to WhatsApp (`wa.me`) — no backend needed. If RS Builders later wants to manage
projects, prices and enquiries from an admin panel, add Django REST Framework and swap `content.js`
for API calls.
