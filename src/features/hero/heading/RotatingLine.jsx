// "I build RAG systems." — the bold phrase changes every 2.6 seconds.
//
// The phrase element gets key={phraseIndex}, so React replaces it with a fresh element each
// time; that restarts its CSS entrance animation (RotatingLine.css). Screen readers get the
// full headline once instead of a changing sentence. Reduced motion: the phrase stays still.

import { useEffect, useState } from 'react'
import { profile } from '../../../data/profile'
import { prefersReducedMotion } from '../../../shared/motion/motion'
import './RotatingLine.css'

const ROTATING_BUILD_PHRASES = ['RAG systems', 'MERN apps', 'n8n automations', 'AI that answers the question you actually asked']
const SECONDS_PER_PHRASE = 2.6

export default function RotatingLine() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const timer = setInterval(() => setPhraseIndex((i) => (i + 1) % ROTATING_BUILD_PHRASES.length), SECONDS_PER_PHRASE * 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className="hero-rotating-line">
      <span className="visually-hidden">{profile.headline}</span>
      <span aria-hidden="true">
        I build{' '}
        <span className="hero-rotating-phrase">
          <strong key={phraseIndex}>{ROTATING_BUILD_PHRASES[phraseIndex]}</strong>
        </span>
        .
      </span>
    </p>
  )
}
