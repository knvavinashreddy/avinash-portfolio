// What one item on the board looks like, by its type: train ticket, photo, or sticky note.

import '../../shared/sticky-note/StickyNote.css'
import PolaroidPhoto from './PolaroidPhoto'
import TrainTicket from './TrainTicket'

export default function BoardItem({ item }) {
  if (item.type === 'ticket') return <TrainTicket />
  if (item.type === 'photo') return <PolaroidPhoto src={item.src} caption={item.caption} />
  return (
    <div className={`sticky-note sticky-note-${item.color}`}>
      <strong>{item.title}</strong>
      <p>{item.text}</p>
    </div>
  )
}
