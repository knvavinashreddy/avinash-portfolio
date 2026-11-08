// Toolkit section ("Stack" in the dock): tools I use, and my coding ratings.

import CodingRatings from './CodingRatings'
import ToolPicker from './ToolPicker'

export default function Toolkit() {
  return (
    <section id="toolkit" className="section-theme-purple" aria-labelledby="toolkit-title">
      <div className="page-container">
        <p className="section-label">03 · Toolkit</p>
        <h2 id="toolkit-title">Everything in my toolkit.</h2>
        <p className="section-intro">Hover or tap a tool to see what I use it for.</p>
        <ToolPicker />
        <CodingRatings />
      </div>
    </section>
  )
}
