// Top of the full-screen map: "← Back to site" and a Day/Night button.

import './MapTopBar.css'

export default function MapTopBar({ onClose, closeButtonRef, theme, onToggleTheme }) {
  return (
    <div className="map-top-bar">
      <button className="map-top-button" onClick={onClose} ref={closeButtonRef}>
        <span aria-hidden="true">←</span> Back to site
      </button>
      <button className="map-top-button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} mode`}>
        {theme === 'dark' ? '☀ Day' : '☾ Night'}
      </button>
    </div>
  )
}
