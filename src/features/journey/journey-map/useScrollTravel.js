// Scroll / trackpad moves the camera along the heart, exactly 1:1:
// every pixel you scroll moves the map the same number of pixels, in the same frame.
// Scroll fast → travel fast; scroll slowly → travel slowly; stop → it stops. No easing, no snapping.
//
// Past the first or last stop, extra scrolling fills the "keep scrolling" bar instead;
// a full bar leaves the map. Stop pushing for a moment and the bar drains away.
// Returns exitProgress: -1..1 (negative = leaving backwards, positive = leaving forwards).

import { useEffect, useState } from 'react'
import { stopDistances } from '../heart/heartShape'
import { LEAVE_MAP_PUSH_DISTANCE, getCameraAnchor } from './mapCamera'

export function useScrollTravel({ mapCamera, mapRootRef, storyPanelRef, leaveMap }) {
  const [exitProgress, setExitProgress] = useState(0)
  const { camera, targetDistance, isLeaving, refs, drawCameraFrame, updateCurrentStop, stopGlide, setHasMoved, zoomBy } = mapCamera

  useEffect(() => {
    const mapRoot = mapRootRef.current
    const firstStop = stopDistances[0]
    const lastStop = stopDistances[stopDistances.length - 1]
    let pushedPastEnd = 0 // screen pixels scrolled past an end
    let pushDirection = 0
    let drainTimer = 0
    let barIsShowing = false

    const showExitBar = (progress) => {
      if (progress === 0 && !barIsShowing) return // avoid re-rendering on every scroll
      barIsShowing = progress !== 0
      setExitProgress(progress)
    }

    const onWheel = (event) => {
      // over the story card: let a long story scroll its own text first; only once you
      // reach its top or bottom does scrolling move the map again
      const storyPanel = storyPanelRef.current
      if (storyPanel && storyPanel.contains(event.target)) {
        const storyCanScroll = storyPanel.scrollHeight > storyPanel.clientHeight + 2
        const atTop = storyPanel.scrollTop <= 0
        const atBottom = storyPanel.scrollTop + storyPanel.clientHeight >= storyPanel.scrollHeight - 2
        if (storyCanScroll && !((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom))) return
      }
      event.preventDefault()
      // pinch / ctrl + scroll zooms instead
      if (event.ctrlKey) {
        zoomBy(event.deltaY < 0 ? 1.1 : 0.9)
        return
      }
      if (isLeaving.current) return

      const cam = camera.current
      stopGlide() // a key or dot glide in progress hands over to the scroll at once
      cam.velocity = 0

      // wheel deltas can be in pixels, lines or pages; convert to pixels
      const pixelsPerUnit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? mapRoot.clientHeight : 1
      const scrolledPixels = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * pixelsPerUnit
      // screen pixels → map distance at the current zoom, so the map moves exactly as far as you scrolled
      const zoomLevel = getCameraAnchor(refs.viewportRef.current).baseZoom * cam.zoom * cam.userZoom
      const newDistance = cam.distance + scrolledPixels / zoomLevel
      // a map you dragged aside drifts back onto the route as you scroll
      const drift = Math.min(1, Math.abs(scrolledPixels) / 400)
      cam.panX *= 1 - drift
      cam.panY *= 1 - drift
      setHasMoved(true)

      if (newDistance > lastStop || newDistance < firstStop) {
        // past an end: stay on the end stop, and fill the bar by exactly how far you pushed
        const direction = newDistance > lastStop ? 1 : -1
        const endStop = direction > 0 ? lastStop : firstStop
        cam.distance = endStop
        targetDistance.current = endStop
        drawCameraFrame()
        updateCurrentStop()
        if (pushDirection !== direction) {
          pushedPastEnd = 0
          pushDirection = direction
        }
        pushedPastEnd += Math.abs(newDistance - endStop) * zoomLevel
        clearTimeout(drainTimer)
        if (pushedPastEnd >= LEAVE_MAP_PUSH_DISTANCE) {
          showExitBar(0)
          leaveMap(direction)
          return
        }
        showExitBar(direction * (pushedPastEnd / LEAVE_MAP_PUSH_DISTANCE))
        drainTimer = setTimeout(() => {
          pushedPastEnd = 0
          showExitBar(0)
        }, 450)
        return
      }

      pushedPastEnd = 0
      showExitBar(0)
      cam.distance = newDistance
      targetDistance.current = newDistance
      drawCameraFrame()
      updateCurrentStop()
    }

    mapRoot.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      clearTimeout(drainTimer)
      mapRoot.removeEventListener('wheel', onWheel)
    }
  }, [camera, targetDistance, isLeaving, refs, drawCameraFrame, updateCurrentStop, stopGlide, setHasMoved, zoomBy, mapRootRef, storyPanelRef, leaveMap])

  return exitProgress
}
