// My cut-out photo standing in front of the Mustard Oil sun.
// On top of it: the headphones music button and the two hero buttons.
// While music plays, useBeatEffects makes the sun thump and notes float up on every kick drum.

import { useRef } from 'react'
import cutoutPhoto from '../../../assets/avinash-cutout.png'
import HeadphonesButton from './HeadphonesButton'
import HeroButtons from './HeroButtons'
import { useBeatEffects } from './useBeatEffects'
import './HeroPortrait.css'

export default function HeroPortrait({ isMusicPlaying, onToggleMusic }) {
  const sun = useRef(null)
  const musicNotes = useRef(null)
  useBeatEffects({ isMusicPlaying, sunRef: sun, musicNotesRef: musicNotes })

  return (
    <div className="hero-portrait">
      <span className="hero-sun" ref={sun} aria-hidden="true" />
      <img
        className="hero-photo"
        src={cutoutPhoto}
        alt="Avinash in yellow sunglasses and yellow headphones, wearing a navy blazer"
        width="720"
        height="720"
        fetchPriority="high"
      />
      <HeadphonesButton isMusicPlaying={isMusicPlaying} onToggleMusic={onToggleMusic} musicNotesRef={musicNotes} />
      <HeroButtons />
    </div>
  )
}
