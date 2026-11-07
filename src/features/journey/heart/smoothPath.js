// Turns a list of points into one smooth curve, and answers "where am I after travelling
// N pixels along it?" — which is how the map knows where the traveller and camera are.
//
// Step 1  Catmull-Rom → cubic Bézier: for each pair of neighbouring points we compute two
//         control points from the points around them, so the curve passes through every
//         point with no sharp corners. That gives an SVG path string ("M … C …").
// Step 2  Length lookup table: we walk along each Bézier in small steps and record the
//         distance travelled so far. pointAtLength() then binary-searches that table.

function catmullRomToBeziers(points) {
  const curves = []
  for (let i = 0; i < points.length - 1; i++) {
    const before = points[i - 1] || points[i]
    const from = points[i]
    const to = points[i + 1]
    const after = points[i + 2] || to
    curves.push({
      start: from,
      control1: { x: from.x + (to.x - before.x) / 6, y: from.y + (to.y - before.y) / 6 },
      control2: { x: to.x - (after.x - from.x) / 6, y: to.y - (after.y - from.y) / 6 },
      end: to,
    })
  }
  return curves
}

// point on a cubic Bézier at t (0 = start, 1 = end)
function pointOnBezier(curve, t) {
  const u = 1 - t
  return {
    x: u * u * u * curve.start.x + 3 * u * u * t * curve.control1.x + 3 * u * t * t * curve.control2.x + t * t * t * curve.end.x,
    y: u * u * u * curve.start.y + 3 * u * u * t * curve.control1.y + 3 * u * t * t * curve.control2.y + t * t * t * curve.end.y,
  }
}

// samplesPerCurve: how finely to measure each curve (fewer is fine when points are dense)
export function buildSmoothPath(points, samplesPerCurve = 80) {
  const curves = catmullRomToBeziers(points)

  // Step 2: distance lookup table
  const lookupTable = [{ ...points[0], distance: 0 }]
  let totalLength = 0
  curves.forEach((curve) => {
    let previous = curve.start
    for (let k = 1; k <= samplesPerCurve; k++) {
      const point = pointOnBezier(curve, k / samplesPerCurve)
      totalLength += Math.hypot(point.x - previous.x, point.y - previous.y)
      lookupTable.push({ x: point.x, y: point.y, distance: totalLength })
      previous = point
    }
  })

  const svgPath =
    `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}` +
    curves
      .map((c) => ` C${c.control1.x.toFixed(1)} ${c.control1.y.toFixed(1)} ${c.control2.x.toFixed(1)} ${c.control2.y.toFixed(1)} ${c.end.x.toFixed(1)} ${c.end.y.toFixed(1)}`)
      .join('')

  // Where are we after `distance` pixels along the path? Returns { x, y, angle }.
  function pointAtLength(distance) {
    const target = Math.max(0, Math.min(totalLength, distance))
    // binary search for the two table entries either side of `target`
    let low = 0
    let high = lookupTable.length - 1
    while (high - low > 1) {
      const middle = (low + high) >> 1
      if (lookupTable[middle].distance < target) low = middle
      else high = middle
    }
    const a = lookupTable[low]
    const b = lookupTable[high]
    const blend = b.distance === a.distance ? 0 : (target - a.distance) / (b.distance - a.distance)
    // direction of travel: look a little ahead and behind
    const ahead = lookupTable[Math.min(lookupTable.length - 1, high + 3)]
    const behind = lookupTable[Math.max(0, low - 3)]
    const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x)
    return { x: a.x + (b.x - a.x) * blend, y: a.y + (b.y - a.y) * blend, angle }
  }

  return { svgPath, totalLength, pointAtLength }
}
