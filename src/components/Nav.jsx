import photo from '../assets/avinash.jpg'
import { links, profile } from '../data'

export default function Nav({ theme, onToggleTheme, playing, onToggleMusic }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand">
          <img src={photo} alt="" />
          <span>{profile.short}</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#journey">Journey</a>
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href="#life">About</a>
          <a href="#hello">Contact</a>
          <a href={links.resume} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
        <div className="nav-actions">
          <button
            className={`icon-btn record ${playing ? 'is-playing' : ''}`}
            onClick={onToggleMusic}
            aria-pressed={playing}
            aria-label={playing ? 'Stop music' : 'Play some music'}
            title={playing ? 'Stop music' : 'Play some music'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3.2" className="label" />
              <circle cx="12" cy="12" r="6.5" className="groove" />
            </svg>
          </button>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} mode`}
          >
            <span className={theme === 'light' ? 'on' : ''}>Day</span>
            <span className={theme === 'dark' ? 'on' : ''}>Night</span>
          </button>
        </div>
      </div>
    </header>
  )
}
