// Days / hours / minutes / seconds, each in its own tile.

import './LaunchCountdown.css'

const UNITS = ['days', 'hours', 'minutes', 'seconds']

export default function LaunchCountdown({ timeLeft }) {
  return (
    <dl className="launch-countdown" aria-label="Time until launch">
      {UNITS.map((unit) => (
        <div key={unit}>
          <dd>{String(timeLeft[unit]).padStart(2, '0')}</dd>
          <dt>{unit}</dt>
        </div>
      ))}
    </dl>
  )
}
