// The heart line.
// Drawn twice on top of each other with the same gradient:
//   1. "ahead":     the whole heart, soft
//   2. "travelled": bright, but only the first part is visible. stroke-dasharray "N total"
//                   shows the first N pixels and hides the rest, so setting N = distance
//                   travelled reveals the line behind the traveller.

import { HEART_LEFT_EDGE, HEART_RIGHT_EDGE, heartRoute } from '../heart/heartShape'
import './HeartRoute.css'

// Light Blue → Lime Cream → Mustard Oil, left to right across the heart
export function HeartRouteGradient({ gradientId }) {
  return (
    <defs>
      <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={HEART_LEFT_EDGE} y1="0" x2={HEART_RIGHT_EDGE} y2="0">
        <stop offset="0" className="heart-route-start" />
        <stop offset="0.5" className="heart-route-middle" />
        <stop offset="1" className="heart-route-end" />
      </linearGradient>
    </defs>
  )
}

export default function HeartRoute({ gradientId, travelledRouteRef, showWholeRouteBright }) {
  return (
    <>
      <path className="heart-route-ahead" d={heartRoute.svgPath} stroke={`url(#${gradientId})`} />
      <path
        ref={travelledRouteRef}
        className="heart-route-travelled"
        d={heartRoute.svgPath}
        stroke={`url(#${gradientId})`}
        // full map starts with nothing travelled; the camera updates this as you move
        style={showWholeRouteBright ? undefined : { strokeDasharray: `0 ${heartRoute.totalLength}` }}
      />
    </>
  )
}
