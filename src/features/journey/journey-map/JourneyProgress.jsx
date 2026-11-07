// Bottom bar of the map: ↑ / ↓ buttons, one dot per stop, and the current stop's year and place.
// The arrows at the ends leave the map (same as scrolling past the ends).

import { journeyStops } from '../../../data/journeyStops'
import './JourneyProgress.css'

export default function JourneyProgress({ currentStopIndex, onTravelOneStop, onDotClick }) {
  const stop = journeyStops[currentStopIndex]
  const lastStopIndex = journeyStops.length - 1
  return (
    <div className="journey-progress">
      <button
        className="journey-progress-step"
        onClick={() => onTravelOneStop(-1)}
        aria-label={currentStopIndex === 0 ? 'Leave the map, back to the journey section' : 'Previous stop'}
      >
        ↑
      </button>
      <ol className="journey-progress-dots">
        {journeyStops.map((dotStop, i) => (
          <li key={dotStop.id}>
            <button
              className={i === currentStopIndex ? 'is-current' : i < currentStopIndex ? 'is-done' : ''}
              style={{ '--stop-color': dotStop.color }}
              onClick={() => onDotClick(i)}
              aria-label={`${dotStop.org}, ${dotStop.when}`}
              aria-current={i === currentStopIndex ? 'step' : undefined}
            />
          </li>
        ))}
      </ol>
      <span className="journey-progress-label">{stop.when} · {stop.place.split(',')[0]}</span>
      <button
        className="journey-progress-step"
        onClick={() => onTravelOneStop(1)}
        aria-label={currentStopIndex === lastStopIndex ? 'Leave the map, on to my projects' : 'Next stop'}
      >
        ↓
      </button>
    </div>
  )
}
