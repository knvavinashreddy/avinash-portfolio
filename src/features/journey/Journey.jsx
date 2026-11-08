// Journey section: heading, the small heart preview, and the full-screen map when it's open.
//
// Opening:  a preview pin or the button sets openAtStop → <JourneyMap> appears.
// Closing:  "Back to site" / Esc → the map closes and focus returns to the button.
// Leaving:  scrolling past the first or last stop → the map closes and the page glides to
//           the top of this section (going back) or to the Work section (going forward).

import { useRef, useState } from 'react'
import { journeyIntro } from '../../data/journeyStops'
import { scrollToSection } from '../../shared/scroll/scrollToSection'
import HeartPreview from './heart-preview/HeartPreview'
import JourneyMap from './journey-map/JourneyMap'
import './Journey.css'

export default function Journey({ theme, onToggleTheme }) {
  const [openAtStop, setOpenAtStop] = useState(null) // null = map closed
  const openMapButton = useRef(null)

  const closeMap = () => {
    openMapButton.current?.focus({ preventScroll: true })
    setOpenAtStop(null)
  }

  // direction: +1 = past the last stop, -1 = before the first stop
  const leaveMap = (direction) => {
    setOpenAtStop(null)
    const destination = direction > 0 ? document.getElementById('work') : document.getElementById('journey')
    if (direction < 0) openMapButton.current?.focus({ preventScroll: true })
    // wait for the map to unmount and give page scrolling back, then glide there
    setTimeout(() => scrollToSection(destination, { duration: 900 }), 30)
  }

  return (
    <section id="journey" className="journey section-theme-blue" aria-labelledby="journey-title">
      <div className="page-container journey-heading">
        <p className="section-label">01 · The journey</p>
        <h2 id="journey-title">{journeyIntro.title}</h2>
        <p className="section-intro">{journeyIntro.text}</p>
      </div>

      <div className="page-container">
        <HeartPreview onOpenMap={setOpenAtStop} openButtonRef={openMapButton} />
      </div>

      {openAtStop !== null && (
        <JourneyMap startAtStop={openAtStop} onClose={closeMap} onLeave={leaveMap} theme={theme} onToggleTheme={onToggleTheme} />
      )}
    </section>
  )
}
