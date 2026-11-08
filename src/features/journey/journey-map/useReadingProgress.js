// A thin line along the top of the story card that fills as you scroll through the story.
//
// How: we write two things on the scrolling panel —
//   --reading-progress   0 → 1, how far down the story you are
//   .has-more-to-read    only when the story is longer than the card (otherwise no line)
// StoryCard.css draws the line from those. Updated on scroll, when the stop changes,
// and when the window is resized.

import { useCallback, useLayoutEffect } from 'react'

export function useReadingProgress(panelRef, stopId) {
  const updateProgress = useCallback(() => {
    const panel = panelRef.current
    if (!panel) return
    const scrollableDistance = panel.scrollHeight - panel.clientHeight
    const hasMoreToRead = scrollableDistance > 2
    panel.classList.toggle('has-more-to-read', hasMoreToRead)
    panel.style.setProperty('--reading-progress', hasMoreToRead ? (panel.scrollTop / scrollableDistance).toFixed(3) : '1')
  }, [panelRef])

  // a new stop means a new panel: measure it
  useLayoutEffect(() => {
    updateProgress()
    window.addEventListener('resize', updateProgress)
    return () => window.removeEventListener('resize', updateProgress)
  }, [stopId, updateProgress])

  return { onPanelScroll: updateProgress }
}
