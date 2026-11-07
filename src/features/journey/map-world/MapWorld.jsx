// Everything drawn on the map, as one SVG group. Used twice: in the small heart preview
// on the page, and in the full-screen journey map.
//
//   MapBackground   land, dot grid, contour lines, glow, place names (and the compass rose in the preview)
//   HeartRoute      the heart line itself
//
// isPreview: the preview shows the whole heart bright and the compass rose;
//            the full map reveals the bright line as you travel (travelledRouteRef).

import { useId } from 'react'
import HeartRoute, { HeartRouteGradient } from './HeartRoute'
import MapBackground from './MapBackground'

export default function MapWorld({ travelledRouteRef, isPreview = false }) {
  // unique ids, because this map can be on the page twice at once
  const idPrefix = `map-${useId().replace(/:/g, '')}`
  const routeGradientId = `${idPrefix}-route`

  return (
    <g>
      <HeartRouteGradient gradientId={routeGradientId} />
      <MapBackground idPrefix={idPrefix} showCompassRose={isPreview} />
      <HeartRoute gradientId={routeGradientId} travelledRouteRef={travelledRouteRef} showWholeRouteBright={isPreview} />
    </g>
  )
}
