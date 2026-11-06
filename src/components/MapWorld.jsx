import { journeyStops } from '../data'
import { buildRoute } from '../lib/route'

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

// Solid line up to the last stop that has happened; upcoming stops stay dotted
const lastDone = journeyStops.reduce((acc, s, i) => (s.upcoming ? acc : i), 0)
export const doneLen = stopLens[lastDone]

// ── deterministic pseudo-random so the map never reshuffles ──
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function cityBlocks(cx, cy, w, h, seed) {
  const r = rng(seed)
  const cell = 52
  const out = []
  for (let x = cx - w / 2; x < cx + w / 2; x += cell) {
    for (let y = cy - h / 2; y < cy + h / 2; y += cell) {
      const dx = (x - cx) / (w / 2)
      const dy = (y - cy) / (h / 2)
      if (dx * dx + dy * dy > 1 - r() * 0.25) continue // round-ish city edge
      if (r() < 0.14) continue // empty lots
      if (r() < 0.35) {
        out.push([x + 4, y + 4, 19, 38], [x + 27, y + 4, 19, 38])
      } else {
        out.push([x + 4, y + 4, 42 - r() * 10, 42 - r() * 12])
      }
    }
  }
  return out
}

const CITY = { cx: 900, cy: 660, w: 2000, h: 1500, seed: 11 }
const BLOCKS = cityBlocks(CITY.cx, CITY.cy, CITY.w, CITY.h, CITY.seed)

function grid() {
  const lines = []
  for (let x = 4; x <= WORLD.w; x += 208) lines.push(`M${x} 0 V${WORLD.h}`)
  for (let y = 4; y <= WORLD.h; y += 208) lines.push(`M0 ${y} H${WORLD.w}`)
  return lines.join(' ')
}
const GRID = grid()

// Faint area names, so it still reads as my map
const AREAS = [
  { name: 'BHIMAVARAM', x: 540, y: 1040 },
  { name: 'TUMAKURU', x: 590, y: 470 },
  { name: 'HYDERABAD', x: 1200, y: 440 },
]

export default function MapWorld({ traveledRef, showTraveled = false }) {
  return (
    <g>
      <rect className="m-land" x="0" y="0" width={WORLD.w} height={WORLD.h} />

      {/* Lakes and parks */}
      <ellipse className="m-water" cx="560" cy="740" rx="80" ry="46" />
      <text className="m-small" x="560" y="808" textAnchor="middle">Amanikere</text>
      <ellipse className="m-water" cx="1280" cy="560" rx="74" ry="48" />
      <text className="m-small" x="1280" y="628" textAnchor="middle">Hussain Sagar</text>
      <ellipse className="m-park" cx="1180" cy="760" rx="110" ry="64" />
      <ellipse className="m-park" cx="430" cy="980" rx="100" ry="56" />
      <ellipse className="m-park" cx="1440" cy="1000" rx="90" ry="50" />
      <ellipse className="m-park" cx="760" cy="1120" rx="120" ry="60" />

      {/* Streets and blocks */}
      <path className="m-road" d={GRID} />
      <g className="m-block">
        {BLOCKS.map(([x, y, w, h], k) => (
          <rect key={k} x={x} y={y} width={w} height={h} rx="3" />
        ))}
      </g>

      {/* River down the middle and one highway across */}
      <path className="m-river" d="M930 -20 C 900 260, 960 480, 910 700 S 880 1080, 900 1320" />
      <text className="m-small" x="948" y="660" transform="rotate(-84 948 660)">Godavari</text>
      <path className="m-highway" d="M-20 860 C 400 840, 700 880, 1000 866 S 1500 840, 1820 856" />
      <g className="m-shield">
        <rect x="1528" y="832" width="64" height="26" rx="5" />
        <text x="1560" y="850" textAnchor="middle">NH65</text>
      </g>

      {AREAS.map((a) => (
        <text key={a.name} className="m-city" x={a.x} y={a.y} textAnchor="middle">{a.name}</text>
      ))}

      {/* The route: dotted all the way round, solid where I've been */}
      <path className="m-route-ghost" d={route.d} />
      <path
        ref={traveledRef}
        className="m-route"
        d={route.d}
        style={{
          strokeDasharray: `${showTraveled ? doneLen : 0} ${route.total}`,
        }}
      />
    </g>
  )
}
