import { useEffect } from 'react'

// Cards that get a soft light following the cursor
export const SPOT = '.spot, .stat, .detail, .keys a, .yt, .wall-form'
// Things that rise into view as you scroll
const REVEAL = 'section .eyebrow, section h2, section > .wrap > .lede, .journey-head .lede, .detail, .stats, .keys, .yt'

export function useFx() {
  // Cursor spotlight: one listener for the whole page, sets --mx/--my on the card under the pointer
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let frame = 0
    let last = null
    const onMove = (e) => {
      last = e
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = last.target.closest?.(SPOT)
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${last.clientX - r.left}px`)
        el.style.setProperty('--my', `${last.clientY - r.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // Reveal on scroll. Content is only hidden once JS has marked it, and anything
  // already on screen (or everything, without IntersectionObserver) shows at once.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const els = [...document.querySelectorAll(REVEAL)]
    const show = (el) => {
      el.classList.add('in')
      io.unobserve(el)
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // In view, or already scrolled past (a fast jump can skip the moment it was in view)
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            show(e.target)
            // anything earlier on the page shows too, so nothing is left hidden above you
            els.slice(0, els.indexOf(e.target)).forEach((el) => el.classList.contains('reveal') && !el.classList.contains('in') && show(el))
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight) return // already visible: leave it alone
      el.classList.add('reveal')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
}
