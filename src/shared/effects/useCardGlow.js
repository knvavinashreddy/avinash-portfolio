// Cards with the class "card-glow" light up softly where the mouse is.
//
// How: one mouse listener for the whole page. On each frame it finds the card under the
// mouse and sets --glow-x / --glow-y on it; styles/effects.css draws a radial glow there.
// Only on devices with a real mouse (no hover on phones).

import { useEffect } from 'react'

export function useCardGlow() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let animationFrame = 0
    let latestMouseEvent = null

    const onMouseMove = (event) => {
      latestMouseEvent = event
      if (animationFrame) return // at most one update per frame
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0
        const card = latestMouseEvent.target.closest?.('.card-glow')
        if (!card) return
        const box = card.getBoundingClientRect()
        card.style.setProperty('--glow-x', `${latestMouseEvent.clientX - box.left}px`)
        card.style.setProperty('--glow-y', `${latestMouseEvent.clientY - box.top}px`)
      })
    }

    window.addEventListener('pointermove', onMouseMove, { passive: true })
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', onMouseMove)
    }
  }, [])
}
