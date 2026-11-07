// The heart route, and where each journey stop sits on it.
// Everything here is plain maths, worked out once when the page loads.

import { journeyStops } from '../../../data/journeyStops'
import { buildSmoothPath } from './smoothPath'

// The map is drawn on a 1800 × 1300 "world" (SVG units)
export const MAP_WORLD = { width: 1800, height: 1300 }

// ── 1. The heart curve ──
// Classic heart equation, for t from 0 to 2π:
//   x = 16 sin³t
//   y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t
// We start at t = π (the bottom tip) and go all the way round: up the left lobe,
// through the dip at the top, down the right lobe, back to the tip.
// `size` scales it up; y is flipped because screen y grows downwards.
const HEART = { centerX: 900, centerY: 600, size: 34, samples: 160 }

const heartPoints = []
for (let i = 0; i <= HEART.samples; i++) {
  const t = Math.PI + (2 * Math.PI * i) / HEART.samples
  heartPoints.push({
    x: HEART.centerX + HEART.size * 16 * Math.sin(t) ** 3,
    y: HEART.centerY - HEART.size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  })
}
export const heartRoute = buildSmoothPath(heartPoints, 12)

// left and right edges of the heart, so the gradient colour can run across it
export const HEART_LEFT_EDGE = HEART.centerX - HEART.size * 16
export const HEART_RIGHT_EDGE = HEART.centerX + HEART.size * 16
// centre of the soft glow inside the heart
export const HEART_GLOW_CENTER = { x: HEART.centerX, y: HEART.centerY + 40 }
// how to frame the whole heart when zooming out to leave the map
export const WHOLE_HEART_FRAME = { centerX: 900, centerY: 690, width: 1180, height: 1080 }

// ── 2. The stops ──
// Stops sit at equal distances along the heart, from 10% to 90% of the way round,
// so there are no big gaps. With nine stops the middle one lands exactly in the dip.
const stopCount = journeyStops.length
const stopProgressAlongHeart = journeyStops.map((_, i) => (stopCount === 1 ? 0.5 : 0.1 + (0.8 * i) / (stopCount - 1)))

// how far along the heart (in pixels) each stop is
export const stopDistances = stopProgressAlongHeart.map((progress) => progress * heartRoute.totalLength)

// where each stop is on the map
export const stopPositions = stopDistances.map((distance) => {
  const point = heartRoute.pointAtLength(distance)
  return { x: Math.round(point.x), y: Math.round(point.y) }
})

// labels go to the right of a pin, except in the dip, where the line is on both sides
export const stopLabelSides = stopProgressAlongHeart.map((progress) => (Math.abs(progress - 0.5) < 0.03 ? 'below' : 'right'))

// which stop is closest to a distance along the heart
export function findNearestStop(distance) {
  let nearest = 0
  for (let i = 1; i < stopCount; i++) {
    if (Math.abs(stopDistances[i] - distance) < Math.abs(stopDistances[nearest] - distance)) nearest = i
  }
  return nearest
}
