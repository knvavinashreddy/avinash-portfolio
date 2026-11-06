import { journeyStops } from '../data'
import { buildRoute } from '../lib/route'

export const WORLD = { w: 2400, h: 1700 }

// Route = stops in order, with a few waypoints so long trips curve nicely
const WAYPOINTS = {
  3: [{ x: 1720, y: 1240 }, { x: 1250, y: 1520 }, { x: 820, y: 1480 }], // after CCBP → Karnataka
  5: [{ x: 560, y: 1150 }, { x: 760, y: 900 }, { x: 960, y: 640 }], // after dropout → Hyderabad
}

const points = []
const stopPointIndex = []
journeyStops.forEach((s, i) => {
  stopPointIndex.push(points.length)
  points.push(s.pos)
  if (i < journeyStops.length - 1 && WAYPOINTS[i + 1]) points.push(...WAYPOINTS[i + 1])
})

export const route = buildRoute(points)
export const stopLens = stopPointIndex.map((pi) => route.lenAtPoint[pi])

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
      const split = r() < 0.35
      if (split) {
        out.push([x + 4, y + 4, 19, 38], [x + 27, y + 4, 19, 38])
      } else {
        out.push([x + 4, y + 4, 42 - r() * 10, 42 - r() * 12])
      }
    }
  }
  return out
}

const CITIES = [
  { name: 'HYDERABAD', cx: 1250, cy: 480, w: 820, h: 560, seed: 11, lx: 1250, ly: 225 },
  { name: 'BHIMAVARAM', cx: 1960, cy: 1010, w: 520, h: 420, seed: 23, lx: 1960, ly: 790 },
  { name: 'TUMAKURU', cx: 540, cy: 1360, w: 520, h: 400, seed: 37, lx: 540, ly: 1145 },
]
const BLOCKS = CITIES.map((c) => cityBlocks(c.cx, c.cy, c.w, c.h, c.seed))

function CityGrid({ c }) {
  const x0 = c.cx - c.w / 2
  const y0 = c.cy - c.h / 2
  const lines = []
  for (let x = x0; x <= x0 + c.w; x += 208) lines.push(`M${x} ${y0} V${y0 + c.h}`)
  for (let y = y0; y <= y0 + c.h; y += 208) lines.push(`M${x0} ${y} H${x0 + c.w}`)
  return <path className="m-road" d={lines.join(' ')} />
}

export default function MapWorld({ traveledRef, showTraveled = false }) {
  return (
    <g>
      <rect className="m-land" x="0" y="0" width={WORLD.w} height={WORLD.h} />

      {/* Bay of Bengal */}
      <path className="m-water" d="M2400 560 C 2300 760, 2250 900, 2190 1080 S 2050 1420, 1900 1700 L2400 1700Z" />
      <text className="m-sea-label" x="2250" y="1380" transform="rotate(-62 2250 1380)">BAY OF BENGAL</text>

      {/* State border hints */}
      <path className="m-border" d="M1600 0 C 1560 300, 1640 560, 1580 760 S 1350 980, 1080 1060 S 760 1000, 600 960 S 260 900, 0 960" />
      <text className="m-state" x="1350" y="110">TELANGANA</text>
      <text className="m-state" x="1950" y="1500">ANDHRA PRADESH</text>
      <text className="m-state" x="60" y="985">KARNATAKA</text>

      {/* Rivers and lakes */}
      <path className="m-river" d="M1400 760 C 1600 780, 1760 820, 1880 760 S 2120 760, 2260 640" />
      <text className="m-small" x="1900" y="738">Godavari</text>
      <ellipse className="m-water" cx="1395" cy="470" rx="62" ry="44" />
      <text className="m-small" x="1395" y="535" textAnchor="middle">Hussain Sagar</text>
      <ellipse className="m-water" cx="420" cy="1250" rx="70" ry="40" />
      <text className="m-small" x="420" y="1310" textAnchor="middle">Amanikere</text>

      {/* Parks */}
      <ellipse className="m-park" cx="1050" cy="620" rx="90" ry="55" />
      <ellipse className="m-park" cx="1520" cy="640" rx="70" ry="45" />
      <ellipse className="m-park" cx="2080" cy="1150" rx="60" ry="40" />
      <ellipse className="m-park" cx="680" cy="1450" rx="70" ry="45" />

      {/* Cities */}
      {CITIES.map((c, i) => (
        <g key={c.name}>
          <CityGrid c={c} />
          <g className="m-block">
            {BLOCKS[i].map(([x, y, w, h], k) => (
              <rect key={k} x={x} y={y} width={w} height={h} rx="3" />
            ))}
          </g>
        </g>
      ))}

      {/* Highways */}
      <path className="m-highway" d="M1250 520 C 1450 640, 1620 820, 1800 900 S 1960 990, 2000 1040" />
      <path className="m-highway" d="M1150 560 C 1050 760, 860 1000, 700 1180 S 560 1330, 520 1380" />
      <path className="m-highway" d="M1980 1060 C 1800 1300, 1500 1480, 1150 1520 S 720 1460, 560 1380" />
      <g className="m-shield">
        <rect x="1452" y="662" width="64" height="26" rx="5" />
        <text x="1484" y="680" textAnchor="middle">NH65</text>
        <rect x="838" y="980" width="64" height="26" rx="5" />
        <text x="870" y="998" textAnchor="middle">NH44</text>
        <rect x="1338" y="1496" width="64" height="26" rx="5" />
        <text x="1370" y="1514" textAnchor="middle">NH16</text>
      </g>

      {/* City and area labels */}
      {CITIES.map((c) => (
        <text key={c.name} className="m-city" x={c.lx} y={c.ly} textAnchor="middle">{c.name}</text>
      ))}
      <text className="m-small" x="1075" y="580" textAnchor="middle">Financial District</text>

      {/* The route */}
      <path className="m-route-ghost" d={route.d} />
      <path
        ref={traveledRef}
        className="m-route"
        d={route.d}
        style={showTraveled ? undefined : { strokeDasharray: route.total, strokeDashoffset: route.total }}
      />
    </g>
  )
}
