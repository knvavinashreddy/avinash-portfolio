// "Off the clock" section ("About" in the dock): a board of sticky notes, a train ticket
// and photos that visitors can drag around.

import { useRef } from 'react'
import { lifeBoardItems } from '../../data/lifeBoardItems'
import BoardItem from './BoardItem'
import { useDraggableItems } from './useDraggableItems'
import './LifeBoard.css'

export default function LifeBoard() {
  const board = useRef(null)
  const { positions, stackOrder, startDrag, moveDrag, endDrag, nudgeWithKeys } = useDraggableItems(lifeBoardItems, board)

  return (
    <section id="off-the-clock" aria-labelledby="off-the-clock-title">
      <div className="page-container">
        <p className="section-label">05 · Off the clock</p>
        <h2 id="off-the-clock-title">Off the clock.</h2>
        <p className="section-intro">The non-work version of me: sports, music, food and way too many games.</p>
        <p className="handwritten life-board-hint">it’s my board, but go ahead, move stuff around</p>
        <div className="life-board-scroll">
          <div className="life-board" ref={board}>
            {lifeBoardItems.map((item) => (
              <div
                key={item.id}
                className="life-board-item"
                tabIndex={0}
                aria-label={`${item.title || item.type}. Drag, or use arrow keys to move.`}
                style={{
                  left: positions[item.id].x,
                  top: positions[item.id].y,
                  '--tilt-angle': `${item.tilt}deg`,
                  zIndex: stackOrder.indexOf(item.id) + 1,
                }}
                onPointerDown={startDrag(item.id)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={nudgeWithKeys(item.id)}
              >
                <BoardItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
