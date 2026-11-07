// Contour lines ("lines of equal height") traced over the terrain with marching squares.
//
// 1. Sample the terrain height on a grid (every 16 px).
// 2. Pick 14 heights between the lowest and highest point.
// 3. For each height, look at every grid square: compare its 4 corners with that height.
//    The pattern of above/below corners (16 cases) tells us where the line crosses the
//    square, and we find the exact crossing points by interpolating between corners.
// 4. Join the little line pieces end-to-end into long lines, and write them as SVG paths.

import { createTerrain } from './terrain'

export function buildContourLines({ width, height, hills, cellSize = 16, levelCount = 14 }) {
  const terrainHeight = createTerrain({ hills })

  // 1. height grid
  const columns = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const grid = []
  let lowest = Infinity
  let highest = -Infinity
  for (let j = 0; j <= rows; j++) {
    const row = []
    for (let i = 0; i <= columns; i++) {
      const value = terrainHeight(i * cellSize, j * cellSize)
      row.push(value)
      lowest = Math.min(lowest, value)
      highest = Math.max(highest, value)
    }
    grid.push(row)
  }

  const contourLines = []
  for (let level = 1; level <= levelCount; level++) {
    // 2. the height this line follows
    const lineHeight = lowest + ((highest - lowest) * level) / (levelCount + 1)
    const pieces = []

    // 3. marching squares
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < columns; i++) {
        const topLeft = grid[j][i]
        const topRight = grid[j][i + 1]
        const bottomRight = grid[j + 1][i + 1]
        const bottomLeft = grid[j + 1][i]
        // one bit per corner: is it above the line height?
        const cornerPattern =
          ((topLeft > lineHeight) << 3) | ((topRight > lineHeight) << 2) | ((bottomRight > lineHeight) << 1) | (bottomLeft > lineHeight)
        if (cornerPattern === 0 || cornerPattern === 15) continue // all below or all above: no line here

        const x = i * cellSize
        const y = j * cellSize
        // how far between two corners the line crosses (0..1)
        const crossing = (from, to) => (lineHeight - from) / (to - from)
        const topEdge = () => [x + cellSize * crossing(topLeft, topRight), y]
        const rightEdge = () => [x + cellSize, y + cellSize * crossing(topRight, bottomRight)]
        const bottomEdge = () => [x + cellSize * crossing(bottomLeft, bottomRight), y + cellSize]
        const leftEdge = () => [x, y + cellSize * crossing(topLeft, bottomLeft)]
        const addPiece = (edgeA, edgeB) => pieces.push([edgeA(), edgeB()])

        switch (cornerPattern) {
          case 1: case 14: addPiece(leftEdge, bottomEdge); break
          case 2: case 13: addPiece(bottomEdge, rightEdge); break
          case 3: case 12: addPiece(leftEdge, rightEdge); break
          case 4: case 11: addPiece(topEdge, rightEdge); break
          case 6: case 9: addPiece(topEdge, bottomEdge); break
          case 7: case 8: addPiece(topEdge, leftEdge); break
          case 5: addPiece(topEdge, rightEdge); addPiece(leftEdge, bottomEdge); break // saddle
          case 10: addPiece(topEdge, leftEdge); addPiece(bottomEdge, rightEdge); break // saddle
        }
      }
    }

    // every fifth line is drawn stronger, like a real topographic map
    contourLines.push({ svgPath: joinPiecesIntoLines(pieces), isMajor: level % 5 === 0 })
  }
  return contourLines
}

// 4. Join touching pieces into long polylines, so the SVG path is compact and smooth
function joinPiecesIntoLines(pieces) {
  const pointKey = (point) => `${Math.round(point[0] * 10)},${Math.round(point[1] * 10)}`
  const piecesAtPoint = new Map()
  pieces.forEach((piece, index) => {
    for (const point of piece) {
      const key = pointKey(point)
      if (!piecesAtPoint.has(key)) piecesAtPoint.set(key, [])
      piecesAtPoint.get(key).push(index)
    }
  })
  const used = new Uint8Array(pieces.length)
  const unusedPieceAt = (point) => (piecesAtPoint.get(pointKey(point)) || []).find((index) => !used[index])
  const formatPoint = (point) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`

  let svgPath = ''
  for (let start = 0; start < pieces.length; start++) {
    if (used[start]) continue
    used[start] = 1
    const line = [pieces[start][0], pieces[start][1]]
    // grow the line forwards, then backwards, while there are touching pieces
    for (let direction = 0; direction < 2; direction++) {
      for (;;) {
        const tip = direction === 0 ? line[line.length - 1] : line[0]
        const nextIndex = unusedPieceAt(tip)
        if (nextIndex === undefined) break
        used[nextIndex] = 1
        const [pointA, pointB] = pieces[nextIndex]
        const farEnd = pointKey(pointA) === pointKey(tip) ? pointB : pointA
        if (direction === 0) line.push(farEnd)
        else line.unshift(farEnd)
      }
    }
    svgPath += `M${formatPoint(line[0])}` + line.slice(1).map((point) => `L${formatPoint(point)}`).join('')
  }
  return svgPath
}
