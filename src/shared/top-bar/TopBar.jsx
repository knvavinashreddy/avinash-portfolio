// Top bar: my avatar and name (links to the top), a live status line,
// and on the right the music button and the Day/Night switch.

import avatarPhoto from '../../assets/avinash.jpg'
import { profile } from '../../data/profile'
import MusicToggle from './MusicToggle'
import ThemeToggle from './ThemeToggle'
import './TopBar.css'

export default function TopBar({ theme, onToggleTheme, isMusicPlaying, onToggleMusic }) {
  return (
    <header className="top-bar">
      <div className="page-container top-bar-inner">
        <a href="#top" className="top-bar-brand">
          <img src={avatarPhoto} alt="" />
          <span>{profile.short}</span>
        </a>
        <span className="top-bar-status">
          <i aria-hidden="true" /> Building AI in Hyderabad
        </span>
        <div className="top-bar-actions">
          <MusicToggle isMusicPlaying={isMusicPlaying} onToggleMusic={onToggleMusic} />
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </header>
  )
}
