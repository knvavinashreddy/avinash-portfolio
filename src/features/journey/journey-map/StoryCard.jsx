// The card that tells the story of the current stop: badge, place and year, headline,
// story text, and a little "camera roll" of photos.
// key={stop.id} on the panel makes React swap in a fresh panel for each stop, which
// replays its entrance animation.

import { journeyStops } from '../../../data/journeyStops'
import './StoryCard.css'

const twoDigits = (number) => String(number).padStart(2, '0')
const PHOTO_TILTS = [-3, 2, -1.5, 3] // degrees, so the photos look casually placed

// "**bold**" in the story text → highlighted words
function StoryText({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

export default function StoryCard({ stopIndex, storyCardRef }) {
  const stop = journeyStops[stopIndex]
  return (
    <aside
      className="story-card"
      ref={storyCardRef}
      style={{ '--stop-color': stop.color, '--stop-text-color': stop.dark ? '#2d1218' : '#fff' }}
      aria-live="polite"
    >
      <div className="story-card-panel" key={stop.id}>
        <header className="story-card-header">
          <span className="story-card-badge">{stop.badge}</span>
          <span className="story-card-meta">
            <strong>{stop.org}</strong>
            <span>{stop.when} · {stop.place}</span>
          </span>
          <span className="story-card-count">{twoDigits(stopIndex + 1)} / {twoDigits(journeyStops.length)}</span>
        </header>

        <div className="story-card-body">
          {stop.upcoming && <span className="story-card-coming-up">Coming up</span>}
          <h3>{stop.headline}</h3>
          {/* a blank line in the story text starts a new paragraph */}
          {stop.story.split('\n\n').map((paragraph, i) => (
            <p key={i} className="story-card-paragraph"><StoryText text={paragraph} /></p>
          ))}
          {stop.gallery?.length > 0 && (
            <>
              <p className="story-card-gallery-title handwritten">from the camera roll</p>
              <ul className="story-card-gallery">
                {stop.gallery.map((photo, i) => (
                  <li key={i} style={{ '--photo-tilt': `${PHOTO_TILTS[i % PHOTO_TILTS.length]}deg` }}>
                    {photo.src ? <img src={photo.src} alt={photo.caption} /> : <span className="story-card-photo-placeholder">add photo</span>}
                    <span className="story-card-photo-caption">{photo.caption}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
