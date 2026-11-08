// The card that tells the story of the current stop, laid out like a magazine story:
//   header          badge · organisation · "01 / 09"
//   chapter label   "2021 · BHIMAVARAM"
//   headline        serif, like a story title
//   story           comfortable reading text; the first letter is a large drop cap
//   camera roll     a few tilted photos
// key={stop.id} on the panel makes React swap in a fresh panel for each stop, which
// replays its entrance animation. useReadingProgress fills a thin line along the top
// as you scroll through a long story.

import { journeyStops } from '../../../data/journeyStops'
import { useReadingProgress } from './useReadingProgress'
import './StoryCard.css'

const twoDigits = (number) => String(number).padStart(2, '0')
const PHOTO_TILTS = [-3, 2, -1.5, 3] // degrees, so the photos look casually placed

// "**bold**" in the story text → highlighted words
function StoryText({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

// storyPanelRef points at the part that scrolls, so the map knows when to let the story scroll first
export default function StoryCard({ stopIndex, storyPanelRef }) {
  const stop = journeyStops[stopIndex]
  const { onPanelScroll } = useReadingProgress(storyPanelRef, stop.id)

  return (
    <aside
      className="story-card"
      style={{ '--stop-color': stop.color, '--stop-text-color': stop.dark ? '#2d1218' : '#fff' }}
      aria-live="polite"
    >
      <div className="story-card-panel" key={stop.id} ref={storyPanelRef} onScroll={onPanelScroll}>
        <span className="story-card-reading-progress" aria-hidden="true" />
        <header className="story-card-header">
          <span className="story-card-badge">{stop.badge}</span>
          <strong className="story-card-org">{stop.org}</strong>
          <span className="story-card-count">{twoDigits(stopIndex + 1)} / {twoDigits(journeyStops.length)}</span>
        </header>

        <div className="story-card-body">
          <p className="story-card-chapter">
            {stop.when} · {stop.place}
            {stop.upcoming && <span className="story-card-coming-up">Coming up</span>}
          </p>
          <h3 className="story-card-headline">{stop.headline}</h3>
          {/* a blank line in the story text starts a new paragraph */}
          <div className="story-card-story">
            {stop.story.split('\n\n').map((paragraph, i) => (
              <p key={i} className="story-card-paragraph"><StoryText text={paragraph} /></p>
            ))}
          </div>
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
