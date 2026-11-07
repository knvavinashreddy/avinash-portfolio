// A made-up, smooth terrain for the topographic background.
// height(x, y) = broad gentle noise + finer noise + a soft hill under each city.
// It's deterministic (seeded), so the map looks the same on every visit.

// Tiny seeded random number generator: same seed → same numbers every time
function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

// Smooth "value noise": random heights on a coarse grid, blended smoothly between grid points
function valueNoise(gridSpacing, seed) {
  const random = seededRandom(seed)
  const columns = 40
  const rows = 40
  const lattice = Array.from({ length: rows }, () => Array.from({ length: columns }, random))
  const smoothstep = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const gridX = x / gridSpacing + 3
    const gridY = y / gridSpacing + 3
    const i = Math.floor(gridX)
    const j = Math.floor(gridY)
    const blendX = smoothstep(gridX - i)
    const blendY = smoothstep(gridY - j)
    const topLeft = lattice[j % rows][i % columns]
    const topRight = lattice[j % rows][(i + 1) % columns]
    const bottomLeft = lattice[(j + 1) % rows][i % columns]
    const bottomRight = lattice[(j + 1) % rows][(i + 1) % columns]
    return (
      topLeft +
      (topRight - topLeft) * blendX +
      (bottomLeft - topLeft) * blendY +
      (topLeft - topRight - bottomLeft + bottomRight) * blendX * blendY
    )
  }
}

// hills: [{ x, y, radius, height }] — a soft bump (a Gaussian) under each place name
export function createTerrain({ hills = [], seed = 7 }) {
  const broadNoise = valueNoise(340, seed)
  const fineNoise = valueNoise(150, seed + 31)
  return (x, y) => {
    let height = broadNoise(x, y) + 0.45 * fineNoise(x, y)
    for (const hill of hills) {
      const dx = x - hill.x
      const dy = y - hill.y
      height += hill.height * Math.exp(-(dx * dx + dy * dy) / (2 * hill.radius * hill.radius))
    }
    return height
  }
}
