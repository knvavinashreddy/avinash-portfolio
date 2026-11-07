// Floating navigation dock at the bottom of the screen.
// The highlight pill slides under the link for the section you're reading.

import { useLayoutEffect, useRef } from 'react'
import { links } from '../../data/links'
import { useActiveSection } from './useActiveSection'
import './SectionDock.css'

// section id on the page → label in the dock
const DOCK_LINKS = [
  { sectionId: 'top', label: 'Home' },
  { sectionId: 'journey', label: 'Journey' },
  { sectionId: 'work', label: 'Work' },
  { sectionId: 'toolkit', label: 'Stack' },
  { sectionId: 'off-the-clock', label: 'About' },
  { sectionId: 'contact', label: 'Contact' },
]
const SECTION_IDS = DOCK_LINKS.map((link) => link.sectionId)

export default function SectionDock() {
  const activeSectionId = useActiveSection(SECTION_IDS)
  const linkElements = useRef({})
  const highlight = useRef(null)
  const dockBar = useRef(null)

  // Move the highlight under the active link (and on phones, scroll the dock so it's in view)
  useLayoutEffect(() => {
    const placeHighlight = () => {
      const activeLink = linkElements.current[activeSectionId]
      if (!activeLink || !highlight.current) return
      highlight.current.style.width = `${activeLink.offsetWidth}px`
      highlight.current.style.transform = `translateX(${activeLink.offsetLeft}px)`
      const bar = dockBar.current
      if (bar && bar.scrollWidth > bar.clientWidth) {
        bar.scrollTo({ left: activeLink.offsetLeft - bar.clientWidth / 2 + activeLink.offsetWidth / 2, behavior: 'smooth' })
      }
    }
    placeHighlight()
    window.addEventListener('resize', placeHighlight)
    return () => window.removeEventListener('resize', placeHighlight)
  }, [activeSectionId])

  return (
    <nav className="section-dock" aria-label="Sections">
      <div className="section-dock-bar" ref={dockBar}>
        <span className="section-dock-highlight" ref={highlight} aria-hidden="true" />
        {DOCK_LINKS.map(({ sectionId, label }) => (
          <a
            key={sectionId}
            href={`#${sectionId}`}
            ref={(element) => (linkElements.current[sectionId] = element)}
            className={activeSectionId === sectionId ? 'is-active' : ''}
            aria-current={activeSectionId === sectionId ? 'true' : undefined}
          >
            {label}
          </a>
        ))}
        <a className="section-dock-resume" href={links.resume} target="_blank" rel="noreferrer">
          Resume <span aria-hidden="true">↗</span>
        </a>
      </div>
    </nav>
  )
}
