// A little 3D depth in the hero: layers drift with the mouse.
//
// How: we track where the mouse is inside the hero as two numbers from -1 to 1
// (left/right, top/bottom) and write them to the CSS variables --mouse-x / --mouse-y.
// Each layer's CSS multiplies them by its own amount (chips most, photo less, sun the
// opposite way), which is what creates the depth. The values ease towards the mouse each
// frame instead of jumping, so it feels smooth. Off on phones and for reduced motion.

import { useEffect } from 'react'
import { prefersReducedMotion } from '../../shared/motion/motion'

const EASING_PER_FRAME = 0.08 // how quickly the layers catch up with the mouse

export function useMouseDepth(heroSectionRef) {
  useEffect(() => {
    const hero = heroSectionRef.current
    const hasRealMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hero || prefersReducedMotion() || !hasRealMouse) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animationFrame = 0

    const easeTowardsMouse = () => {
      currentX += (targetX - currentX) * EASING_PER_FRAME
      currentY += (targetY - currentY) * EASING_PER_FRAME
      hero.style.setProperty('--mouse-x', currentX.toFixed(4))
      hero.style.setProperty('--mouse-y', currentY.toFixed(4))
      const stillMoving = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.001
      animationFrame = stillMoving ? requestAnimationFrame(easeTowardsMouse) : 0
    }
    const onMouseMove = (event) => {
      const box = hero.getBoundingClientRect()
      targetX = ((event.clientX - box.left) / box.width - 0.5) * 2
      targetY = ((event.clientY - box.top) / box.height - 0.5) * 2
      if (!animationFrame) animationFrame = requestAnimationFrame(easeTowardsMouse)
    }
    const onMouseLeave = () => {
      targetX = 0
      targetY = 0
      if (!animationFrame) animationFrame = requestAnimationFrame(easeTowardsMouse)
    }

    hero.addEventListener('pointermove', onMouseMove)
    hero.addEventListener('pointerleave', onMouseLeave)
    return () => {
      cancelAnimationFrame(animationFrame)
      hero.removeEventListener('pointermove', onMouseMove)
      hero.removeEventListener('pointerleave', onMouseLeave)
    }
  }, [heroSectionRef])
}
