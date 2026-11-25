import { useId, useState } from 'react'

/**
 * Scene — illustrated architectural scenes used until real photography is dropped in.
 *
 *   <Scene kind="villa" variant="home2|home3|villa" tone="dusk|gold" />
 *   <Scene kind="interior" />
 *
 * Pass `photo="/images/your-photo.jpg"` to overlay a real photograph; if the file
 * is missing the illustration stays visible, so nothing ever looks broken.
 */

const VARIANTS = {
  home2: {
    volumes: [
      { x: 230, y: 288, w: 360, h: 112, k: 'stone' },
      { x: 300, y: 172, w: 345, h: 116, k: 'dark' },
    ],
    windows: [
      { x: 252, y: 306, w: 200, h: 90 },
      { x: 474, y: 306, w: 94, h: 94, door: true },
      { x: 326, y: 192, w: 205, h: 86 },
      { x: 550, y: 192, w: 72, h: 86 },
    ],
    rails: [{ x: 322, y: 262, w: 215 }],
    trees: [{ x: 110, s: 1.1 }, { x: 700, s: 1.25 }, { x: 770, s: 0.9 }],
    pool: false,
  },
  home3: {
    volumes: [
      { x: 140, y: 292, w: 430, h: 108, k: 'stone' },
      { x: 210, y: 176, w: 330, h: 116, k: 'dark' },
      { x: 570, y: 232, w: 150, h: 168, k: 'wood' },
    ],
    windows: [
      { x: 162, y: 310, w: 250, h: 86 },
      { x: 436, y: 310, w: 112, h: 90, door: true },
      { x: 232, y: 196, w: 150, h: 84 },
      { x: 394, y: 196, w: 124, h: 84 },
      { x: 596, y: 262, w: 98, h: 120 },
    ],
    rails: [{ x: 230, y: 266, w: 290 }],
    trees: [{ x: 70, s: 1.2 }, { x: 760, s: 1.2 }, { x: 36, s: 0.8 }],
    pool: false,
  },
  villa: {
    volumes: [
      { x: 90, y: 280, w: 410, h: 120, k: 'stone' },
      { x: 170, y: 160, w: 340, h: 120, k: 'dark' },
      { x: 500, y: 226, w: 220, h: 174, k: 'wood' },
    ],
    windows: [
      { x: 112, y: 298, w: 270, h: 98 },
      { x: 400, y: 298, w: 80, h: 100, door: true },
      { x: 192, y: 180, w: 150, h: 92 },
      { x: 354, y: 180, w: 136, h: 92 },
      { x: 524, y: 252, w: 172, h: 130 },
    ],
    rails: [{ x: 190, y: 256, w: 305 }],
    trees: [{ x: 36, s: 1.1, palm: true }, { x: 764, s: 1.2, palm: true }, { x: 745, s: 0.8 }],
    pool: true,
  },
}

const SKY = {
  dusk: ['#1d2038', '#46385a', '#a45a54', '#e39a63'],
  gold: ['#2a2540', '#7a4f5e', '#d98a58', '#f4c47e'],
}

function Tree({ x, s = 1, palm, id }) {
  const base = 402
  if (palm) {
    return (
      <g transform={`translate(${x} ${base}) scale(${s})`}>
        <path d="M-3 0 Q 4 -90 -2 -170" stroke="#2b2418" strokeWidth="7" fill="none" strokeLinecap="round" />
        {[-70, -40, -12, 14, 44, 72].map((a, i) => (
          <path
            key={i}
            d={`M-2 -170 Q ${a * 0.9} ${-205 + Math.abs(a) * 0.35} ${a * 1.5} ${-150 + Math.abs(a) * 0.5}`}
            stroke={i % 2 ? '#274030' : '#1c3024'}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <ellipse cx="0" cy="-6" rx="40" ry="10" fill={`url(#${id}-uplight)`} opacity="0.5" />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <rect x="-4" y="-80" width="8" height="80" fill="#2b2418" />
      <circle cx="0" cy="-130" r="52" fill="#16281e" />
      <circle cx="-34" cy="-104" r="36" fill="#1b3024" />
      <circle cx="34" cy="-106" r="38" fill="#1b3024" />
      <circle cx="0" cy="-100" r="40" fill={`url(#${id}-uplight)`} />
      <circle cx="-10" cy="-150" r="26" fill="#223a2b" opacity="0.8" />
    </g>
  )
}

function Villa({ variant = 'home2', tone = 'dusk' }) {
  const id = useId().replace(/:/g, '')
  const v = VARIANTS[variant] || VARIANTS.home2
  const sky = SKY[tone] || SKY.dusk
  const fills = {
    stone: `url(#${id}-stone)`,
    dark: `url(#${id}-dark)`,
    wood: `url(#${id}-wood)`,
  }

  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Architectural illustration of a modern home at dusk">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.45" stopColor={sky[1]} />
          <stop offset="0.78" stopColor={sky[2]} />
          <stop offset="1" stopColor={sky[3]} />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f1b15" />
          <stop offset="1" stopColor="#0d0c09" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8ccb4" />
          <stop offset="1" stopColor="#a99b80" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a342b" />
          <stop offset="1" stopColor="#201c16" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b4a2d" />
          <stop offset="1" stopColor="#8a6238" />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9908f" />
          <stop offset="0.35" stopColor="#ffc873" />
          <stop offset="1" stopColor="#f09a3e" />
        </linearGradient>
        <radialGradient id={`${id}-uplight`} cx="0.5" cy="1" r="0.9">
          <stop offset="0" stopColor="#e8b765" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#4f6b3f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1b3024" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-pool`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3aa9b8" />
          <stop offset="1" stopColor="#0f5b6a" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* sky */}
      <rect width="800" height="520" fill={`url(#${id}-sky)`} />
      {tone === 'dusk' &&
        [[60, 40], [150, 90], [260, 30], [420, 60], [560, 28], [690, 80], [760, 36], [330, 110], [610, 120]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.6} fill="#f6e9cf" opacity={0.7} />
        ))}
      <ellipse cx="400" cy="400" rx="520" ry="90" fill="#f0a35a" opacity="0.28" filter={`url(#${id}-blur)`} />

      {/* distant tree line */}
      <path
        d="M0 372 Q 60 336 130 366 T 270 356 T 420 368 T 560 350 T 700 366 T 800 350 V 410 H 0 Z"
        fill="#16231b"
      />

      {/* ground */}
      <rect y="398" width="800" height="122" fill={`url(#${id}-ground)`} />

      {/* back trees */}
      {v.trees.map((t, i) => (
        <Tree key={i} {...t} id={id} />
      ))}

      {/* warm glow on the ground from the windows */}
      <ellipse cx="400" cy="425" rx="300" ry="26" fill="#f0a24a" opacity="0.28" filter={`url(#${id}-blur)`} />

      {/* volumes */}
      {v.volumes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={fills[b.k]} />
          {b.k === 'wood' &&
            Array.from({ length: Math.floor(b.w / 14) }).map((_, j) => (
              <rect key={j} x={b.x + 4 + j * 14} y={b.y} width="2.5" height={b.h} fill="#00000040" />
            ))}
          {/* roof slab */}
          <rect x={b.x - 14} y={b.y - 9} width={b.w + 28} height="9" fill="#efe5d0" />
          <rect x={b.x - 14} y={b.y} width={b.w + 28} height="3" fill="#00000050" />
        </g>
      ))}

      {/* windows */}
      {v.windows.map((w, i) => (
        <g key={i}>
          <rect x={w.x - 3} y={w.y - 3} width={w.w + 6} height={w.h + 6} fill="#120f0b" />
          <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={`url(#${id}-glow)`} className="animate-glow" style={{ animationDelay: `${i * 0.6}s` }} />
          {/* interior silhouettes */}
          <rect x={w.x + w.w * 0.12} y={w.y + w.h * 0.62} width={w.w * 0.34} height={w.h * 0.22} rx="3" fill="#7a4a1f" opacity="0.55" />
          <circle cx={w.x + w.w * 0.72} cy={w.y + w.h * 0.28} r={Math.min(w.w, w.h) * 0.07} fill="#fff1c9" opacity="0.9" />
          {Array.from({ length: Math.max(1, Math.round(w.w / 70)) }).map((_, j, arr) => (
            <rect key={j} x={w.x + ((j + 1) * w.w) / (arr.length + 1) - 1} y={w.y} width="2" height={w.h} fill="#120f0b" />
          ))}
          {w.door && <rect x={w.x + w.w * 0.4} y={w.y + w.h * 0.45} width="3" height="14" fill="#c9a66b" />}
          {/* reflection on the ground */}
          <rect x={w.x} y={Math.max(w.y + w.h, 400) + 4} width={w.w} height="14" fill="#ffbf66" opacity="0.14" filter={`url(#${id}-soft)`} />
        </g>
      ))}

      {/* glass balcony rails */}
      {v.rails.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height="16" fill="#ffe0a3" opacity="0.18" />
          <rect x={r.x} y={r.y} width={r.w} height="2" fill="#efe5d0" />
          {Array.from({ length: Math.floor(r.w / 26) }).map((_, j) => (
            <rect key={j} x={r.x + 6 + j * 26} y={r.y} width="1.5" height="16" fill="#efe5d0" opacity="0.6" />
          ))}
        </g>
      ))}

      {/* steps + path */}
      <path d="M440 400 L520 400 L560 520 L380 520 Z" fill="#6a5d49" opacity="0.55" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={448 - i * 6} y={400 + i * 9} width={72 + i * 12} height="3" fill="#e8dcc0" opacity="0.5" />
      ))}

      {/* path lights */}
      {[[420, 440], [575, 450], [400, 480], [598, 492]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="#ffc062" opacity="0.28" filter={`url(#${id}-soft)`} />
          <circle cx={x} cy={y} r="2.6" fill="#ffe7b0" />
        </g>
      ))}

      {/* pool */}
      {v.pool && (
        <g>
          <path d="M60 470 L740 470 L770 520 L30 520 Z" fill={`url(#${id}-pool)`} />
          <rect x="60" y="470" width="680" height="4" fill="#d9f4f6" opacity="0.5" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={120 + i * 130} y="470" width="60" height="50" fill="#ffd28a" opacity="0.14" />
          ))}
          <rect x="240" y="482" width="320" height="2" fill="#ffe7b0" opacity="0.5" />
          <rect x="290" y="498" width="220" height="2" fill="#ffe7b0" opacity="0.35" />
        </g>
      )}

      {/* foreground shrubs */}
      {[[30, 470, 46], [180, 506, 36], [690, 500, 52], [770, 462, 40]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#0f1c14" />
      ))}
      <rect width="800" height="520" fill="#0b0a07" opacity="0.1" />
    </svg>
  )
}

function Interior() {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Warm modern living room illustration">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cdbd9f" />
          <stop offset="1" stopColor="#e9dec6" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b79b72" />
          <stop offset="1" stopColor="#8a7050" />
        </linearGradient>
        <linearGradient id={`${id}-win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#bfd9a8" />
        </linearGradient>
        <linearGradient id={`${id}-sofa`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8a08e" />
          <stop offset="1" stopColor="#837c6b" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe3a6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe3a6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="520" fill={`url(#${id}-wall)`} />
      <rect y="360" width="800" height="160" fill={`url(#${id}-floor)`} />
      {/* ceiling cove light */}
      <rect y="0" width="800" height="34" fill="#f7ecd2" />
      <rect y="34" width="800" height="5" fill="#ffd98f" opacity="0.8" />
      {/* tv wall */}
      <rect x="70" y="90" width="330" height="270" fill="#6f5740" />
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={74 + i * 15} y="90" width="4" height="270" fill="#00000030" />
      ))}
      <rect x="130" y="150" width="210" height="116" rx="4" fill="#15130f" />
      <rect x="134" y="154" width="202" height="108" rx="2" fill="#262a2c" />
      <rect x="100" y="320" width="270" height="34" fill="#3a2c1e" />
      {/* window */}
      <rect x="520" y="72" width="230" height="288" fill="#2a2418" />
      <rect x="530" y="82" width="210" height="268" fill={`url(#${id}-win)`} />
      <rect x="633" y="82" width="4" height="268" fill="#2a2418" />
      {[[560, 270, 30], [690, 290, 38], [610, 300, 26]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#6b8f58" opacity="0.7" />
      ))}
      <path d="M520 72 L470 72 L470 360 L520 360 Z" fill="#ecdfc4" opacity="0.7" />
      {/* rug */}
      <ellipse cx="390" cy="450" rx="270" ry="46" fill="#d8c9a8" />
      <ellipse cx="390" cy="450" rx="230" ry="36" fill="none" stroke="#b39a6a" strokeWidth="2" />
      {/* sofa */}
      <rect x="170" y="318" width="340" height="86" rx="18" fill={`url(#${id}-sofa)`} />
      <rect x="150" y="332" width="48" height="76" rx="14" fill="#8f8775" />
      <rect x="484" y="332" width="48" height="76" rx="14" fill="#8f8775" />
      <rect x="200" y="300" width="130" height="44" rx="12" fill="#b7af9c" />
      <rect x="340" y="300" width="130" height="44" rx="12" fill="#b7af9c" />
      <rect x="236" y="326" width="40" height="34" rx="8" fill="#c9a66b" />
      {/* coffee table */}
      <ellipse cx="350" cy="446" rx="92" ry="20" fill="#2b2216" />
      <ellipse cx="350" cy="438" rx="92" ry="20" fill="#e4d6b8" />
      {/* lamp */}
      <circle cx="600" cy="300" r="90" fill={`url(#${id}-lamp)`} />
      <rect x="598" y="296" width="4" height="110" fill="#3a2c1e" />
      <path d="M580 296 L620 296 L612 262 L588 262 Z" fill="#f6e3b4" />
      {/* plant */}
      <rect x="682" y="388" width="44" height="58" rx="6" fill="#d8ccb4" />
      {[-30, -12, 8, 28].map((a, i) => (
        <ellipse key={i} cx={704 + a} cy={350 - Math.abs(a) * 0.6} rx="12" ry="46" fill="#2f5a3c" transform={`rotate(${a} ${704 + a} 388)`} />
      ))}
      <rect width="800" height="520" fill="#1a1208" opacity="0.06" />
    </svg>
  )
}

export default function Scene({ kind = 'villa', variant = 'home2', tone = 'dusk', photo, video, poster, className = '' }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {kind === 'interior' ? <Interior /> : <Villa variant={variant} tone={tone} />}
      {video ? (
        <video
          src={video}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          onClick={(event) => event.stopPropagation()}
          className="absolute inset-0 h-full w-full bg-charcoal object-cover"
        />
      ) : photo && !broken ? (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  )
}
