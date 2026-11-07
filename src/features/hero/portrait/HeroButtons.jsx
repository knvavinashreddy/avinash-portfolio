// "See my work →" and "▶ Walk my journey". Both glide the page to their section.

import { scrollToSection } from '../../../shared/scroll/scrollToSection'
import './HeroButtons.css'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  )
}

// a normal link (works without JavaScript too), upgraded to the smooth glide
const glideTo = (sectionId) => (event) => {
  event.preventDefault()
  scrollToSection(document.getElementById(sectionId), { duration: 900 })
}

export default function HeroButtons() {
  return (
    <div className="hero-buttons">
      <a className="hero-button hero-button-primary" href="#work" onClick={glideTo('work')}>
        See my work <ArrowIcon />
      </a>
      <a className="hero-button hero-button-outline" href="#journey" onClick={glideTo('journey')}>
        <PlayIcon /> Walk my journey
      </a>
    </div>
  )
}
