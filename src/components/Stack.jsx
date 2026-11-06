import { useState } from 'react'
import { ratings, toolkit } from '../data'

export default function Stack() {
  const first = toolkit[0].tools[0]
  const [tool, setTool] = useState(first)

  return (
    <section id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <p className="eyebrow">03 · Toolkit</p>
        <h2 id="stack-title">Everything in my toolkit.</h2>
        <p className="lede">Hover or tap a tool to see what I use it for.</p>

        <div className="toolbox">
          <div>
            {toolkit.map((g) => (
              <div key={g.group} className="tool-group">
                <h3>{g.group}</h3>
                <ul className="chips">
                  {g.tools.map((t) => (
                    <li key={t.name}>
                      <button
                        className={`chip ${tool.name === t.name ? 'on' : ''}`}
                        onMouseEnter={() => setTool(t)}
                        onFocus={() => setTool(t)}
                        onClick={() => setTool(t)}
                      >
                        {t.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <aside className="bubble" aria-live="polite">
            <strong>{tool.name}</strong>
            <p>{tool.note}</p>
          </aside>
        </div>

        <div className="ratings">
          <h3>Player stats</h3>
          <p className="lede">Competitive programming ratings. Grinding, one contest at a time.</p>
          <ul className="stats">
            {ratings.map((r) => (
              <li key={r.platform} className="stat">
                <span className="stat-platform">{r.platform}</span>
                <strong>{r.value.toLocaleString('en-IN')}</strong>
                <a href={r.url} target="_blank" rel="noreferrer">@{r.handle} ↗</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
