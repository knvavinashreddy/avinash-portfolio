// The yellow headphones in my photo are a play button: an invisible button sits over them.
// Also renders the spot where ♪ notes start, and the handwritten hint next to it.

import './HeadphonesButton.css'

export default function HeadphonesButton({ isMusicPlaying, onToggleMusic, musicNotesRef }) {
  return (
    <>
      <button
        type="button"
        className="headphones-button"
        onClick={onToggleMusic}
        aria-pressed={isMusicPlaying}
        aria-label={isMusicPlaying ? 'Stop the lo-fi music' : 'Play some lo-fi music'}
      >
        <span className="headphones-hint-ring" aria-hidden="true" />
      </button>
      <span className="music-notes" ref={musicNotesRef} aria-hidden="true" />
      <p className="hero-handwritten-note handwritten" aria-hidden="true">
        {isMusicPlaying ? 'now playing: lo-fi, made in code ♪' : 'psst, tap my headphones ↙'}
      </p>
    </>
  )
}
