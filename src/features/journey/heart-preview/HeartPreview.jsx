// The small heart map on the page: the map world, one pin per stop, and the
// "View journey map" button. Clicking a pin or the button opens the full-screen map.

import { journeyStops } from '../../../data/journeyStops'
import { stopLabelSides, stopPositions } from '../heart/heartShape'
import MapWorld from '../map-world/MapWorld'
import PreviewPin from './PreviewPin'
import './HeartPreview.css'

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  )
}

// onOpenMap(stopIndex) opens the full map at that stop; openButtonRef lets Journey refocus the button later
export default function HeartPreview({ onOpenMap, openButtonRef }) {
  return (
    <div className="heart-preview">
      {/* viewBox crops the 1800×1300 map world to just around the heart */}
      <svg className="heart-preview-map" viewBox="300 70 1400 1170" role="group" aria-label="My journey from Bhimavaram to Tumakuru to Hyderabad, drawn as a heart">
        <MapWorld isPreview />
        {journeyStops.map((stop, i) => (
          <PreviewPin key={stop.id} stop={stop} position={stopPositions[i]} labelSide={stopLabelSides[i]} onOpen={() => onOpenMap(i)} />
        ))}
      </svg>
      <button className="heart-preview-open-button" ref={openButtonRef} onClick={() => onOpenMap(0)}>
        <MapIcon />
        View journey map
      </button>
    </div>
  )
}
