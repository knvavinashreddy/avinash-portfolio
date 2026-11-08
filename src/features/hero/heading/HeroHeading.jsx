// Hero heading: small label, my name with a powder-blue full stop, and the rotating "I build …" line.

import { profile } from '../../../data/profile'
import RotatingLine from './RotatingLine'
import './HeroHeading.css'

export default function HeroHeading() {
  return (
    <div className="page-container hero-heading">
      <p className="hero-label">
        AI builder<span className="hero-label-location"> · Bhimavaram → Hyderabad</span>
      </p>
      <h1 id="hero-title">
        Hey, I’m {profile.short}
        <span className="hero-name-dot" aria-hidden="true">.</span>
      </h1>
      <RotatingLine />
    </div>
  )
}
