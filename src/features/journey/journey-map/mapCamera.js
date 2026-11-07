// Camera settings for the full-screen map, as plain values and functions (no React).

// How snappy the glide is when you click a dot or press an arrow key (higher = snappier).
// Scrolling doesn't use this: scroll moves the camera 1:1.
export const CAMERA_SPRING_STRENGTH = 7.5

// How far (in screen pixels) you must keep scrolling past the first / last stop to leave the map
export const LEAVE_MAP_PUSH_DISTANCE = 170

// Where on screen the camera's focus point sits, and the base zoom level.
// On desktop the story card covers the left 470px, so the focus point sits in the middle
// of the remaining space. On phones the card is at the bottom, so the focus is higher up.
export function getCameraAnchor(viewport) {
  const width = viewport.clientWidth
  const height = viewport.clientHeight
  if (width < 760) return { anchorX: width / 2, anchorY: height * 0.31, baseZoom: 0.5 }
  return { anchorX: 470 + (width - 470) / 2, anchorY: height * 0.5, baseZoom: width > 1500 ? 1.15 : 0.95 }
}
