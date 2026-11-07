// Glide the page to a section at a fixed, comfortable pace: eases in, glides, eases out.
// The browser's own smooth scroll changes speed between browsers; this one doesn't.
// Used by the hero buttons, the proof chips, and when you leave the journey map.

import { easeInOutCubic, prefersReducedMotion } from '../motion/motion'

export function scrollToSection(sectionElement, { duration = 900 } = {}) {
  if (!sectionElement) return
  const page = document.documentElement
  // respect scroll-padding-top (base.css) so the section isn't hidden under the top bar
  const topBarSpace = parseFloat(getComputedStyle(page).scrollPaddingTop) || 0
  const maxScroll = page.scrollHeight - window.innerHeight
  const startY = window.scrollY
  const targetY = Math.max(0, Math.min(maxScroll, sectionElement.getBoundingClientRect().top + startY - topBarSpace))
  const jumpTo = (y) => window.scrollTo({ top: y, behavior: 'instant' })

  if (prefersReducedMotion() || Math.abs(targetY - startY) < 2) {
    jumpTo(targetY)
    return
  }

  let animationFrame = 0
  let finished = false
  // Trackpads keep sending scroll for a moment after you lift your fingers.
  // Swallow that during the glide, so it can't hijack it into a fast jump.
  const blockLeftoverWheel = (event) => event.preventDefault()
  const finish = () => {
    finished = true
    cancelAnimationFrame(animationFrame)
    window.removeEventListener('wheel', blockLeftoverWheel)
    window.removeEventListener('touchstart', finish)
    window.removeEventListener('keydown', finish)
  }
  window.addEventListener('wheel', blockLeftoverWheel, { passive: false })
  // a new touch or a key press means the visitor wants control back
  window.addEventListener('touchstart', finish, { passive: true })
  window.addEventListener('keydown', finish)

  const startTime = performance.now()
  const glide = (now) => {
    if (finished) return
    const progress = Math.min(1, (now - startTime) / duration)
    jumpTo(startY + (targetY - startY) * easeInOutCubic(progress))
    if (progress < 1) animationFrame = requestAnimationFrame(glide)
    else finish()
  }
  animationFrame = requestAnimationFrame(glide)

  // safety net: if animation frames are paused (background tab), still arrive
  setTimeout(() => {
    if (!finished) {
      finish()
      jumpTo(targetY)
    }
  }, duration + 600)
}
