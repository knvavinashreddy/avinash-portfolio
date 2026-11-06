import { useEffect, useState } from 'react'

// Notes are saved in this browser only (localStorage).
// To make them public for every visitor, swap load/save for a small
// Express + MongoDB API or Firebase. See README.
const KEY = 'wall-notes'
const COLORS = ['n1', 'n2', 'n3', 'n4']
const SEED = [{ name: 'Avinash', role: 'Owner of this wall', text: 'First note on my own wall. Your turn.', color: 'n1', at: 0 }]

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : SEED
  } catch {
    return SEED
  }
}

export default function Wall() {
  const [notes, setNotes] = useState(load)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(notes))
    } catch {
      /* storage unavailable: notes live for this visit only */
    }
  }, [notes])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) {
      setError('Add your name and a note to pin it.')
      return
    }
    setNotes((n) => [{ name: name.trim(), role: role.trim(), text: text.trim(), color: COLORS[n.length % 4], at: Date.now() }, ...n])
    setName('')
    setRole('')
    setText('')
    setError('')
  }

  return (
    <section id="wall" aria-labelledby="wall-title">
      <div className="wrap">
        <h2 id="wall-title">Before you go, leave a note.</h2>
        <p className="lede">Say hi, share feedback, or tell me what you’re building.</p>

        <div className="wall">
          <form className="wall-form" onSubmit={submit} noValidate>
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            </label>
            <label>
              <span>What you do <span className="opt">optional</span></span>
              <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={50} />
            </label>
            <label>
              Your note
              <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={200} rows={4} />
              <span className="count">{text.length} / 200</span>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary" type="submit">Pin it to the wall</button>
          </form>

          <ul className="wall-grid">
            {notes.map((n, i) => (
              <li key={n.at + '-' + i} className={`note ${n.color}`} style={{ '--rot': `${((i % 3) - 1) * 1.5}deg` }}>
                <p>{n.text}</p>
                <strong>{n.name}</strong>
                {n.role && <span>{n.role}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
