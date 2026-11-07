// One pin on the small heart preview. Click (or Enter / Space) opens the full map at this stop.

import './PreviewPin.css'

// map-pin shape: a circle on top of a point at (0, 0)
const PIN_SHAPE = 'M0 0 C -10 -16, -32 -30, -32 -56 A32 32 0 1 1 32 -56 C 32 -30, 10 -16, 0 0Z'

export default function PreviewPin({ stop, position, labelSide, onOpen }) {
  const labelWidth = stop.short.length * 17 + 34 // roughly fits the text
  const labelBelow = labelSide === 'below'

  return (
    <g
      className={`heart-preview-pin ${stop.upcoming ? 'is-upcoming' : ''}`}
      transform={`translate(${position.x} ${position.y})`}
      role="button"
      tabIndex={0}
      aria-label={`Open the map at ${stop.org}, ${stop.when}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <path className="heart-preview-pin-halo" d={PIN_SHAPE} />
      <path className="heart-preview-pin-shape" d={PIN_SHAPE} fill={stop.color} />
      <circle cx="0" cy="-56" r="23" className="heart-preview-pin-face" />
      <text x="0" y="-48" textAnchor="middle" className="heart-preview-pin-badge" fill={stop.dark ? '#6b5a14' : stop.color}>
        {stop.badge}
      </text>
      {labelBelow ? (
        <>
          <rect x={-labelWidth / 2} y="14" width={labelWidth} height="50" rx="25" className="heart-preview-pin-label-background" />
          <text x="0" y="49" textAnchor="middle" className="heart-preview-pin-label">{stop.short}</text>
        </>
      ) : (
        <>
          <rect x="42" y="-83" width={labelWidth} height="50" rx="25" className="heart-preview-pin-label-background" />
          <text x="59" y="-48" className="heart-preview-pin-label">{stop.short}</text>
        </>
      )}
    </g>
  )
}
