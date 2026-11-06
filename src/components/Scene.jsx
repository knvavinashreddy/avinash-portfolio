import { useEffect, useRef, useState } from 'react'
import { places } from '../data'

// Deterministic "random" so stars don't jump around on re-render
function seeded(n) {
  let s = 7
  return Array.from({ length: n }, () => {
    s = (s * 9301 + 49297) % 233280
    const a = s / 233280
    s = (s * 9301 + 49297) % 233280
    const b = s / 233280
    s = (s * 9301 + 49297) % 233280
    return { x: a * 1440, y: b * 230, r: 0.6 + (s / 233280) * 1.6 }
  })
}
const STARS = seeded(70)

function Palm({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="palm">
      <path className="trunk" d="M0 0 C 4 -30, -2 -60, 8 -92" fill="none" strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(8 -92)" className="fronds">
        <path d="M0 0 C -14 -10, -30 -8, -42 4 C -28 -2, -14 0, 0 0Z" />
        <path d="M0 0 C 14 -12, 32 -10, 44 2 C 30 -4, 14 -2, 0 0Z" />
        <path d="M0 0 C -6 -18, -22 -26, -34 -24 C -20 -18, -10 -10, 0 0Z" />
        <path d="M0 0 C 8 -18, 24 -26, 36 -22 C 22 -16, 10 -8, 0 0Z" />
        <path d="M0 0 C -2 -16, 2 -30, 6 -36 C 4 -24, 2 -12, 0 0Z" />
      </g>
    </g>
  )
}

export default function Scene() {
  const [open, setOpen] = useState(null)
  const [motionOk, setMotionOk] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [])

  const active = places.find((p) => p.id === open)

  return (
    <div className="scene-scroll" ref={ref}>
      <div className="scene">
        <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" role="img"
          aria-label="Illustrated landscape: the Godavari delta town of Bhimavaram on the left with paddy fields and coconut palms, a railway line running east to the BITS campus and the Hyderabad skyline with the Charminar on the right">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0" className="sky-a" />
              <stop offset="1" className="sky-b" />
            </linearGradient>
          </defs>
          <rect width="1440" height="560" fill="url(#sky)" />

          <g className="stars">
            {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} />)}
          </g>

          <g className="sun">
            <circle cx="1150" cy="110" r="46" />
            <circle cx="1170" cy="96" r="40" className="moon-cut" fill="url(#sky)" />
          </g>

          <g className="clouds">
            <ellipse cx="260" cy="110" rx="70" ry="18" />
            <ellipse cx="300" cy="96" rx="44" ry="20" />
            <ellipse cx="760" cy="70" rx="80" ry="16" />
            <ellipse cx="800" cy="58" rx="40" ry="16" />
          </g>

          <path className="hill-far" d="M0 320 C 180 268, 330 296, 480 278 S 820 246, 980 286 S 1300 256, 1440 292 L1440 560 L0 560Z" />

          {/* Hyderabad skyline */}
          <g className="city">
            <rect x="1060" y="250" width="44" height="90" />
            <rect x="1110" y="214" width="36" height="126" />
            <rect x="1320" y="226" width="48" height="114" />
            <rect x="1374" y="262" width="40" height="78" />
            <rect x="1418" y="240" width="30" height="100" />
            {/* Charminar */}
            <rect x="1198" y="262" width="96" height="78" />
            <rect x="1188" y="176" width="12" height="164" />
            <rect x="1292" y="176" width="12" height="164" />
            <circle cx="1194" cy="174" r="9" />
            <circle cx="1298" cy="174" r="9" />
            <rect x="1196" y="248" width="100" height="10" />
          </g>
          <path className="arch" d="M1224 340 L1224 300 Q1246 270 1268 300 L1268 340Z" />
          <g className="windows">
            {[
              [1070, 266], [1086, 266], [1070, 290], [1086, 306], [1120, 230], [1132, 250], [1120, 280], [1132, 310],
              [1330, 244], [1350, 244], [1330, 276], [1350, 300], [1384, 280], [1398, 304], [1426, 258], [1426, 290],
            ].map(([x, y], i) => <rect key={i} x={x} y={y} width="7" height="9" rx="1" />)}
          </g>

          <path className="hill-near" d="M0 372 C 300 342, 600 362, 900 344 S 1300 336, 1440 352 L1440 560 L0 560Z" />

          {/* BITS campus */}
          <g className="campus">
            <rect x="900" y="270" width="150" height="80" />
            <rect x="955" y="226" width="40" height="124" />
            <polygon points="950,226 975,204 1000,226" />
            <circle cx="975" cy="250" r="9" className="clock" />
          </g>
          <g className="windows">
            {[[914, 288], [934, 288], [1014, 288], [1034, 288], [914, 316], [934, 316], [1014, 316], [1034, 316]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="9" height="11" rx="1" />
            ))}
          </g>

          {/* Bhimavaram houses, temple and the college */}
          <g className="houses">
            <rect x="120" y="356" width="40" height="30" />
            <rect x="170" y="362" width="34" height="24" />
            <rect x="214" y="350" width="44" height="36" />
          </g>
          <g className="roofs">
            <polygon points="114,358 140,336 166,358" />
            <polygon points="165,364 187,346 209,364" />
            <polygon points="208,352 236,330 264,352" />
          </g>
          <g className="temple">
            <polygon points="306,386 382,386 370,354 318,354" />
            <polygon points="320,354 368,354 360,330 328,330" />
            <polygon points="330,330 358,330 352,310 336,310" />
            <rect x="341" y="296" width="6" height="14" />
          </g>
          <g className="college-b">
            <rect x="470" y="330" width="96" height="56" />
            <polygon points="462,332 518,306 574,332" />
          </g>
          <g className="windows">
            {[[482, 346], [500, 346], [536, 346], [554, 346]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="8" height="10" rx="1" />
            ))}
          </g>

          {/* Railway: the route from home to Hyderabad */}
          <path id="track" className="track" d="M40 404 C 260 392, 470 404, 680 386 S 980 356, 1180 352 L1440 346" />
          <path className="track-ties" d="M40 404 C 260 392, 470 404, 680 386 S 980 356, 1180 352 L1440 346" />
          <g className="train">
            <rect x="-34" y="-11" width="30" height="14" rx="3" />
            <rect x="0" y="-11" width="34" height="14" rx="3" className="engine" />
            {motionOk && (
              <animateMotion dur="7s" begin="0.8s" fill="freeze" rotate="auto" keyPoints="0;0.66" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                <mpath href="#track" />
              </animateMotion>
            )}
          </g>

          {/* Delta: fields, canal and palms */}
          <path className="field-a" d="M0 430 L440 412 L470 560 L0 560Z" />
          <path className="field-b" d="M460 418 L860 400 L900 560 L470 560Z" />
          <path className="field-c" d="M860 400 L1440 380 L1440 560 L900 560Z" />
          <g className="rows">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M0 ${452 + i * 18} L460 ${434 + i * 18}`} />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M480 ${440 + i * 20} L870 ${422 + i * 20}`} />
            ))}
          </g>
          <path className="canal" d="M0 500 C 220 470, 400 530, 640 500 S 980 450, 1200 480 S 1380 510, 1440 498" />

          <Palm x={70} y={430} s={1.1} />
          <Palm x={290} y={420} s={0.9} />
          <Palm x={420} y={436} s={1.2} />
          <Palm x={620} y={424} s={0.85} />
          <Palm x={820} y={410} s={1} />
          <Palm x={1100} y={400} s={0.8} />
        </svg>

        {places.map((p) => (
          <button
            key={p.id}
            className={`pin ${open === p.id ? 'is-open' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => setOpen(open === p.id ? null : p.id)}
            aria-expanded={open === p.id}
          >
            <span className="pin-dot" aria-hidden="true" />
            <span className="pin-label">{p.label}</span>
          </button>
        ))}

        {active && (
          <div
            className={`pop ${active.x > 60 ? 'pop-left' : ''}`}
            style={{ left: `${active.x}%`, top: `${active.y}%` }}
            role="dialog"
            aria-label={active.title}
          >
            <button className="pop-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            <strong>{active.title}</strong>
            <p>{active.text}</p>
          </div>
        )}

        <p className="hand scene-hint">tap a place</p>
      </div>
    </div>
  )
}
