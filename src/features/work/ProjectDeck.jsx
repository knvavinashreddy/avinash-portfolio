// A stacked deck of project cards. The picked card comes to the front; the others sit
// behind it, each peeking out 58px higher, slightly offset and tilted.

import { projects } from '../../data/projects'
import './ProjectDeck.css'

const CARD_PEEK = 58 // how much of each card behind the front one stays visible
const CARD_TILTS = [0, -2.5, 2] // degrees, by position in the stack
const CARD_HEIGHT = 350

export default function ProjectDeck({ pickedProjectId, onPick }) {
  const cardCount = projects.length
  // 0 = front (the picked card), 1 = just behind it, …
  const stackPosition = (projectId) =>
    projectId === pickedProjectId ? 0 : projects.filter((p) => p.id !== pickedProjectId).findIndex((p) => p.id === projectId) + 1

  return (
    <div className="project-deck" role="tablist" aria-label="Projects" style={{ '--deck-height': `${(cardCount - 1) * CARD_PEEK + CARD_HEIGHT}px` }}>
      {projects.map((project) => {
        const position = stackPosition(project.id)
        const isPicked = project.id === pickedProjectId
        return (
          <button
            key={project.id}
            role="tab"
            aria-selected={isPicked}
            className={`project-card section-card ${isPicked ? 'is-picked' : ''}`}
            style={{
              '--card-offset-y': `${(cardCount - 1 - position) * CARD_PEEK}px`,
              '--card-offset-x': `${position * 12}px`,
              '--card-tilt': `${CARD_TILTS[position % CARD_TILTS.length]}deg`,
              zIndex: cardCount - position,
            }}
            onClick={() => onPick(project.id)}
          >
            <span className="project-card-header">
              <span className="project-card-name">{project.name}</span>
              <span className="project-card-emoji" aria-hidden="true">{project.emoji}</span>
            </span>
            <span className="project-card-tagline">{project.tagline}</span>
            <span className="project-card-footer handwritten">{isPicked ? 'your pick' : 'tap to pick'}</span>
          </button>
        )
      })}
    </div>
  )
}
