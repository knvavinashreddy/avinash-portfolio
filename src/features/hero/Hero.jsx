// Hero: the first section on the page.
//
//   HeroHeading   "AI BUILDER · …", "Hey, I'm Avinash.", and the rotating "I build …" line
//   hero stage
//     ProofChips    small floating proof chips around the sun
//     HeroPortrait  my photo on the sapphire sun, headphones = music button, two buttons
//
// useMouseDepth makes the layers drift with the mouse; the music state comes from App.

import { useRef } from 'react'
import HeroHeading from './heading/HeroHeading'
import HeroPortrait from './portrait/HeroPortrait'
import ProofChips from './proof-chips/ProofChips'
import { useMouseDepth } from './useMouseDepth'
import './Hero.css'

export default function Hero({ isMusicPlaying, onToggleMusic }) {
  const heroSection = useRef(null)
  useMouseDepth(heroSection)

  return (
    <section className={`hero ${isMusicPlaying ? 'is-playing' : ''}`} ref={heroSection} aria-labelledby="hero-title">
      <HeroHeading />
      <div className="hero-stage">
        <ProofChips />
        <HeroPortrait isMusicPlaying={isMusicPlaying} onToggleMusic={onToggleMusic} />
      </div>
    </section>
  )
}
