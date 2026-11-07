// Drag items around the life board with mouse, touch or pen, or nudge them with arrow keys.
//
// Positions are in "board pixels" (the board is 920 × 560). On small screens the board can be
// drawn smaller, so pointer movement is divided by that scale to stay in board pixels.
// The item you grab moves to the top of the pile (stackOrder).

import { useRef, useState } from 'react'

export const BOARD_WIDTH = 920
export const BOARD_HEIGHT = 560

export function useDraggableItems(items, boardRef) {
  const [positions, setPositions] = useState(() => Object.fromEntries(items.map((item) => [item.id, { x: item.x, y: item.y }])))
  const [stackOrder, setStackOrder] = useState(items.map((item) => item.id)) // last = on top
  const dragging = useRef(null)

  const startDrag = (itemId) => (event) => {
    const boardBox = boardRef.current.getBoundingClientRect()
    const scale = boardBox.width / BOARD_WIDTH
    // remember where inside the item it was grabbed, so it doesn't jump
    dragging.current = {
      itemId,
      grabOffsetX: event.clientX / scale - positions[itemId].x,
      grabOffsetY: event.clientY / scale - positions[itemId].y,
      scale,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setStackOrder((order) => [...order.filter((id) => id !== itemId), itemId])
  }

  const moveDrag = (event) => {
    const drag = dragging.current
    if (!drag) return
    const item = event.currentTarget
    // keep items on the board (they may hang over the edge by 20px)
    const x = Math.min(Math.max(event.clientX / drag.scale - drag.grabOffsetX, -20), BOARD_WIDTH - item.offsetWidth + 20)
    const y = Math.min(Math.max(event.clientY / drag.scale - drag.grabOffsetY, -20), BOARD_HEIGHT - item.offsetHeight + 20)
    setPositions((current) => ({ ...current, [drag.itemId]: { x, y } }))
  }

  const endDrag = () => (dragging.current = null)

  // arrow keys move a focused item by 12px (40px with Shift)
  const nudgeWithKeys = (itemId) => (event) => {
    const step = event.shiftKey ? 40 : 12
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key]
    if (!move) return
    event.preventDefault()
    setPositions((current) => ({ ...current, [itemId]: { x: current[itemId].x + move[0], y: current[itemId].y + move[1] } }))
  }

  return { positions, stackOrder, startDrag, moveDrag, endDrag, nudgeWithKeys }
}
