// A Bhimavaram ⇄ Hyderabad train ticket. The notches on the sides are cut with a CSS mask.

import { profile } from '../../data/profile'
import './TrainTicket.css'

export default function TrainTicket() {
  return (
    <div className="train-ticket">
      <span className="train-ticket-header">Indian Railways · Express</span>
      <div className="train-ticket-route">
        <span><strong>BVRM</strong>Bhimavaram</span>
        <span aria-hidden="true">⇄</span>
        <span><strong>HYB</strong>Hyderabad</span>
      </div>
      <div className="train-ticket-details">
        <span>Passenger<b>{profile.short}</b></span>
        <span>Coach<b>CS</b></span>
        <span>Since<b>2024</b></span>
      </div>
    </div>
  )
}
