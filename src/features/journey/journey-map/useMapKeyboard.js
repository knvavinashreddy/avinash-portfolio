// Keyboard on the full-screen map:
//   ↓ → PageDown Space   next stop (past the last one: leave the map)
//   ↑ ← PageUp           previous stop (before the first one: leave the map)
//   Esc                  close the map
//   + / −                zoom
// Holding a key down never leaves the map; only a fresh press does.

import { useEffect } from 'react'
import { findNearestStop, stopDistances } from '../heart/heartShape'

const NEXT_KEYS = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
const PREVIOUS_KEYS = ['ArrowUp', 'ArrowLeft', 'PageUp']

export function useMapKeyboard({ travelOneStop, targetDistance, onClose, zoomBy }) {
  useEffect(() => {
    const lastStopIndex = stopDistances.length - 1
    const onKeyDown = (event) => {
      const headingFor = findNearestStop(targetDistance.current)
      if (NEXT_KEYS.includes(event.key)) {
        event.preventDefault()
        if (!event.repeat || headingFor < lastStopIndex) travelOneStop(1)
      } else if (PREVIOUS_KEYS.includes(event.key)) {
        event.preventDefault()
        if (!event.repeat || headingFor > 0) travelOneStop(-1)
      } else if (event.key === 'Escape') onClose()
      else if (event.key === '+' || event.key === '=') zoomBy(1.25)
      else if (event.key === '-') zoomBy(0.8)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [travelOneStop, targetDistance, onClose, zoomBy])
}
