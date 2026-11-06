import { useRef, useState } from 'react'
import { boardItems, profile } from '../data'

const W = 920
const H = 560

function Item({ item }) {
  if (item.type === 'ticket') {
    return (
      <div className="ticket">
        <span className="ticket-top">Indian Railways · Express</span>
        <div className="ticket-route">
          <span><strong>BVRM</strong>Bhimavaram</span>
          <span aria-hidden="true">⇄</span>
          <span><strong>HYB</strong>Hyderabad</span>
        </div>
        <div className="ticket-meta">
          <span>Passenger<b>{profile.short}</b></span>
          <span>Coach<b>CS</b></span>
          <span>Since<b>2024</b></span>
        </div>
      </div>
    )
  }
  if (item.type === 'photo') {
    return (
      <figure className="polaroid">
        {item.src ? <img src={item.src} alt={item.caption} draggable="false" /> : <div className="ph">your photo here</div>}
        <figcaption className="hand">{item.caption}</figcaption>
      </figure>
    )
  }
  return (
    <div className={`note ${item.color}`}>
      <strong>{item.title}</strong>
      <p>{item.text}</p>
    </div>
  )
}

export default function Life() {
  const [pos, setPos] = useState(() => Object.fromEntries(boardItems.map((i) => [i.id, { x: i.x, y: i.y }])))
  const [order, setOrder] = useState(boardItems.map((i) => i.id))
  const drag = useRef(null)
  const board = useRef(null)

  const down = (id) => (e) => {
    const rect = board.current.getBoundingClientRect()
    const scale = rect.width / W
    drag.current = { id, dx: e.clientX / scale - pos[id].x, dy: e.clientY / scale - pos[id].y, scale }
    e.currentTarget.setPointerCapture(e.pointerId)
    setOrder((o) => [...o.filter((x) => x !== id), id])
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const el = e.currentTarget
    const x = Math.min(Math.max(e.clientX / d.scale - d.dx, -20), W - el.offsetWidth + 20)
    const y = Math.min(Math.max(e.clientY / d.scale - d.dy, -20), H - el.offsetHeight + 20)
    setPos((p) => ({ ...p, [d.id]: { x, y } }))
  }
  const up = () => (drag.current = null)

  const nudge = (id) => (e) => {
    const step = e.shiftKey ? 40 : 12
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!delta) return
    e.preventDefault()
    setPos((p) => ({ ...p, [id]: { x: p[id].x + delta[0], y: p[id].y + delta[1] } }))
  }

  return (
    <section id="life" aria-labelledby="life-title">
      <div className="wrap">
        <p className="eyebrow">05 · Off the clock</p>
        <h2 id="life-title">Off the clock.</h2>
        <p className="lede">The non-work version of me: sports, music, food and way too many games.</p>
        <p className="hand board-hint">it’s my board, but go ahead, move stuff around</p>
        <div className="board-scroll">
          <div className="board" ref={board}>
            {boardItems.map((item) => (
              <div
                key={item.id}
                className="item"
                tabIndex={0}
                aria-label={`${item.title || item.type}. Drag, or use arrow keys to move.`}
                style={{
                  left: pos[item.id].x,
                  top: pos[item.id].y,
                  '--rot': `${item.rot}deg`,
                  zIndex: order.indexOf(item.id) + 1,
                }}
                onPointerDown={down(item.id)}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
                onKeyDown={nudge(item.id)}
              >
                <Item item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
