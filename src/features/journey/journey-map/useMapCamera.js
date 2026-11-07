// The map camera: where along the heart we are, how zoomed in, and how to draw it.
//
// camera.distance   how far along the heart (in map pixels) the camera is looking
// camera.zoom       automatic zoom (only changes while leaving the map)
// camera.userZoom   zoom from the + / − buttons
// camera.panX/panY  extra offset when the visitor drags the map aside
//
// drawCameraFrame() moves everything for the current camera in one go: the map layer,
// the bright travelled line, the traveller arrow, the compass needle, and every pin.
// It writes styles directly (no React re-render), so it's fast enough for every frame.
//
// glideToTarget() animates camera.distance towards targetDistance on a spring
// (eases in, eases out, never overshoots). Used for dots, pins and arrow keys.

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { easeInOutCubic, prefersReducedMotion } from '../../../shared/motion/motion'
import { findNearestStop, heartRoute, stopDistances, stopPositions } from '../heart/heartShape'
import { CAMERA_SPRING_STRENGTH, getCameraAnchor } from './mapCamera'

export function useMapCamera({ startAtStop }) {
  const camera = useRef({ distance: stopDistances[startAtStop], velocity: 0, zoom: 1, userZoom: 1, panX: 0, panY: 0 })
  const targetDistance = useRef(stopDistances[startAtStop]) // where the spring glide is heading
  const [currentStopIndex, setCurrentStopIndex] = useState(startAtStop)
  const currentStopIndexRef = useRef(startAtStop)
  const [hasMoved, setHasMoved] = useState(false) // hides the "scroll to travel" hint
  const isLeaving = useRef(false) // set while the leave animation runs: ignore all input
  const isDragging = useRef(false)
  const reducedMotion = useRef(false)
  const glideFrame = useRef(0)
  const zoomFrame = useRef(0)

  // elements that drawCameraFrame moves
  const viewportRef = useRef(null)
  const worldLayerRef = useRef(null)
  const travelledRouteRef = useRef(null)
  const travellerRef = useRef(null)
  const travellerArrowRef = useRef(null)
  const compassNeedleRef = useRef(null)
  const pinElements = useRef([])
  // one stable object, so hooks that depend on it don't re-run on every render
  const refs = useMemo(
    () => ({ viewportRef, worldLayerRef, travelledRouteRef, travellerRef, travellerArrowRef, compassNeedleRef, pinElements }),
    []
  )

  const drawCameraFrame = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || !worldLayerRef.current) return
    const cam = camera.current
    const point = heartRoute.pointAtLength(cam.distance)
    const { anchorX, anchorY, baseZoom } = getCameraAnchor(viewport)
    const zoomLevel = baseZoom * cam.zoom * cam.userZoom
    // shift the world so the current point lands on the anchor
    const offsetX = anchorX - point.x * zoomLevel + cam.panX
    const offsetY = anchorY - point.y * zoomLevel + cam.panY
    worldLayerRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoomLevel})`
    // bright line behind the traveller; the soft line underneath shows the road ahead
    travelledRouteRef.current.style.strokeDasharray = `${cam.distance} ${heartRoute.totalLength}`
    travellerRef.current.style.transform = `translate3d(${point.x * zoomLevel + offsetX}px, ${point.y * zoomLevel + offsetY}px, 0)`
    travellerArrowRef.current.style.transform = `rotate(${point.angle}rad)`
    compassNeedleRef.current.style.transform = `rotate(${point.angle + Math.PI / 2}rad)`
    stopPositions.forEach((position, i) => {
      const pin = pinElements.current[i]
      if (pin) pin.style.transform = `translate3d(${position.x * zoomLevel + offsetX}px, ${position.y * zoomLevel + offsetY}px, 0)`
    })
  }, [])

  // The story card follows whichever stop the camera is nearest to
  const updateCurrentStop = useCallback(() => {
    const nearest = findNearestStop(camera.current.distance)
    if (nearest !== currentStopIndexRef.current) {
      currentStopIndexRef.current = nearest
      setCurrentStopIndex(nearest)
    }
  }, [])

  const stopGlide = useCallback(() => {
    cancelAnimationFrame(glideFrame.current)
    glideFrame.current = 0
  }, [])

  // Spring glide towards targetDistance (critically damped: smooth, no overshoot)
  const glideToTarget = useCallback(() => {
    if (glideFrame.current || isLeaving.current) return
    const cam = camera.current
    if (reducedMotion.current) {
      Object.assign(cam, { distance: targetDistance.current, velocity: 0, panX: 0, panY: 0 })
      drawCameraFrame()
      updateCurrentStop()
      return
    }
    let previousTime = performance.now()
    const step = (now) => {
      const seconds = Math.min(1 / 30, (now - previousTime) / 1000)
      previousTime = now
      const distanceLeft = targetDistance.current - cam.distance
      // spring physics: pulled towards the target, slowed by damping
      cam.velocity += (CAMERA_SPRING_STRENGTH * CAMERA_SPRING_STRENGTH * distanceLeft - 2 * CAMERA_SPRING_STRENGTH * cam.velocity) * seconds
      cam.distance += cam.velocity * seconds
      if (!isDragging.current) {
        // drift back onto the route if the visitor dragged the map aside
        const drift = 1 - Math.exp(-seconds * 6)
        cam.panX -= cam.panX * drift
        cam.panY -= cam.panY * drift
      }
      drawCameraFrame()
      updateCurrentStop()
      const atRest = Math.abs(distanceLeft) < 0.4 && Math.abs(cam.velocity) < 2 && Math.abs(cam.panX) + Math.abs(cam.panY) < 0.6
      if (atRest) {
        Object.assign(cam, { distance: targetDistance.current, velocity: 0 })
        if (!isDragging.current) Object.assign(cam, { panX: 0, panY: 0 })
        drawCameraFrame()
        glideFrame.current = 0
        return
      }
      glideFrame.current = requestAnimationFrame(step)
    }
    glideFrame.current = requestAnimationFrame(step)
  }, [drawCameraFrame, updateCurrentStop])

  // Head for a stop (dots, pins, arrow keys)
  const travelToStop = useCallback(
    (stopIndex) => {
      if (stopIndex < 0 || stopIndex >= stopDistances.length || isLeaving.current) return
      targetDistance.current = stopDistances[stopIndex]
      setHasMoved(true)
      glideToTarget()
    },
    [glideToTarget]
  )

  // Animate the + / − zoom (and optionally pan back to the route) over 350ms
  const animateUserZoom = useCallback(
    (targetZoom, resetPan) => {
      const cam = camera.current
      const startZoom = cam.userZoom
      const startPan = { x: cam.panX, y: cam.panY }
      const startTime = performance.now()
      cancelAnimationFrame(zoomFrame.current)
      const step = (now) => {
        const progress = reducedMotion.current ? 1 : Math.min(1, (now - startTime) / 350)
        const eased = easeInOutCubic(progress)
        cam.userZoom = startZoom + (targetZoom - startZoom) * eased
        if (resetPan) {
          cam.panX = startPan.x * (1 - eased)
          cam.panY = startPan.y * (1 - eased)
        }
        drawCameraFrame()
        if (progress < 1) zoomFrame.current = requestAnimationFrame(step)
      }
      zoomFrame.current = requestAnimationFrame(step)
    },
    [drawCameraFrame]
  )
  const zoomBy = useCallback(
    (factor) => {
      if (isLeaving.current) return
      animateUserZoom(Math.min(2.4, Math.max(0.45, camera.current.userZoom * factor)), false)
    },
    [animateUserZoom]
  )
  const recenter = useCallback(() => animateUserZoom(1, true), [animateUserZoom])

  // First frame, and redraw when the window is resized
  useLayoutEffect(() => {
    reducedMotion.current = prefersReducedMotion()
    drawCameraFrame()
    window.addEventListener('resize', drawCameraFrame)
    return () => {
      window.removeEventListener('resize', drawCameraFrame)
      stopGlide()
      cancelAnimationFrame(zoomFrame.current)
    }
  }, [drawCameraFrame, stopGlide])

  return {
    camera,
    targetDistance,
    currentStopIndex,
    hasMoved,
    setHasMoved,
    isLeaving,
    isDragging,
    reducedMotion,
    zoomFrame,
    refs,
    drawCameraFrame,
    updateCurrentStop,
    stopGlide,
    glideToTarget,
    travelToStop,
    zoomBy,
    recenter,
  }
}
