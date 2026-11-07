// Guestbook notes are saved in this visitor's browser only (localStorage).
// To make them public for every visitor, swap loadNotes / saveNotes for calls to a small
// Express + MongoDB API. See README.

const STORAGE_KEY = 'wall-notes' // kept from the first version, so existing notes still load
export const NOTE_COLORS = ['mustard', 'light-blue', 'lime', 'rose']
// notes saved before the rename used n1…n4
const OLD_COLOR_NAMES = { n1: 'mustard', n2: 'light-blue', n3: 'lime', n4: 'rose' }

const FIRST_NOTE = [{ name: 'Avinash', role: 'Owner of this wall', text: 'First note on my own wall. Your turn.', color: 'mustard', at: 0 }]

export function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return FIRST_NOTE
    return JSON.parse(saved).map((note) => ({ ...note, color: OLD_COLOR_NAMES[note.color] || note.color }))
  } catch {
    return FIRST_NOTE
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    /* storage unavailable: notes live for this visit only */
  }
}
