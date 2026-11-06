// A page scroll with a fixed, comfortable pace: eases in, glides, eases out.
// The browser's own smooth scroll varies in speed between browsers; this doesn't.

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function scrollToSection(el, { duration = 900 } = {}) {
  if (!el) return
  const root = document.documentElement
  // honour scroll-padding-top so the section isn't hidden under the top bar
  const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0
  const max = root.scrollHeight - window.innerHeight
  const from = window.scrollY
  const to = Math.max(0, Math.min(max, el.getBoundingClientRect().top + from - pad))
  const jump = (y) => window.scrollTo({ top: y, behavior: 'instant' })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(to - from) < 2) {
    jump(to)
    return
  }

  let frame = 0
  let done = false
  // Trackpads keep sending scroll for a moment after you lift your fingers.
  // Swallow that during the glide, so it can't hijack it into a fast jump.
  const hold = (e) => e.preventDefault()
  const stop = () => {
    done = true
    cancelAnimationFrame(frame)
    window.removeEventListener('wheel', hold)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
  }
  window.addEventListener('wheel', hold, { passive: false })
  // a new touch or a key press means the visitor wants control back
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('keydown', stop)

  const t0 = performance.now()
  const step = (now) => {
    if (done) return
    const t = Math.min(1, (now - t0) / duration)
    jump(from + (to - from) * easeInOutCubic(t))
    if (t < 1) frame = requestAnimationFrame(step)
    else stop()
  }
  frame = requestAnimationFrame(step)
  // safety net: if animation frames are paused (background tab), still arrive
  setTimeout(() => {
    if (!done) {
      stop()
      jump(to)
    }
  }, duration + 600)
}
