// Guestbook: visitors pin a note (form on the left), notes appear on the right, newest first.

import { useEffect, useState } from 'react'
import GuestbookForm from './GuestbookForm'
import GuestbookNotes from './GuestbookNotes'
import { NOTE_COLORS, loadNotes, saveNotes } from './guestbookStorage'
import './Guestbook.css'

export default function Guestbook() {
  const [notes, setNotes] = useState(loadNotes)

  useEffect(() => saveNotes(notes), [notes])

  const pinNote = ({ name, role, text }) => {
    setNotes((current) => [{ name, role, text, color: NOTE_COLORS[current.length % NOTE_COLORS.length], at: Date.now() }, ...current])
  }

  return (
    <section id="guestbook" className="section-tone-ink" aria-labelledby="guestbook-title">
      <div className="page-container">
        <p className="section-label">06 · Guestbook</p>
        <h2 id="guestbook-title">Before you go, leave a note.</h2>
        <p className="section-intro">Say hi, share feedback, or tell me what you’re building.</p>
        <div className="guestbook-layout">
          <GuestbookForm onPinNote={pinNote} />
          <GuestbookNotes notes={notes} />
        </div>
      </div>
    </section>
  )
}
