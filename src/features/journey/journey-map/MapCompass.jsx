// Compass in the corner. The needle is rotated every frame by the camera to point along the heart.

import './MapCompass.css'

export default function MapCompass({ compassNeedleRef }) {
  return (
    <div className="map-compass" aria-hidden="true">
      <span className="compass-north">N</span>
      <span className="compass-east">E</span>
      <span className="compass-south">S</span>
      <span className="compass-west">W</span>
      <span className="map-compass-needle" ref={compassNeedleRef} />
    </div>
  )
}
