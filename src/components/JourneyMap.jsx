import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { journeyStops } from '../data'
import MapWorld, { WORLD, route, stopLens, stopPos, labelSide, doneLen } from './MapWorld'

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
  if (w < 760) return { fx: w / 2, fy: h * 0.31, base: 0.5 }
  return { fx: 470 + (w - 470) / 2, fy: h * 0.5, base: w > 1500 ? 1.15 : 0.95 }
}

// Camera feel: spring stiffness (higher = snappier) and map distance per pixel of scroll
const SPRING = 7.5
const SCROLL_SPEED = 0.9
const EXIT_PUSH = 170 // px of extra scroll past an end that leaves the map
const nearestStop = (len) => {
  let best = 0
  for (let i = 1; i < N; i++) if (Math.abs(stopLens[i] - len) < Math.abs(stopLens[best] - len)) best = i
  return best
}

// Centre of the heart, used to frame the whole thing on the way out
const HEART_CENTER = { x: 900, y: 690 }
const HEART_SIZE = { w: 1180, h: 1080 }

export default function JourneyMap({ startAt = 0, onClose, onExit, theme, onToggleTheme }) {
  const [index, setIndex] = useState(startAt)
  const [moved, setMoved] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [pull, setPull] = useState(0) // -1..1: how hard the visitor is pushing past an end
  const exitingRef = useRef(false)
  const settledAt = useRef(0) // when the camera last came to rest
  const indexRef = useRef(startAt)
  const cam = useRef({ len: stopLens[startAt], vel: 0, zoom: 1, userZoom: 1, panX: 0, panY: 0 })
  const target = useRef(stopLens[startAt]) // where along the heart the camera is heading
  const loop = useRef(0)
  const drag = useRef(null)
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
    // Solid behind the traveler, but upcoming stops stay dotted
    tr.style.strokeDasharray = `${Math.min(c.len, doneLen)} ${route.total}`
    travelerRef.current.style.transform = `translate3d(${p.x * z + tx}px, ${p.y * z + ty}px, 0)`
    arrowRef.current.style.transform = `rotate(${p.angle}rad)`
    needleRef.current.style.transform = `rotate(${p.angle + Math.PI / 2}rad)`
    stopPos.forEach((p, i) => {
      const el = pinRefs.current[i]
      if (el) el.style.transform = `translate3d(${p.x * z + tx}px, ${p.y * z + ty}px, 0)`
    })
  }, [])

  // One animation loop moves the camera. It follows `target` on a critically damped
  // spring: eases in, eases out, never overshoots, and stays smooth when the
  // target keeps changing mid-scroll. The zoom never changes here.
  const run = useCallback(() => {
    if (loop.current || exitingRef.current) return
    const c = cam.current
    const sync = () => {
      const i = nearestStop(c.len)
      if (i !== indexRef.current) {
        indexRef.current = i
        setIndex(i)
      }
    }
    if (reduced.current) {
      Object.assign(c, { len: target.current, vel: 0, panX: 0, panY: 0 })
      apply()
      sync()
      settledAt.current = performance.now()
      return
    }
    let prev = performance.now()
    const tick = (now) => {
      const dt = Math.min(1 / 30, (now - prev) / 1000)
      prev = now
      const d = target.current - c.len
      c.vel += (SPRING * SPRING * d - 2 * SPRING * c.vel) * dt
      c.len += c.vel * dt
      if (!drag.current) {
        // drift back onto the route if the visitor dragged the map aside
        const k = 1 - Math.exp(-dt * 6)
        c.panX -= c.panX * k
        c.panY -= c.panY * k
      }
      apply()
      sync()
      const resting = Math.abs(d) < 0.4 && Math.abs(c.vel) < 2 && Math.abs(c.panX) + Math.abs(c.panY) < 0.6
      if (resting) {
        Object.assign(c, { len: target.current, vel: 0 })
        if (!drag.current) Object.assign(c, { panX: 0, panY: 0 })
        apply()
        loop.current = 0
        settledAt.current = now
        return
      }
      loop.current = requestAnimationFrame(tick)
    }
    loop.current = requestAnimationFrame(tick)
  }, [apply])

  // Head for a stop (dots, pins, arrow keys)
  const go = useCallback(
    (i) => {
      if (i < 0 || i >= N || exitingRef.current) return
      target.current = stopLens[i]
      setMoved(true)
      run()
    },
    [run]
  )

  // Past either end of the heart: pull back to show the whole heart, then leave the map
  const exit = useCallback(
    (dir) => {
      if (exitingRef.current) return
      exitingRef.current = true
      setExiting(true)
      cancelAnimationFrame(loop.current)
      loop.current = 0
      cancelAnimationFrame(anim.current)
      cancelAnimationFrame(zoomAnim.current)
      let left = false
      const leave = () => {
        if (left) return
        left = true
        onExit(dir)
      }
      const vp = viewportRef.current
      if (reduced.current || !vp) {
        leave()
        return
      }
      // Safety net: if the browser pauses animation frames (background tab), still leave
      setTimeout(leave, 1400)
      const c = cam.current
      const p = route.at(c.len)
      const { fx, fy, base } = layout(vp)
      const w = vp.clientWidth
      const h = vp.clientHeight
      const z0 = base * c.zoom * c.userZoom
      const zFit = Math.min(w / HEART_SIZE.w, h / HEART_SIZE.h) * 0.85
      const s0 = { x: fx + c.panX, y: fy + c.panY } // where the camera point sits on screen now
      const s1 = { x: w / 2, y: h / 2 }
      const t0 = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 750)
        const e = easeInOut(t)
        const z = z0 + (zFit - z0) * e
        const F = { x: p.x + (HEART_CENTER.x - p.x) * e, y: p.y + (HEART_CENTER.y - p.y) * e }
        const S = { x: s0.x + (s1.x - s0.x) * e, y: s0.y + (s1.y - s0.y) * e }
        // Express the framing as zoom + pan around the current route point, so apply() can draw it
        c.zoom = z / (base * c.userZoom)
        c.panX = S.x - F.x * z - fx + p.x * z
        c.panY = S.y - F.y * z - fy + p.y * z
        apply()
        if (t < 1) anim.current = requestAnimationFrame(step)
        else setTimeout(leave, 180)
      }
      anim.current = requestAnimationFrame(step)
    },
    [apply, onExit]
  )

  // One step forward or back; past the ends it leaves the map
  const travel = useCallback(
    (dir) => {
      // step from the stop we're heading to, so quick presses queue up smoothly
      const next = nearestStop(target.current) + dir
      if (next < 0 || next >= N) exit(dir)
      else go(next)
    },
    [go, exit]
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
  const zoomBy = (f) => !exitingRef.current && tweenView(Math.min(2.4, Math.max(0.45, cam.current.userZoom * f)), false)

  // Opening: lock page scroll, focus, draw (no zoom animation)
  useLayoutEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    apply()
    settledAt.current = performance.now()
    const onResize = () => apply()
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(loop.current)
      loop.current = 0
      cancelAnimationFrame(anim.current)
      cancelAnimationFrame(zoomAnim.current)
    }
  }, [apply])

  // Scroll / trackpad moves you continuously along the heart, then settles on a stop
  useEffect(() => {
    const vp = viewportRef.current.parentElement
    const first = stopLens[0]
    const last = stopLens[N - 1]
    const gap = N > 1 ? stopLens[1] - stopLens[0] : 1
    let lastWheel = 0
    let fromStop = 0
    let over = 0
    let overDir = 0
    let overTimer = 0
    let snapTimer = 0

    // When scrolling stops, finish the move: a small nudge (a quarter of the way)
    // is enough to carry on to the next stop, less than that falls back
    const snap = () => {
      const u = (target.current - first) / gap
      let i = fromStop
      if (u > fromStop + 0.001) i = Math.floor(u + 0.75)
      else if (u < fromStop - 0.001) i = Math.ceil(u - 0.75)
      target.current = stopLens[Math.max(0, Math.min(N - 1, i))]
      run()
    }

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
      if (exitingRef.current) return
      const now = performance.now()
      // A pause of 250ms+ means a new scroll gesture (trackpads keep coasting after you let go)
      if (now - lastWheel > 250) fromStop = nearestStop(target.current)
      lastWheel = now
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vp.clientHeight : 1
      let dy = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit
      dy = Math.max(-140, Math.min(140, dy)) // tame chunky mouse wheels
      const raw = target.current + dy * SCROLL_SPEED
      clearTimeout(snapTimer)
      if (raw > last || raw < first) {
        // Pushing past an end: once the camera has (almost) reached that end, every
        // bit of extra scroll fills the "keep going" bar; a full bar leaves the map.
        const dir = raw > last ? 1 : -1
        const end = dir > 0 ? last : first
        target.current = end
        if (Math.abs(cam.current.len - end) < gap * 0.12) {
          if (overDir !== dir) {
            over = 0
            overDir = dir
          }
          over += Math.abs(dy)
          clearTimeout(overTimer)
          if (over >= EXIT_PUSH) {
            setPull(0)
            exit(dir)
            return
          }
          setPull(dir * (over / EXIT_PUSH))
          // stop pushing for a moment and the bar drains away
          overTimer = setTimeout(() => {
            over = 0
            setPull(0)
          }, 450)
        }
        setMoved(true)
        run()
        return
      }
      over = 0
      setPull(0)
      target.current = raw
      setMoved(true)
      run()
      snapTimer = setTimeout(snap, 160)
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      clearTimeout(snapTimer)
      clearTimeout(overTimer)
      vp.removeEventListener('wheel', onWheel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, exit])

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        if (!e.repeat || nearestStop(target.current) < N - 1) travel(1)
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        if (!e.repeat || nearestStop(target.current) > 0) travel(-1)
      } else if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomBy(1.25)
      else if (e.key === '-') zoomBy(0.8)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travel, onClose])

  // Drag to look around
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
    <div className={`jm ${exiting ? 'is-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Journey map">
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
              className={`jm-pin label-${labelSide[i]} ${i === index ? 'is-active' : i < index ? 'is-past' : 'is-future'}`}
              style={{ '--c': s.color, '--on-c': s.dark ? '#2d1218' : '#fff' }}
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

      <aside className="jm-card" ref={cardRef} style={{ '--c': stop.color, '--on-c': stop.dark ? '#2d1218' : '#fff' }} aria-live="polite">
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
        <button className="jm-step" onClick={() => travel(-1)} aria-label={index === 0 ? 'Leave the map, back to the journey section' : 'Previous stop'}>↑</button>
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
        <button className="jm-step" onClick={() => travel(1)} aria-label={index === N - 1 ? 'Leave the map, on to my projects' : 'Next stop'}>↓</button>
      </div>

      {!moved && index < N - 1 && <p className="jm-hint hand">scroll to travel</p>}

      {/* At either end: how to leave, and how close the visitor is to leaving */}
      {(index === N - 1 || pull > 0) && pull >= 0 && (
        <div className="jm-pull is-down" style={{ '--p': pull }} aria-hidden="true">
          <span>Keep scrolling · on to my projects ↓</span>
          <i />
        </div>
      )}
      {pull < 0 && (
        <div className="jm-pull is-up" style={{ '--p': -pull }} aria-hidden="true">
          <span>↑ Keep scrolling · back to the journey</span>
          <i />
        </div>
      )}
    </div>
  )
}
