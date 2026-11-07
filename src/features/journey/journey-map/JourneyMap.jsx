// Full-screen journey map. This file only puts the pieces together.
//
//   useMapCamera          where the camera is, how to draw it, the spring glide, zoom
//   useLeaveMapAnimation  pull back to the whole heart, then leave
//   useScrollTravel       1:1 scrolling along the heart + the "keep scrolling" bar
//   useMapKeyboard        arrow keys, Esc, + / −
//   useDragToLook         drag the map aside
//
//   [viewport]  the map world layer (moved by the camera) + pins + traveller
//   MapTopBar · MapCompass · ZoomControls · StoryCard · JourneyProgress · scroll hint · ExitBar

import { useCallback, useLayoutEffect, useRef } from 'react'
import { journeyStops } from '../../../data/journeyStops'
import { MAP_WORLD, findNearestStop } from '../heart/heartShape'
import MapWorld from '../map-world/MapWorld'
import ExitBar from './ExitBar'
import JourneyProgress from './JourneyProgress'
import MapCompass from './MapCompass'
import MapPins from './MapPins'
import MapTopBar from './MapTopBar'
import StoryCard from './StoryCard'
import Traveller from './Traveller'
import ZoomControls from './ZoomControls'
import { useDragToLook } from './useDragToLook'
import { useLeaveMapAnimation } from './useLeaveMapAnimation'
import { useMapCamera } from './useMapCamera'
import { useMapKeyboard } from './useMapKeyboard'
import { useScrollTravel } from './useScrollTravel'
import './JourneyMap.css'

const LAST_STOP_INDEX = journeyStops.length - 1

export default function JourneyMap({ startAtStop = 0, onClose, onLeave, theme, onToggleTheme }) {
  const mapRoot = useRef(null)
  const storyCard = useRef(null)
  const closeButton = useRef(null)

  const mapCamera = useMapCamera({ startAtStop })
  const { camera, targetDistance, currentStopIndex, hasMoved, isDragging, refs, drawCameraFrame, travelToStop, zoomBy, recenter } = mapCamera
  const { isExiting, leaveMap } = useLeaveMapAnimation(mapCamera, onLeave)

  // One stop forward or back, counted from the stop we're heading to (so quick presses queue up).
  // Past either end, leave the map.
  const travelOneStop = useCallback(
    (direction) => {
      const nextStop = findNearestStop(targetDistance.current) + direction
      if (nextStop < 0 || nextStop > LAST_STOP_INDEX) leaveMap(direction)
      else travelToStop(nextStop)
    },
    [targetDistance, leaveMap, travelToStop]
  )

  const exitProgress = useScrollTravel({ mapCamera, mapRootRef: mapRoot, storyCardRef: storyCard, leaveMap })
  useMapKeyboard({ travelOneStop, targetDistance, onClose, zoomBy })
  const dragHandlers = useDragToLook({ camera, isDragging, drawCameraFrame })

  // While the map is open: the page behind it can't scroll, and focus starts on "Back to site"
  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div className={`journey-map ${isExiting ? 'is-exiting' : ''}`} ref={mapRoot} role="dialog" aria-modal="true" aria-label="Journey map">
      <div className="journey-map-viewport" ref={refs.viewportRef} {...dragHandlers}>
        <div className="journey-map-world" ref={refs.worldLayerRef} style={{ width: MAP_WORLD.width, height: MAP_WORLD.height }}>
          <svg viewBox={`0 0 ${MAP_WORLD.width} ${MAP_WORLD.height}`} width={MAP_WORLD.width} height={MAP_WORLD.height} aria-hidden="true">
            <MapWorld travelledRouteRef={refs.travelledRouteRef} />
          </svg>
        </div>
        <div className="journey-map-pins">
          <MapPins currentStopIndex={currentStopIndex} pinElements={refs.pinElements} onPinClick={travelToStop} />
          <Traveller travellerRef={refs.travellerRef} travellerArrowRef={refs.travellerArrowRef} />
        </div>
      </div>

      <MapTopBar onClose={onClose} closeButtonRef={closeButton} theme={theme} onToggleTheme={onToggleTheme} />
      <MapCompass compassNeedleRef={refs.compassNeedleRef} />
      <ZoomControls onRecenter={recenter} onZoomBy={zoomBy} />
      <StoryCard stopIndex={currentStopIndex} storyCardRef={storyCard} />
      <JourneyProgress currentStopIndex={currentStopIndex} onTravelOneStop={travelOneStop} onDotClick={travelToStop} />

      {!hasMoved && currentStopIndex < LAST_STOP_INDEX && <p className="scroll-hint handwritten">scroll to travel</p>}
      <ExitBar exitProgress={exitProgress} isAtLastStop={currentStopIndex === LAST_STOP_INDEX} />
    </div>
  )
}
