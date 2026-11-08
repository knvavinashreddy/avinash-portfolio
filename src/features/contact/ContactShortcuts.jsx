// Five contact cards, each showing its keyboard key.

import { contactShortcuts, isEmailLink } from './contactLinks'
import { useContactKeyboardShortcuts } from './useContactKeyboardShortcuts'
import './ContactShortcuts.css'

export default function ContactShortcuts() {
  useContactKeyboardShortcuts()
  return (
    <ul className="contact-shortcuts">
      {contactShortcuts.map((shortcut) => (
        <li key={shortcut.key}>
          <a
            className="section-card card-glow"
            href={shortcut.href}
            target={isEmailLink(shortcut.href) ? undefined : '_blank'}
            rel="noreferrer"
          >
            <kbd>{shortcut.key}</kbd>
            <strong>{shortcut.title}</strong>
            <span>{shortcut.text}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
