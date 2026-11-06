import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { journeyStops } from '../data'
import MapWorld, { WORLD, route, stopLens } from './MapWorld'

const N = journeyStops.length
const pad = (n) => String(n).padStart(2, '0')
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// "**bold**" → highlighted words
function Story({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

function layout(vp) {
  const w = vp.clientWidth
  const h = vp.clientHeight
  if (w < 760) return { fx: w / 2, fy: h * 0.31, base: 0.62 }
  return { fx: 470 + (w - 470) / 2, fy: h * 0.5, base: w > 1500 ? 1.45 : 1.25 }
}

export default function JourneyMap({ startAt = 0, onClose, theme, onToggleTheme }) {
  const [index, setIndex] = useState(startAt)
  const [moved, setMoved] = useState(false)
  const indexRef = useRef(startAt)
  const cam = useRef({ len: stopLens[startAt], zoom: 0.55, userZoom: 1, panX: 0, panY: 0 })
  const anim = useRef(0)
  const zoomAnim = useRef(0)
  const reduced = useRef(false)

  const viewportRef = useRef(null)
  const layerRef = useRef(null)
  const traveledRef = useRef(null)
  const travelerRef = useRef(null)
  const arrowRef = useRef(null)
  const needleRef = useRef(null)
  const pinRefs = useRef([])
  const cardRef = useRef(null)
  const closeRef = useRef(null)

  // Draw one frame of the camera, route, traveler and pins
  const apply = useCallback(() => {
    const vp = viewportRef.current
    if (!vp || !layerRef.current) return
    const c = cam.current
    const p = route.at(c.len)
    const { fx, fy, base } = layout(vp)
    const z = base * c.zoom * c.userZoom
    const tx = fx - p.x * z + c.panX
    const ty = fy - p.y * z + c.panY
    layerRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${z})`
    const tr = traveledRef.current
    tr.style.strokeDasharray = route.total
    tr.style.strokeDashoffset = Math.max(0, route.total - c.len)
    travelerRef.current.style.transform = `translate3d(${p.x * z + tx}px, ${p.y * z + ty}px, 0)`
    arrowRef.current.style.transform = `rotate(${p.angle}rad)`
    needleRef.current.style.transform = `rotate(${p.angle + Math.PI / 2}rad)`
    journeyStops.forEach((s, i) => {
      const el = pinRefs.current[i]
      if (el) el.style.transform = `translate3d(${s.pos.x * z + tx}px, ${s.pos.y * z + ty}px, 0)`
    })
  }, [])

  // Fly the camera along the route to a stop
  const go = useCallback(
    (target) => {
      if (target < 0 || target >= N) return
      indexRef.current = target
      setIndex(target)
      setMoved(true)
      const c = cam.current
      const from = c.len
      const to = stopLens[target]
      const pan0 = { x: c.panX, y: c.panY }
      const zoom0 = c.zoom
      cancelAnimationFrame(anim.current)
      if (reduced.current) {
        Object.assign(c, { len: to, panX: 0, panY: 0, zoom: 1 })
        apply()
        return
      }
      const dist = Math.abs(to - from)
      const dur = Math.min(2600, 900 + dist * 0.5)
      const dip = Math.min(0.5, dist / 2600) // zoom out on long trips, like a flight
      const t0 = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur)
        const e = easeInOut(t)
        c.len = from + (to - from) * e
        c.zoom = zoom0 + (1 - zoom0) * e - dip * Math.sin(Math.PI * t)
        c.panX = pan0.x * (1 - e)
        c.panY = pan0.y * (1 - e)
        apply()
        if (t < 1) anim.current = requestAnimationFrame(step)
      }
      anim.current = requestAnimationFrame(step)
    },
    [apply]
  )

  const tweenView = useCallback(
    (targetZoom, resetPan) => {
      const c = cam.current
      const z0 = c.userZoom
      const p0 = { x: c.panX, y: c.panY }
      const t0 = performance.now()
      cancelAnimationFrame(zoomAnim.current)
      const step = (now) => {
        const t = reduced.current ? 1 : Math.min(1, (now - t0) / 350)
        const e = easeInOut(t)
        c.userZoom = z0 + (targetZoom - z0) * e
        if (resetPan) {
          c.panX = p0.x * (1 - e)
          c.panY = p0.y * (1 - e)
        }
        apply()
        if (t < 1) zoomAnim.current = requestAnimationFrame(step)
      }
      zoomAnim.current = requestAnimationFrame(step)
    },
    [apply]
  )
  const zoomBy = (f) => tweenView(Math.min(2.4, Math.max(0.45, cam.current.userZoom * f)), false)

  // Opening: lock page scroll, focus, fly in
  useLayoutEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    if (reduced.current) cam.current.zoom = 1
    apply()
    if (!reduced.current) {
      const c = cam.current
      const t0 = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 1100)
        c.zoom = 0.55 + 0.45 * easeInOut(t)
        apply()
        if (t < 1) anim.current = requestAnimationFrame(step)
      }
      anim.current = requestAnimationFrame(step)
    }
    const onResize = () => apply()
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(anim.current)
      cancelAnimationFrame(zoomAnim.current)
    }
  }, [apply])

  // Scroll / trackpad = travel. One stop per gesture.
  useEffect(() => {
    const vp = viewportRef.current.parentElement
    let acc = 0
    let lockUntil = 0
    const onWheel = (e) => {
      const card = cardRef.current
      if (card && card.contains(e.target)) {
        const canScroll = card.scrollHeight > card.clientHeight + 2
        const atTop = card.scrollTop <= 0
        const atBottom = card.scrollTop + card.clientHeight >= card.scrollHeight - 2
        if (canScroll && !((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom))) return
      }
      e.preventDefault()
      if (e.ctrlKey) {
        zoomBy(e.deltaY < 0 ? 1.1 : 0.9)
        return
      }
      const now = performance.now()
      if (now < lockUntil) return
      acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(acc) > 45) {
        const dir = acc > 0 ? 1 : -1
        acc = 0
        lockUntil = now + 1150
        go(indexRef.current + dir)
      }
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go])

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        go(indexRef.current + 1)
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        go(indexRef.current - 1)
      } else if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomBy(1.25)
      else if (e.key === '-') zoomBy(0.8)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, onClose])

  // Drag to look around
  const drag = useRef(null)
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const c = cam.current
    c.panX += e.clientX - drag.current.x
    c.panY += e.clientY - drag.current.y
    drag.current = { x: e.clientX, y: e.clientY }
    apply()
  }
  const onPointerUp = () => (drag.current = null)

  const stop = journeyStops[index]

  return (
    <div className="jm" role="dialog" aria-modal="true" aria-label="Journey map">
      <div
        className="jm-viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="jm-layer" ref={layerRef} style={{ width: WORLD.w, height: WORLD.h }}>
          <svg viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} width={WORLD.w} height={WORLD.h} aria-hidden="true">
            <MapWorld traveledRef={traveledRef} />
          </svg>
        </div>

        <div className="jm-pins">
          {journeyStops.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (pinRefs.current[i] = el)}
              className={`jm-pin ${i === index ? 'is-active' : i < index ? 'is-past' : 'is-future'}`}
              style={{ '--c': s.color, '--on-c': s.dark ? '#1d1600' : '#fff' }}
              onClick={() => go(i)}
              aria-label={`Go to ${s.org}, ${s.when}`}
            >
              <span className="jm-pin-head">
                <span className="jm-pin-badge">{s.badge}</span>
              </span>
              <span className="jm-pin-label">{s.short}</span>
            </button>
          ))}
          <div className="jm-traveler" ref={travelerRef} aria-hidden="true">
            <span className="jm-pulse" />
            <span className="jm-arrow" ref={arrowRef}>
              <svg viewBox="0 0 24 24"><path d="M4 4 L21 12 L4 20 L8 12Z" /></svg>
            </span>
          </div>
        </div>
      </div>

      <div className="jm-top">
        <button className="jm-chip" onClick={onClose} ref={closeRef}>
          <span aria-hidden="true">←</span> Back to site
        </button>
        <button className="jm-chip" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} mode`}>
          {theme === 'dark' ? '☀ Day' : '☾ Night'}
        </button>
      </div>

      <div className="jm-compass" aria-hidden="true">
        <span className="n">N</span><span className="e">E</span><span className="s">S</span><span className="w">W</span>
        <span className="jm-needle" ref={needleRef} />
      </div>

      <div className="jm-zoom">
        <button onClick={() => tweenView(1, true)} aria-label="Recenter on current stop">◎</button>
        <button onClick={() => zoomBy(1.25)} aria-label="Zoom in">+</button>
        <button onClick={() => zoomBy(0.8)} aria-label="Zoom out">−</button>
      </div>

      <aside className="jm-card" ref={cardRef} style={{ '--c': stop.color, '--on-c': stop.dark ? '#1d1600' : '#fff' }} aria-live="polite">
        <div className="jm-card-inner" key={stop.id}>
          <header className="jm-card-head">
            <span className="jm-card-badge">{stop.badge}</span>
            <span className="jm-card-meta">
              <strong>{stop.org}</strong>
              <span>{stop.when} · {stop.place}</span>
            </span>
            <span className="jm-count">{pad(index + 1)} / {pad(N)}</span>
          </header>
          <div className="jm-card-body">
            {stop.upcoming && <span className="jm-soon">Coming up</span>}
            <h3>{stop.headline}</h3>
            <p><Story text={stop.story} /></p>
            {stop.gallery?.length > 0 && (
              <>
                <p className="jm-gallery-title hand">from the camera roll</p>
                <ul className="jm-gallery">
                  {stop.gallery.map((g, i) => (
                    <li key={i} style={{ '--tilt': `${[-3, 2, -1.5, 3][i % 4]}deg` }}>
                      {g.src ? <img src={g.src} alt={g.caption} /> : <span className="ph">add photo</span>}
                      <span className="cap">{g.caption}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="jm-progress">
        <button className="jm-step" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous stop">↑</button>
        <ol className="jm-dots">
          {journeyStops.map((s, i) => (
            <li key={s.id}>
              <button
                className={i === index ? 'on' : i < index ? 'done' : ''}
                style={{ '--c': s.color }}
                onClick={() => go(i)}
                aria-label={`${s.org}, ${s.when}`}
                aria-current={i === index ? 'step' : undefined}
              />
            </li>
          ))}
        </ol>
        <span className="jm-progress-label">{stop.when} · {stop.place.split(',')[0]}</span>
        <button className="jm-step" onClick={() => go(index + 1)} disabled={index === N - 1} aria-label="Next stop">↓</button>
      </div>

      {!moved && <p className="jm-hint hand">scroll to travel</p>}
    </div>
  )
}
