// Headings and cards rise into view as you scroll down to them.
//
// How: when the page loads, every matching element that is still below the screen gets the
// class "scroll-reveal" (hidden, slightly lower; see styles/effects.css). An IntersectionObserver
// adds "is-revealed" when it scrolls into view, and the CSS transition does the rest.
// Things already on screen are left alone, so nothing above the fold ever flashes.

import { useEffect } from 'react'
import { prefersReducedMotion } from '../motion/motion'

const ELEMENTS_TO_REVEAL = [
  'section .section-label',
  'section h2',
  'section > .page-container > .section-intro',
  '.journey-heading .section-intro',
  '.project-detail',
  '.coding-ratings-list',
  '.contact-shortcuts',
  '.youtube-launch-card',
].join(', ')

export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const elements = [...document.querySelectorAll(ELEMENTS_TO_REVEAL)]

    const reveal = (element) => {
      element.classList.add('is-revealed')
      observer.unobserve(element)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // in view, or already scrolled past (a fast jump can skip the moment it was in view)
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            reveal(entry.target)
            // everything earlier on the page shows too, so nothing is left hidden above you
            elements
              .slice(0, elements.indexOf(entry.target))
              .forEach((element) => element.classList.contains('scroll-reveal') && !element.classList.contains('is-revealed') && reveal(element))
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px' }
    )

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return // already on screen
      element.classList.add('scroll-reveal')
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
}
