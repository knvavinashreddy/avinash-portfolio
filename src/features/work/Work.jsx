// Work section: a deck of project cards on the left, details of the picked one on the right.

import { useState } from 'react'
import { projects } from '../../data/projects'
import ProjectDeck from './ProjectDeck'
import ProjectDetail from './ProjectDetail'

export default function Work() {
  const [pickedProjectId, setPickedProjectId] = useState(projects[0].id)
  const pickedProject = projects.find((project) => project.id === pickedProjectId)

  return (
    <section id="work" className="section-theme-green" aria-labelledby="work-title">
      <div className="page-container">
        <p className="section-label">02 · Work</p>
        <h2 id="work-title">Things I built, and what they actually do.</h2>
        <p className="section-intro">Pick a card from the deck.</p>

        <div className="project-deck-area">
          <ProjectDeck pickedProjectId={pickedProjectId} onPick={setPickedProjectId} />
          <ProjectDetail project={pickedProject} />
        </div>
      </div>
    </section>
  )
}
