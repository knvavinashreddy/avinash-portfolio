// Floating proof chips around the sun. Hover for a tooltip, click to glide to the section.

import { scrollToSection } from '../../../shared/scroll/scrollToSection'
import { proofChips } from './proofChipsData'
import './ProofChips.css'

const glideTo = (sectionId) => (event) => {
  event.preventDefault()
  scrollToSection(document.getElementById(sectionId), { duration: 900 })
}

export default function ProofChips() {
  return (
    <div className="proof-chips">
      {proofChips.map((chip) => (
        <a key={chip.id} className={`proof-chip ${chip.position}`} href={`#${chip.sectionId}`} onClick={glideTo(chip.sectionId)}>
          <strong>{chip.value}</strong>
          <span>{chip.label}</span>
          <em>{chip.detail}</em>
        </a>
      ))}
    </div>
  )
}
