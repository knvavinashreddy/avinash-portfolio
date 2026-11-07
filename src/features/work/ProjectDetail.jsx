// Details of the picked project: summary, three key numbers, highlights, tech used, and links.

import './ProjectDetail.css'

export default function ProjectDetail({ project }) {
  return (
    <article className="project-detail card-glow" role="tabpanel" aria-live="polite">
      <h3>{project.name}</h3>
      <p>{project.summary}</p>
      <dl className="project-stats">
        {project.stats.map((stat) => (
          <div key={stat.label}>
            <dd>{stat.value}</dd>
            <dt>{stat.label}</dt>
          </div>
        ))}
      </dl>
      <ul className="project-highlights">
        {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
      </ul>
      <ul className="project-tech-tags" aria-label="Built with">
        {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
      </ul>
      <div className="button-row">
        <a className="button button-primary" href={project.repo} target="_blank" rel="noreferrer">View code</a>
        <a className="button" href={project.live} target="_blank" rel="noreferrer">Try the demo</a>
      </div>
    </article>
  )
}
