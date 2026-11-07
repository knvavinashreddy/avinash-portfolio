# The journey map, step by step

Folder: `src/features/journey/`. Read the files in this order; each step builds on the last.

## 1. The heart is maths — `heart/heartShape.js`

- A heart curve: `x = 16·sin³t`, `y = 13·cos t − 5·cos 2t − 2·cos 3t − cos 4t`.
- We sample 160 points of it, starting at the bottom tip (`t = π`), scaled up and centred
  on an 1800 × 1300 map. Screen y grows downwards, so y is flipped.
- **Stops are spaced evenly**: stop *i* sits at `10% + 80% × i / (count − 1)` of the way round.
  Nine stops put the middle one exactly in the dip.
- `findNearestStop(distance)` says which stop is closest to a point on the route.

## 2. From points to a smooth path — `heart/smoothPath.js`

- **Catmull-Rom → Bézier**: each pair of points becomes a cubic Bézier curve whose control points
  come from the neighbouring points, so the line passes through every point with no corners.
- **Length lookup table**: we walk each curve in small steps, recording distance so far.
  `pointAtLength(d)` binary-searches that table to answer "where am I after *d* pixels?",
  and also returns the direction of travel (for the arrow and compass).

## 3. The background — `map-world/`

- `terrain.js`: a made-up height map = seeded smooth noise + a soft hill under each city.
- `contourLines.js`: **marching squares**. Sample the height on a 16 px grid; for each of 14
  heights, check every grid square's 4 corners (above / below), look up which edges the line
  crosses (16 cases), interpolate the exact crossing points, then join the pieces into long lines.
- `MapBackground.jsx` draws land, a dot grid (SVG `<pattern>`), the contour lines, a radial glow
  inside the heart, place names with coordinates, and (in the preview) a compass rose.
- `HeartRoute.jsx` draws the heart twice with one gradient: a soft full line, and a bright line
  revealed with `stroke-dasharray: "<travelled> <total>"`.

## 4. The small preview — `heart-preview/`

`HeartPreview.jsx` = `<MapWorld isPreview />` + a `PreviewPin` per stop + the "View journey map"
button. The SVG `viewBox` crops the map to just around the heart. Clicking opens the full map.

## 5. The full-screen map — `journey-map/`

`JourneyMap.jsx` only assembles the pieces. The logic is in five hooks:

| Hook | Job |
|---|---|
| `useMapCamera` | Holds the camera (`distance` along the heart, zoom, pan). `drawCameraFrame()` positions the map layer, bright line, traveller, compass needle and pins directly through `style` (no React re-render), so it can run every frame. `glideToTarget()` animates to a stop on a **critically damped spring**. |
| `useScrollTravel` | Scrolling moves the camera **1:1**: scrolled pixels ÷ zoom = map distance. Past either end, extra scroll fills the exit bar; full bar → leave. |
| `useLeaveMapAnimation` | Pulls back over 0.75 s until the whole heart fits, then closes the map and scrolls the page. |
| `useMapKeyboard` | Arrow keys / Space / PageUp-Down travel, Esc closes, + / − zoom. |
| `useDragToLook` | Drag the map aside; the next move drifts it back onto the route. |

Pieces on screen: `MapPins`, `Traveller`, `MapTopBar`, `MapCompass`, `ZoomControls`,
`StoryCard`, `JourneyProgress`, `ExitBar`.

**The spring, in two lines** (in `useMapCamera.js`, every frame):

```js
velocity += (k² × distanceLeft − 2k × velocity) × seconds   // pulled towards the stop, slowed by damping
distance += velocity × seconds
```

With damping exactly `2k` the camera arrives as fast as possible without overshooting.

## Rebuilding it live (a 30–45 minute version)

1. SVG with a `viewBox`; draw the heart from the formula as a `<path>` (points joined with `L` is fine).
2. Use `path.getTotalLength()` and `path.getPointAtLength()` to place 9 pins evenly.
3. A `wheel` listener adds `deltaY` to a `distance` variable; move a dot to `getPointAtLength(distance)`.
4. Show the nearest stop's name in a card.

Then explain what the real version adds: smooth Béziers, the spring glide, 1:1 zoom-aware
scrolling, the exit bar, and the contour background.
