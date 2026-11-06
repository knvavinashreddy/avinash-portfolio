// Topographic contour lines for the journey map background.
// A smooth, made-up terrain (soft noise plus a gentle hill under each city) is
// sampled on a grid, and marching squares traces lines of equal height.
// Everything is deterministic, so the map looks the same on every visit.

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Smooth value noise: random heights on a lattice, blended with a smoothstep
function valueNoise(spacing, seed) {
  const r = rng(seed)
  const cols = 40
  const rows = 40
  const lattice = Array.from({ length: rows }, () => Array.from({ length: cols }, r))
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const gx = x / spacing + 3
    const gy = y / spacing + 3
    const i = Math.floor(gx)
    const j = Math.floor(gy)
    const tx = smooth(gx - i)
    const ty = smooth(gy - j)
    const a = lattice[j % rows][i % cols]
    const b = lattice[j % rows][(i + 1) % cols]
    const c = lattice[(j + 1) % rows][i % cols]
    const d = lattice[(j + 1) % rows][(i + 1) % cols]
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
  }
}

export function buildContours({ w, h, hills = [], cell = 16, levels = 14, seed = 7 }) {
  const broad = valueNoise(340, seed)
  const fine = valueNoise(150, seed + 31)
  const height = (x, y) => {
    let v = broad(x, y) + 0.45 * fine(x, y)
    for (const hl of hills) {
      const dx = x - hl.x
      const dy = y - hl.y
      v += hl.h * Math.exp(-(dx * dx + dy * dy) / (2 * hl.r * hl.r))
    }
    return v
  }

  const nx = Math.ceil(w / cell)
  const ny = Math.ceil(h / cell)
  const grid = []
  let lo = Infinity
  let hi = -Infinity
  for (let j = 0; j <= ny; j++) {
    const row = []
    for (let i = 0; i <= nx; i++) {
      const v = height(i * cell, j * cell)
      row.push(v)
      if (v < lo) lo = v
      if (v > hi) hi = v
    }
    grid.push(row)
  }

  const out = []
  for (let l = 1; l <= levels; l++) {
    const L = lo + ((hi - lo) * l) / (levels + 1)
    const segs = []
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = grid[j][i] // top-left
        const b = grid[j][i + 1] // top-right
        const c = grid[j + 1][i + 1] // bottom-right
        const d = grid[j + 1][i] // bottom-left
        const idx = ((a > L) << 3) | ((b > L) << 2) | ((c > L) << 1) | (d > L)
        if (idx === 0 || idx === 15) continue
        const x0 = i * cell
        const y0 = j * cell
        const t = (p, q) => (L - p) / (q - p)
        const top = () => [x0 + cell * t(a, b), y0]
        const right = () => [x0 + cell, y0 + cell * t(b, c)]
        const bottom = () => [x0 + cell * t(d, c), y0 + cell]
        const left = () => [x0, y0 + cell * t(a, d)]
        const S = (p, q) => segs.push([p(), q()])
        switch (idx) {
          case 1: case 14: S(left, bottom); break
          case 2: case 13: S(bottom, right); break
          case 3: case 12: S(left, right); break
          case 4: case 11: S(top, right); break
          case 6: case 9: S(top, bottom); break
          case 7: case 8: S(top, left); break
          case 5: S(top, right); S(left, bottom); break
          case 10: S(top, left); S(bottom, right); break
        }
      }
    }
    out.push({ d: chain(segs), major: l % 5 === 0 })
  }
  return out
}

// Join touching segments into long polylines, so the path is compact and smooth
function chain(segs) {
  const key = (p) => `${Math.round(p[0] * 10)},${Math.round(p[1] * 10)}`
  const ends = new Map()
  segs.forEach((s, n) => {
    for (const p of s) {
      const k = key(p)
      if (!ends.has(k)) ends.set(k, [])
      ends.get(k).push(n)
    }
  })
  const used = new Uint8Array(segs.length)
  const next = (p) => (ends.get(key(p)) || []).find((n) => !used[n])
  const fmt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`
  let d = ''
  for (let n = 0; n < segs.length; n++) {
    if (used[n]) continue
    used[n] = 1
    const line = [segs[n][0], segs[n][1]]
    // grow forwards, then backwards
    for (let dir = 0; dir < 2; dir++) {
      for (;;) {
        const tip = dir === 0 ? line[line.length - 1] : line[0]
        const m = next(tip)
        if (m === undefined) break
        used[m] = 1
        const [p, q] = segs[m]
        const other = key(p) === key(tip) ? q : p
        if (dir === 0) line.push(other)
        else line.unshift(other)
      }
    }
    d += `M${fmt(line[0])}` + line.slice(1).map((p) => `L${fmt(p)}`).join('')
  }
  return d
}
