// Quiet topographic background behind the heart:
// land colour, a fine dot grid, contour lines, a soft glow inside the heart,
// the three places I've lived (with real coordinates), and a small compass rose.

import { HEART_GLOW_CENTER, MAP_WORLD } from '../heart/heartShape'
import { buildContourLines } from './contourLines'
import './MapBackground.css'

// Each place sits on a gentle hill in the terrain, so the contour lines ring around its name
const MAP_PLACES = [
  { name: 'BHIMAVARAM', coordinates: '16.54°N 81.52°E', x: 540, y: 1040 },
  { name: 'TUMAKURU', coordinates: '13.34°N 77.10°E', x: 590, y: 470 },
  { name: 'HYDERABAD', coordinates: '17.39°N 78.49°E', x: 1210, y: 440 },
]

// worked out once when the page loads
const CONTOUR_LINES = buildContourLines({
  width: MAP_WORLD.width,
  height: MAP_WORLD.height,
  hills: MAP_PLACES.map((place, i) => ({ x: place.x, y: place.y - 12, radius: 150 + i * 20, height: 0.55 })),
})

export default function MapBackground({ idPrefix, showCompassRose }) {
  const dotGridId = `${idPrefix}-dots`
  const heartGlowId = `${idPrefix}-glow`
  return (
    <>
      <defs>
        <pattern id={dotGridId} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.6" className="map-grid-dot" />
        </pattern>
        <radialGradient id={heartGlowId} cx={HEART_GLOW_CENTER.x} cy={HEART_GLOW_CENTER.y} r="560" gradientUnits="userSpaceOnUse">
          <stop offset="0" className="map-heart-glow-center" />
          <stop offset="0.55" className="map-heart-glow-middle" />
          <stop offset="1" className="map-heart-glow-edge" />
        </radialGradient>
      </defs>

      <rect className="map-land" x="0" y="0" width={MAP_WORLD.width} height={MAP_WORLD.height} />
      <rect x="0" y="0" width={MAP_WORLD.width} height={MAP_WORLD.height} fill={`url(#${dotGridId})`} />

      <g className="map-contour-lines">
        {CONTOUR_LINES.map((line, i) => (
          <path key={i} d={line.svgPath} className={line.isMajor ? 'is-major' : undefined} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      <ellipse cx={HEART_GLOW_CENTER.x} cy={HEART_GLOW_CENTER.y} rx="620" ry="560" fill={`url(#${heartGlowId})`} />

      {MAP_PLACES.map((place) => (
        <text key={place.name} className="map-place-name" x={place.x} y={place.y} textAnchor="middle">
          {place.name}
          <tspan x={place.x} dy="34" className="map-place-coords">{place.coordinates}</tspan>
        </text>
      ))}

      {showCompassRose && (
        <g className="map-compass-rose" transform="translate(1500 1010)" aria-hidden="true">
          <circle r="46" />
          <circle r="4" />
          <path d="M0 -62 V-30 M0 30 V62 M-62 0 H-30 M30 0 H62" />
          <path className="map-compass-rose-needle" d="M0 -38 L7 0 L0 6 L-7 0Z" />
          <text y="-72" textAnchor="middle">N</text>
        </g>
      )}
    </>
  )
}
