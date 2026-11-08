// My Telugu YouTube channel launch card, with a live countdown.
// When the date arrives, the text switches to "is live" and the countdown disappears.

import { links } from '../../data/links'
import { youtubeLaunch } from '../../data/youtubeLaunch'
import LaunchCountdown from './LaunchCountdown'
import { useCountdown } from './useCountdown'
import './YouTubeLaunch.css'

export default function YouTubeLaunch() {
  const timeLeft = useCountdown(youtubeLaunch.launch)

  return (
    <section id="youtube-launch" className="youtube-launch section-tone-ember" aria-labelledby="youtube-launch-title">
      <div className="page-container">
        <div className="youtube-launch-card section-card card-glow">
          <div>
            <p className="section-label">04 · Coming soon</p>
            <h2 id="youtube-launch-title">{timeLeft.isFinished ? 'My Telugu tech channel is live.' : youtubeLaunch.title}</h2>
            <p>{youtubeLaunch.text}</p>
            <a className="button button-primary" href={links.youtube} target="_blank" rel="noreferrer">
              {timeLeft.isFinished ? 'Watch on YouTube' : 'Subscribe early'}
            </a>
          </div>
          {!timeLeft.isFinished && <LaunchCountdown timeLeft={timeLeft} />}
        </div>
      </div>
    </section>
  )
}
