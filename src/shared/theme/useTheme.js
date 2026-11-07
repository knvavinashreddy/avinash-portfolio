// Day / Night theme.
// The choice is written to <html data-theme="light|dark">, which tokens.css reads,
// and remembered in localStorage for the next visit.
// Returns { theme, toggleTheme }.

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function getStartingTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage blocked: fall back to the device setting */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getStartingTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* storage blocked: the theme just won't be remembered */
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
