// Guestbook notes are saved in this visitor's browser only (localStorage).
// To make them public for every visitor, swap loadNotes / saveNotes for calls to a small
// Express + MongoDB API. See README.

const STORAGE_KEY = 'wall-notes' // kept from the first version, so existing notes still load
export const NOTE_COLORS = ['blush', 'mint', 'lilac', 'powder'] // no ice: the guestbook is Ice Blue by day
// notes saved by earlier versions used other colour names; map them to today's
const OLD_COLOR_NAMES = {
  n1: 'ice', n2: 'powder', n3: 'mint', n4: 'blush',
  mustard: 'ice', 'light-blue': 'powder', lime: 'mint', rose: 'blush',
}

const FIRST_NOTE = [{ name: 'Avinash', role: 'Owner of this wall', text: 'First note on my own wall. Your turn.', color: 'blush', at: 0 }]

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
