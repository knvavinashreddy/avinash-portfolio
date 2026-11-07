// Connects the lo-fi player to the page.
// Returns { isMusicPlaying, toggleMusic }. Both the top-bar record button and the hero
// headphones use the same toggle, so they always agree.
// On every kick drum, a "lofi-kick-drum" event is sent to the window; the hero listens for it.

import { useEffect, useRef, useState } from 'react'
import { createLofiPlayer } from './lofiPlayer'

export const KICK_DRUM_EVENT = 'lofi-kick-drum'

export function useLofiMusic() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const player = useRef(null)

  // stop the music if the page goes away
  useEffect(() => () => player.current?.stop(), [])

  const toggleMusic = () => {
    // the player is created on first use: browsers only allow audio after a click
    if (!player.current) {
      player.current = createLofiPlayer({ onKickDrum: () => window.dispatchEvent(new Event(KICK_DRUM_EVENT)) })
    }
    if (isMusicPlaying) {
      player.current.stop()
      setIsMusicPlaying(false)
    } else if (player.current.start()) {
      setIsMusicPlaying(true)
    }
  }

  return { isMusicPlaying, toggleMusic }
}
