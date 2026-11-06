import { useRef, useState } from 'react'
import { journeyIntro, journeyStops } from '../data'
import MapWorld, { stopPos, labelSide } from './MapWorld'
import JourneyMap from './JourneyMap'
import { scrollToSection } from '../lib/scroll'

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  )
}

export default function Journey({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(null)
  const ctaRef = useRef(null)
  const close = () => {
    ctaRef.current?.focus({ preventScroll: true })
    setOpen(null)
  }
  // Scrolled past an end of the heart: close the map and carry on down (or back up) the page
  const exitTo = (dir) => {
    setOpen(null)
    const target = dir > 0 ? document.getElementById('work') : document.getElementById('journey')
    if (dir < 0) ctaRef.current?.focus({ preventScroll: true })
    // wait for the map to unmount and give page scrolling back, then glide there
    setTimeout(() => scrollToSection(target, { duration: 900 }), 30)
  }

  return (
    <section id="journey" className="journey" aria-labelledby="journey-title">
      <div className="wrap journey-head">
        <p className="eyebrow">01 · The journey</p>
        <h2 id="journey-title">{journeyIntro.title}</h2>
        <p className="lede">{journeyIntro.text}</p>
      </div>

      <div className="wrap">
        <div className="jp">
          <svg className="jp-map" viewBox="300 70 1400 1170" role="group" aria-label="My journey from Bhimavaram to Tumakuru to Hyderabad, drawn as a heart">
            <MapWorld showTraveled />
            {journeyStops.map((s, i) => {
              const labelW = s.short.length * 17 + 34
              const below = labelSide[i] === 'below'
              return (
                <g
                  key={s.id}
                  className={`jp-pin ${s.upcoming ? 'is-upcoming' : ''}`}
                  transform={`translate(${stopPos[i].x} ${stopPos[i].y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open the map at ${s.org}, ${s.when}`}
                  onClick={() => setOpen(i)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(i))}
                >
                  <path className="jp-pin-shape" d="M0 0 C -10 -16, -32 -30, -32 -56 A32 32 0 1 1 32 -56 C 32 -30, 10 -16, 0 0Z" fill={s.color} />
                  <circle cx="0" cy="-56" r="23" className="jp-pin-face" />
                  <text x="0" y="-48" textAnchor="middle" className="jp-pin-badge" fill={s.dark ? '#6b5a14' : s.color}>{s.badge}</text>
                  {below ? (
                    <>
                      <rect x={-labelW / 2} y="14" width={labelW} height="50" rx="25" className="jp-label-bg" />
                      <text x="0" y="49" textAnchor="middle" className="jp-label">{s.short}</text>
                    </>
                  ) : (
                    <>
                      <rect x="42" y="-83" width={labelW} height="50" rx="25" className="jp-label-bg" />
                      <text x="59" y="-48" className="jp-label">{s.short}</text>
                    </>
                  )}
                </g>
              )
            })}
          </svg>
          <button className="jp-cta" ref={ctaRef} onClick={() => setOpen(0)}>
            <MapIcon />
            View journey map
          </button>
        </div>
      </div>

      {open !== null && (
        <JourneyMap startAt={open} onClose={close} onExit={exitTo} theme={theme} onToggleTheme={onToggleTheme} />
      )}
    </section>
  )
}
