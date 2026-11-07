// Drag the map to look around. Moving the mouse while pressed shifts camera.panX / panY;
// the next scroll or glide drifts it back onto the route.
// Returns pointer handlers to put on the map viewport.

import { useRef } from 'react'

export function useDragToLook({ camera, isDragging, drawCameraFrame }) {
  const lastPointer = useRef(null)

  const onPointerDown = (event) => {
    if (event.target.closest('button')) return // pins and controls still click normally
    lastPointer.current = { x: event.clientX, y: event.clientY }
    isDragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event) => {
    if (!lastPointer.current) return
    camera.current.panX += event.clientX - lastPointer.current.x
    camera.current.panY += event.clientY - lastPointer.current.y
    lastPointer.current = { x: event.clientX, y: event.clientY }
    drawCameraFrame()
  }
  const onPointerUp = () => {
    lastPointer.current = null
    isDragging.current = false
  }

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }
}
