// Tools grouped by what they're for. Hover, focus or tap a tool and the note on the right
// says what I use it for.

import { useState } from 'react'
import { toolkit } from '../../data/toolkit'
import './ToolPicker.css'

export default function ToolPicker() {
  const [selectedTool, setSelectedTool] = useState(toolkit[0].tools[0])

  return (
    <div className="toolkit-layout">
      <div>
        {toolkit.map((group) => (
          <div key={group.group} className="toolkit-group">
            <h3>{group.group}</h3>
            <ul className="toolkit-tools">
              {group.tools.map((tool) => (
                <li key={tool.name}>
                  <button
                    className={`toolkit-tool section-card ${selectedTool.name === tool.name ? 'is-selected' : ''}`}
                    onMouseEnter={() => setSelectedTool(tool)}
                    onFocus={() => setSelectedTool(tool)}
                    onClick={() => setSelectedTool(tool)}
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <aside className="toolkit-tool-note" aria-live="polite">
        <strong>{selectedTool.name}</strong>
        <p>{selectedTool.note}</p>
      </aside>
    </div>
  )
}
