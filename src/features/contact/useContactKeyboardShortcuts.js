// Press M, G, L, Y or R anywhere on the page to open that contact link.
// Ignored while typing in a form, with Cmd / Ctrl / Alt held, or while the journey map is open
// (the map uses the keyboard itself).

import { useEffect } from 'react'
import { contactShortcuts, isEmailLink } from './contactLinks'

export function useContactKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (event) => {
      const typing = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA'
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (document.querySelector('[aria-modal="true"]')) return // a full-screen dialog is open
      const shortcut = contactShortcuts.find((s) => s.key === event.key.toUpperCase())
      if (!shortcut) return
      if (isEmailLink(shortcut.href)) window.location.href = shortcut.href
      else window.open(shortcut.href, '_blank', 'noopener')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
