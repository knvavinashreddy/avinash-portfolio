import { useState } from 'react'
import { projects } from '../data'

const PEEK = 58 // how much of each card behind the front one stays visible
const TILT = [0, -2.5, 2]

export default function Work() {
  const [active, setActive] = useState(projects[0].id)
  const p = projects.find((x) => x.id === active)
  const n = projects.length
  // Front card = active one; the rest sit behind it, peeking out on top
  const rank = (id) => (id === active ? 0 : projects.filter((x) => x.id !== active).findIndex((x) => x.id === id) + 1)

  return (
    <section id="work" aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title">Things I built, and what they actually do.</h2>
        <p className="lede">Pick a card from the deck.</p>

        <div className="deck-area">
          <div className="deck" role="tablist" aria-label="Projects" style={{ '--deck-h': `${(n - 1) * PEEK + 350}px` }}>
            {projects.map((proj) => {
              const r = rank(proj.id)
              return (
              <button
                key={proj.id}
                role="tab"
                aria-selected={active === proj.id}
                className={`pcard ${active === proj.id ? 'active' : ''}`}
                style={{
                  '--y': `${(n - 1 - r) * PEEK}px`,
                  '--x': `${r * 12}px`,
                  '--r': `${TILT[r % TILT.length]}deg`,
                  zIndex: n - r,
                }}
                onClick={() => setActive(proj.id)}
              >
                <span className="pcard-head">
                  <span className="pcard-name">{proj.name}</span>
                  <span className="pcard-emoji" aria-hidden="true">{proj.emoji}</span>
                </span>
                <span className="pcard-tag">{proj.tagline}</span>
                <span className="pcard-foot hand">{active === proj.id ? 'your pick' : 'tap to pick'}</span>
              </button>
              )
            })}
          </div>

          <article className="detail" role="tabpanel" aria-live="polite">
            <h3>{p.name}</h3>
            <p>{p.summary}</p>
            <dl className="mini-stats">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <dd>{s.value}</dd>
                  <dt>{s.label}</dt>
                </div>
              ))}
            </dl>
            <ul className="highlights">
              {p.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <ul className="tags" aria-label="Built with">
              {p.stack.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <div className="cta-row">
              <a className="btn btn-primary" href={p.repo} target="_blank" rel="noreferrer">View code</a>
              <a className="btn" href={p.live} target="_blank" rel="noreferrer">Try the demo</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
