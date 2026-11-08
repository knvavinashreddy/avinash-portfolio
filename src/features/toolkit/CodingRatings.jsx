// Competitive programming ratings: one card per platform with a link to my profile.

import { codingRatings } from '../../data/codingRatings'
import './CodingRatings.css'

export default function CodingRatings() {
  return (
    <div className="coding-ratings">
      <h3>Player stats</h3>
      <p className="section-intro">Competitive programming ratings. Grinding, one contest at a time.</p>
      <ul className="coding-ratings-list">
        {codingRatings.map((rating) => (
          <li key={rating.platform} className="coding-rating-card section-card card-glow">
            <span className="coding-rating-platform">{rating.platform}</span>
            <strong>{rating.value.toLocaleString('en-IN')}</strong>
            <a href={rating.url} target="_blank" rel="noreferrer">@{rating.handle} ↗</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
