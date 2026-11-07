// One pin per stop on the full-screen map. Their screen positions are set every frame by
// the camera (drawCameraFrame), so React only renders them once and when the current stop changes.
// The current stop's pin is bigger with a filled label; stops not reached yet are faded.

import { journeyStops } from '../../../data/journeyStops'
import { stopLabelSides } from '../heart/heartShape'
import './MapPins.css'

export default function MapPins({ currentStopIndex, pinElements, onPinClick }) {
  return journeyStops.map((stop, i) => {
    const progressClass = i === currentStopIndex ? 'is-active' : i < currentStopIndex ? 'is-past' : 'is-future'
    const labelClass = stopLabelSides[i] === 'below' ? 'has-label-below' : 'has-label-right'
    return (
      <button
        key={stop.id}
        ref={(element) => (pinElements.current[i] = element)}
        className={`map-pin ${labelClass} ${progressClass}`}
        style={{ '--stop-color': stop.color, '--stop-text-color': stop.dark ? '#2d1218' : '#fff' }}
        onClick={() => onPinClick(i)}
        aria-label={`Go to ${stop.org}, ${stop.when}`}
      >
        <span className="map-pin-head">
          <span className="map-pin-badge">{stop.badge}</span>
        </span>
        <span className="map-pin-label">{stop.short}</span>
      </button>
    )
  })
}
