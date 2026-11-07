// Recenter / zoom in / zoom out. (Hidden on phones.)

import './ZoomControls.css'

export default function ZoomControls({ onRecenter, onZoomBy }) {
  return (
    <div className="zoom-controls">
      <button onClick={onRecenter} aria-label="Recenter on current stop">◎</button>
      <button onClick={() => onZoomBy(1.25)} aria-label="Zoom in">+</button>
      <button onClick={() => onZoomBy(0.8)} aria-label="Zoom out">−</button>
    </div>
  )
}
