// Builds a smooth route through a list of points (Catmull-Rom → cubic Béziers)
// and gives fast "where am I after N pixels of travel" lookups.

function toBeziers(pts) {
  const segs = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    segs.push({
      a: p1,
      c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      b: p2,
    })
  }
  return segs
}

function cubic(s, t) {
  const u = 1 - t
  return {
    x: u * u * u * s.a.x + 3 * u * u * t * s.c1.x + 3 * u * t * t * s.c2.x + t * t * t * s.b.x,
    y: u * u * u * s.a.y + 3 * u * u * t * s.c1.y + 3 * u * t * t * s.c2.y + t * t * t * s.b.y,
  }
}

export function buildRoute(points) {
  const segs = toBeziers(points)
  const lut = [{ ...points[0], len: 0 }]
  const lenAtPoint = [0]
  let len = 0
  const STEPS = 80
  segs.forEach((s) => {
    let prev = s.a
    for (let k = 1; k <= STEPS; k++) {
      const p = cubic(s, k / STEPS)
      len += Math.hypot(p.x - prev.x, p.y - prev.y)
      lut.push({ x: p.x, y: p.y, len })
      prev = p
    }
    lenAtPoint.push(len)
  })

  const d =
    `M${points[0].x} ${points[0].y}` +
    segs.map((s) => ` C${s.c1.x.toFixed(1)} ${s.c1.y.toFixed(1)} ${s.c2.x.toFixed(1)} ${s.c2.y.toFixed(1)} ${s.b.x} ${s.b.y}`).join('')

  function at(l) {
    const target = Math.max(0, Math.min(len, l))
    let lo = 0
    let hi = lut.length - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (lut[mid].len < target) lo = mid
      else hi = mid
    }
    const A = lut[lo]
    const B = lut[hi]
    const t = B.len === A.len ? 0 : (target - A.len) / (B.len - A.len)
    // heading: look a little ahead (or behind at the very end)
    const ahead = lut[Math.min(lut.length - 1, hi + 3)]
    const behind = lut[Math.max(0, lo - 3)]
    const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x)
    return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, angle }
  }

  return { d, total: len, lenAtPoint, at }
}
