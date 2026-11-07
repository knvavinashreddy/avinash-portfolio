// The record button: starts / stops the lo-fi music and spins while it plays.

import './MusicToggle.css'

export default function MusicToggle({ isMusicPlaying, onToggleMusic }) {
  const label = isMusicPlaying ? 'Stop music' : 'Play some music'
  return (
    <button
      className={`top-bar-icon-button music-toggle ${isMusicPlaying ? 'is-playing' : ''}`}
      onClick={onToggleMusic}
      aria-pressed={isMusicPlaying}
      aria-label={label}
      title={label}
    >
      {/* a vinyl record: the disc, the label in the middle, one faint groove */}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3.2" className="music-toggle-label" />
        <circle cx="12" cy="12" r="6.5" className="music-toggle-groove" />
      </svg>
    </button>
  )
}
