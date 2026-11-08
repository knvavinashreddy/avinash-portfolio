// While music plays, on every kick drum:
//   1. the sun "thumps" (grows 4.5% and settles back)
//   2. a powder-blue ring ripples out from the sun and fades
//   3. a ♪ or ♫ floats up from the headphones and fades
// The lo-fi player sends a window event on each kick (shared/music/useLofiMusic.js).
// Effects 2 and 3 create a temporary element, animate it with element.animate(),
// and remove it when the animation finishes.

import { useEffect } from 'react'
import { KICK_DRUM_EVENT } from '../../../shared/music/useLofiMusic'
import { prefersReducedMotion } from '../../../shared/motion/motion'

function thumpSun(sun) {
  sun.animate([{ scale: 1.045 }, { scale: 1 }], { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' })
}

function rippleRingFromSun(sun) {
  const ring = document.createElement('span')
  ring.className = 'beat-ring'
  sun.parentElement.appendChild(ring)
  ring.animate(
    [
      { opacity: 0.55, transform: 'translateX(-50%) scale(1)' },
      { opacity: 0, transform: 'translateX(-50%) scale(1.22)' },
    ],
    { duration: 1400, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  ).onfinish = () => ring.remove()
}

function floatMusicNote(musicNotes) {
  const note = document.createElement('span')
  note.className = 'music-note'
  note.textContent = Math.random() < 0.5 ? '♪' : '♫'
  musicNotes.appendChild(note)
  const driftSideways = (Math.random() - 0.3) * 90 // mostly to the right
  note.animate(
    [
      { opacity: 0, transform: 'translate(0, 0) rotate(0deg) scale(0.6)' },
      { opacity: 1, offset: 0.15 },
      { opacity: 0, transform: `translate(${driftSideways}px, -150px) rotate(${driftSideways / 3}deg) scale(1.1)` },
    ],
    { duration: 2200, easing: 'ease-out' }
  ).onfinish = () => note.remove()
}

export function useBeatEffects({ isMusicPlaying, sunRef, musicNotesRef }) {
  useEffect(() => {
    if (!isMusicPlaying || prefersReducedMotion()) return
    const onKickDrum = () => {
      const sun = sunRef.current
      if (!sun) return
      thumpSun(sun)
      rippleRingFromSun(sun)
      if (musicNotesRef.current) floatMusicNote(musicNotesRef.current)
    }
    window.addEventListener(KICK_DRUM_EVENT, onKickDrum)
    return () => window.removeEventListener(KICK_DRUM_EVENT, onKickDrum)
  }, [isMusicPlaying, sunRef, musicNotesRef])
}
