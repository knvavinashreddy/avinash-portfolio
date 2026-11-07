// Pinned notes as a grid of sticky notes, each tilted a little differently.

import '../../shared/sticky-note/StickyNote.css'
import './GuestbookNotes.css'

export default function GuestbookNotes({ notes }) {
  return (
    <ul className="guestbook-notes">
      {notes.map((note, i) => (
        <li
          key={note.at + '-' + i}
          className={`sticky-note sticky-note-${note.color}`}
          style={{ '--tilt-angle': `${((i % 3) - 1) * 1.5}deg` }} // −1.5°, 0°, +1.5°, repeating
        >
          <p>{note.text}</p>
          <strong>{note.name}</strong>
          {note.role && <span>{note.role}</span>}
        </li>
      ))}
    </ul>
  )
}
