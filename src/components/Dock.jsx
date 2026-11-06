import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { links } from '../data'

const ITEMS = [
  { id: 'top', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'life', label: 'About' },
  { id: 'hello', label: 'Contact' },
]

// Floating navigation at the bottom of the screen. The highlight slides to
// whichever section is in the middle of the viewport.
export default function Dock() {
  const [active, setActive] = useState('top')
  const linkRefs = useRef({})
  const pillRef = useRef(null)
  const barRef = useRef(null)

  // Active = the last section whose top has passed the middle of the screen
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight * 0.5
      let current = 'top'
      for (const x of ITEMS.slice(1)) {
        const el = document.getElementById(x.id)
        if (el && el.getBoundingClientRect().top <= mid) current = x.id
      }
      // the last section may never reach the middle: at the very bottom, it wins
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ITEMS[ITEMS.length - 1].id
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Move the highlight under the active link, and keep it in view when the dock scrolls (phones)
  useLayoutEffect(() => {
    const place = () => {
      const a = linkRefs.current[active]
      const pill = pillRef.current
      if (!a || !pill) return
      pill.style.width = `${a.offsetWidth}px`
      pill.style.transform = `translateX(${a.offsetLeft}px)`
      const bar = barRef.current
      if (bar && bar.scrollWidth > bar.clientWidth) {
        bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' })
      }
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  return (
    <nav className="dock" aria-label="Sections">
      <div className="dock-bar" ref={barRef}>
        <span className="dock-pill" ref={pillRef} aria-hidden="true" />
        {ITEMS.map((x) => (
          <a
            key={x.id}
            href={`#${x.id}`}
            ref={(el) => (linkRefs.current[x.id] = el)}
            className={active === x.id ? 'on' : ''}
            aria-current={active === x.id ? 'true' : undefined}
          >
            {x.label}
          </a>
        ))}
        <a className="dock-resume" href={links.resume} target="_blank" rel="noreferrer">
          Resume <span aria-hidden="true">↗</span>
        </a>
      </div>
    </nav>
  )
}
