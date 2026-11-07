// Which section is the visitor reading right now?
// Answer: the last section whose top has scrolled past the middle of the screen.
// At the very bottom of the page the last section wins (it may never reach the middle).
// Returns that section's id. Checked at most once per frame while scrolling.

import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0])

  useEffect(() => {
    let animationFrame = 0
    const findActiveSection = () => {
      animationFrame = 0
      const middleOfScreen = window.innerHeight * 0.5
      let current = sectionIds[0]
      for (const id of sectionIds.slice(1)) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= middleOfScreen) current = id
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = sectionIds[sectionIds.length - 1]
      setActiveSectionId(current)
    }
    const onScroll = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(findActiveSection)
    }

    findActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // the list of ids never changes while the page is open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return activeSectionId
}
