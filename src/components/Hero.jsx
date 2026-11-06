import cutout from '../assets/avinash-cutout.png'
import { profile } from '../data'
import { scrollToSection } from '../lib/scroll'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Play() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  )
}

const go = (id) => (e) => {
  e.preventDefault()
  scrollToSection(document.getElementById(id), { duration: 900 })
}

// First thing on the page: who I am, big, with me in front of a Mustard Oil sun
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-copy">
        <p className="hero-eyebrow">AI builder<span className="hero-eyebrow-loc"> · Bhimavaram → Hyderabad</span></p>
        <h1 id="hero-title">
          Hey, I’m {profile.short}<span className="hero-dot" aria-hidden="true">.</span>
        </h1>
        <p className="hero-sub">{profile.headline}</p>
      </div>

      <div className="hero-figure">
        <span className="hero-sun" aria-hidden="true" />
        <img
          className="hero-photo"
          src={cutout}
          alt="Avinash in yellow sunglasses and yellow headphones, wearing a navy blazer"
          width="720"
          height="720"
          fetchPriority="high"
        />
        <p className="hero-note hand" aria-hidden="true">{profile.photoNote} ↓</p>
        <div className="hero-ctas">
          <a className="hero-btn hero-btn-primary" href="#work" onClick={go('work')}>
            See my work <Arrow />
          </a>
          <a className="hero-btn hero-btn-ghost" href="#journey" onClick={go('journey')}>
            <Play /> Walk my journey
          </a>
        </div>
      </div>
    </section>
  )
}
