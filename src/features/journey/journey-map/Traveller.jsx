// The traveller: a pulsing circle with an arrow that points along the heart.
// Position and arrow angle are set every frame by the camera (drawCameraFrame).

import './Traveller.css'

export default function Traveller({ travellerRef, travellerArrowRef }) {
  return (
    <div className="traveller" ref={travellerRef} aria-hidden="true">
      <span className="traveller-pulse" />
      <span className="traveller-arrow" ref={travellerArrowRef}>
        <svg viewBox="0 0 24 24"><path d="M4 4 L21 12 L4 20 L8 12Z" /></svg>
      </span>
    </div>
  )
}
