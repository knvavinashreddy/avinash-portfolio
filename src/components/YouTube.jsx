import { useEffect, useState } from 'react'
import { links, youtube } from '../data'

function left(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(ms / 864e5),
    hours: Math.floor((ms / 36e5) % 24),
    minutes: Math.floor((ms / 6e4) % 60),
    seconds: Math.floor((ms / 1e3) % 60),
    done: ms === 0,
  }
}

export default function YouTube() {
  const [t, setT] = useState(() => left(youtube.launch))
  useEffect(() => {
    const id = setInterval(() => setT(left(youtube.launch)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="yt-section" aria-labelledby="yt-title">
      <div className="wrap">
        <div className="yt">
          <div>
            <h2 id="yt-title">{t.done ? 'My Telugu tech channel is live.' : youtube.title}</h2>
            <p>{youtube.text}</p>
            <a className="btn btn-primary" href={links.youtube} target="_blank" rel="noreferrer">
              {t.done ? 'Watch on YouTube' : 'Subscribe early'}
            </a>
          </div>
          {!t.done && (
            <dl className="countdown" aria-label="Time until launch">
              {['days', 'hours', 'minutes', 'seconds'].map((k) => (
                <div key={k}>
                  <dd>{String(t[k]).padStart(2, '0')}</dd>
                  <dt>{k}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
