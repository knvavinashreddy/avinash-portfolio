// Leaving the map past either end of the heart:
// the camera pulls back over 0.75s until the whole heart fits on screen (the panels fade out
// via the .is-exiting class), then onLeave(direction) closes the map and the page scrolls on.
//
// direction: +1 = past the last stop (on to Work), -1 = before the first stop (back to Journey)

import { useCallback, useRef, useState } from 'react'
import { easeInOutCubic } from '../../../shared/motion/motion'
import { WHOLE_HEART_FRAME, heartRoute } from '../heart/heartShape'
import { getCameraAnchor } from './mapCamera'

export function useLeaveMapAnimation(mapCamera, onLeave) {
  const [isExiting, setIsExiting] = useState(false)
  // keep the latest onLeave without making leaveMap change identity
  const onLeaveRef = useRef(onLeave)
  onLeaveRef.current = onLeave
  const { camera, isLeaving, reducedMotion, zoomFrame, refs, drawCameraFrame, stopGlide } = mapCamera

  const leaveMap = useCallback(
    (direction) => {
      if (isLeaving.current) return
      isLeaving.current = true
      setIsExiting(true)
      stopGlide()
      cancelAnimationFrame(zoomFrame.current)

      let hasLeft = false
      const finishLeaving = () => {
        if (hasLeft) return
        hasLeft = true
        onLeaveRef.current(direction)
      }
      const viewport = refs.viewportRef.current
      if (reducedMotion.current || !viewport) {
        finishLeaving()
        return
      }
      // safety net: if the browser pauses animation frames (background tab), still leave
      setTimeout(finishLeaving, 1400)

      // Zoom out from "close-up on the current point" to "the whole heart, centred"
      const cam = camera.current
      const point = heartRoute.pointAtLength(cam.distance)
      const { anchorX, anchorY, baseZoom } = getCameraAnchor(viewport)
      const screenWidth = viewport.clientWidth
      const screenHeight = viewport.clientHeight
      const startZoom = baseZoom * cam.zoom * cam.userZoom
      const wholeHeartZoom = Math.min(screenWidth / WHOLE_HEART_FRAME.width, screenHeight / WHOLE_HEART_FRAME.height) * 0.85
      const startScreenPoint = { x: anchorX + cam.panX, y: anchorY + cam.panY } // where the camera point is on screen now
      const endScreenPoint = { x: screenWidth / 2, y: screenHeight / 2 }
      const startTime = performance.now()

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / 750)
        const eased = easeInOutCubic(progress)
        const zoomLevel = startZoom + (wholeHeartZoom - startZoom) * eased
        // the map point we look at slides from the current point to the heart's centre…
        const lookAt = {
          x: point.x + (WHOLE_HEART_FRAME.centerX - point.x) * eased,
          y: point.y + (WHOLE_HEART_FRAME.centerY - point.y) * eased,
        }
        // …and where it appears on screen slides to the screen's centre
        const onScreen = {
          x: startScreenPoint.x + (endScreenPoint.x - startScreenPoint.x) * eased,
          y: startScreenPoint.y + (endScreenPoint.y - startScreenPoint.y) * eased,
        }
        // express that as zoom + pan around the current route point, so drawCameraFrame can draw it
        cam.zoom = zoomLevel / (baseZoom * cam.userZoom)
        cam.panX = onScreen.x - lookAt.x * zoomLevel - anchorX + point.x * zoomLevel
        cam.panY = onScreen.y - lookAt.y * zoomLevel - anchorY + point.y * zoomLevel
        drawCameraFrame()
        if (progress < 1) requestAnimationFrame(step)
        else setTimeout(finishLeaving, 180)
      }
      requestAnimationFrame(step)
    },
    [camera, isLeaving, reducedMotion, zoomFrame, refs, drawCameraFrame, stopGlide]
  )

  return { isExiting, leaveMap }
}
