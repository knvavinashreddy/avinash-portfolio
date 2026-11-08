// Form to pin a note: name, what you do (optional), and the note (max 200 characters).
// Name and note are required; the form is cleared after pinning.

import { useState } from 'react'
import './GuestbookForm.css'

const MAX_NOTE_LENGTH = 200

export default function GuestbookForm({ onPinNote }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim() || !text.trim()) {
      setError('Add your name and a note to pin it.')
      return
    }
    onPinNote({ name: name.trim(), role: role.trim(), text: text.trim() })
    setName('')
    setRole('')
    setText('')
    setError('')
  }

  return (
    <form className="guestbook-form section-card card-glow" onSubmit={submit} noValidate>
      <label>
        Your name
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
      </label>
      <label>
        <span>What you do <span className="guestbook-optional">optional</span></span>
        <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={50} />
      </label>
      <label>
        Your note
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX_NOTE_LENGTH} rows={4} />
        <span className="guestbook-character-count">{text.length} / {MAX_NOTE_LENGTH}</span>
      </label>
      {error && <p className="guestbook-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit">Pin it to the wall</button>
    </form>
  )
}
