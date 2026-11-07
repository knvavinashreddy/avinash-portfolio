// Small motion helpers used across the site.

// Ease-in-out curve: starts slow, speeds up in the middle, slows down at the end.
// Takes progress 0..1, returns eased progress 0..1.
export const easeInOutCubic = (progress) =>
  progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

// True when the visitor has asked their device for less motion.
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
