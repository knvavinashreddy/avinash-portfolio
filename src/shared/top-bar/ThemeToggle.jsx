// Day / Night switch. The selected side is highlighted.

import './ThemeToggle.css'

export default function ThemeToggle({ theme, onToggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} mode`}
    >
      <span className={theme === 'light' ? 'is-selected' : ''}>Day</span>
      <span className={theme === 'dark' ? 'is-selected' : ''}>Night</span>
    </button>
  )
}
