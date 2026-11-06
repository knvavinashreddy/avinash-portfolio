import { useId } from 'react'
import { journeyStops } from '../data'
import { buildRoute } from '../lib/route'
import { buildContours } from '../lib/contours'

export const WORLD = { w: 1800, h: 1300 }

// ── The route is a heart ──
// Classic heart curve, starting at the bottom tip, going up the left lobe,
// through the dip at the top and back down the right lobe to the tip.
const HEART = { cx: 900, cy: 600, k: 34, samples: 160 }
const heartPoints = []
for (let i = 0; i <= HEART.samples; i++) {
  const t = Math.PI + (2 * Math.PI * i) / HEART.samples
  heartPoints.push({
    x: HEART.cx + HEART.k * 16 * Math.sin(t) ** 3,
    y: HEART.cy - HEART.k * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  })
}
export const route = buildRoute(heartPoints, 12)

// Stops sit at equal distances along the heart, from 10% to 90% of the way
// round, so there are no big gaps. With nine stops the middle one lands
// exactly in the dip at the top.
const N = journeyStops.length
const fracs = journeyStops.map((_, i) => (N === 1 ? 0.5 : 0.1 + (0.8 * i) / (N - 1)))
export const stopLens = fracs.map((f) => f * route.total)
export const stopPos = stopLens.map((l) => {
  const p = route.at(l)
  return { x: Math.round(p.x), y: Math.round(p.y) }
})
// Labels go to the right of a pin, except at the dip, where both sides are taken
export const labelSide = fracs.map((f) => (Math.abs(f - 0.5) < 0.03 ? 'below' : 'right'))


// ── Background: a quiet topographic map ──
// The three places I've lived, with real coordinates. Each sits on a gentle
// hill in the terrain, so the contour lines ring around its name.
const PLACES = [
  { name: 'BHIMAVARAM', coords: '16.54°N 81.52°E', x: 540, y: 1040 },
  { name: 'TUMAKURU', coords: '13.34°N 77.10°E', x: 590, y: 470 },
  { name: 'HYDERABAD', coords: '17.39°N 78.49°E', x: 1210, y: 440 },
]
const CONTOURS = buildContours({
  w: WORLD.w,
  h: WORLD.h,
  hills: PLACES.map((p, i) => ({ x: p.x, y: p.y - 12, r: 150 + i * 20, h: 0.55 })),
})

// Left and right edges of the heart, so the colour runs across it
const HEART_LEFT = HEART.cx - HEART.k * 16
const HEART_RIGHT = HEART.cx + HEART.k * 16

export default function MapWorld({ traveledRef, showTraveled = false }) {
  const grad = `route-${useId().replace(/:/g, '')}`
  return (
    <g>
      <defs>
        {/* The heart's colour: Light Blue → Lime Cream → Mustard Oil, left to right */}
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1={HEART_LEFT} y1="0" x2={HEART_RIGHT} y2="0">
          <stop offset="0" className="route-a" />
          <stop offset="0.5" className="route-b" />
          <stop offset="1" className="route-c" />
        </linearGradient>
      </defs>
      <defs>
        <pattern id={`${grad}-dots`} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.6" className="m-dot" />
        </pattern>
        <radialGradient id={`${grad}-glow`} cx={HEART.cx} cy={HEART.cy + 40} r="560" gradientUnits="userSpaceOnUse">
          <stop offset="0" className="m-glow-a" />
          <stop offset="0.55" className="m-glow-b" />
          <stop offset="1" className="m-glow-c" />
        </radialGradient>
      </defs>

      <rect className="m-land" x="0" y="0" width={WORLD.w} height={WORLD.h} />
      <rect x="0" y="0" width={WORLD.w} height={WORLD.h} fill={`url(#${grad}-dots)`} />

      {/* Contour lines; every fifth one is a little stronger, like a real topo map */}
      <g className="m-contours">
        {CONTOURS.map((c, i) => (
          <path key={i} d={c.d} className={c.major ? 'major' : undefined} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* A soft light inside the heart */}
      <ellipse cx={HEART.cx} cy={HEART.cy + 40} rx="620" ry="560" fill={`url(#${grad}-glow)`} />

      {/* Places, written like a navigator's chart */}
      {PLACES.map((p) => (
        <text key={p.name} className="m-place" x={p.x} y={p.y} textAnchor="middle">
          {p.name}
          <tspan x={p.x} dy="34" className="m-coords">{p.coords}</tspan>
        </text>
      ))}

      {showTraveled && (
        <g className="m-compass" transform="translate(1500 1010)" aria-hidden="true">
          <circle r="46" />
          <circle r="4" />
          <path d="M0 -62 V-30 M0 30 V62 M-62 0 H-30 M30 0 H62" />
          <path className="needle" d="M0 -38 L7 0 L0 6 L-7 0Z" />
          <text y="-72" textAnchor="middle">N</text>
        </g>
      )}

      {/* The route: a soft line all the way round, and a bright one where the traveller has been */}
      <path className="m-route-ghost" d={route.d} stroke={`url(#${grad})`} />
      <path
        ref={traveledRef}
        className="m-route"
        d={route.d}
        stroke={`url(#${grad})`}
        style={showTraveled ? undefined : { strokeDasharray: `0 ${route.total}` }}
      />
    </g>
  )
}
