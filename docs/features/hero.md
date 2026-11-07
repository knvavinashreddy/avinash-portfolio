# The hero, step by step

Folder: `src/features/hero/`.

## Layout — `Hero.jsx`

```
<section class="hero">          pure black
  HeroHeading                   label · "Hey, I'm Avinash." · rotating line
  <div class="hero-stage">      sized to fit one laptop screen
    ProofChips                  three floating chips
    HeroPortrait                sun + photo + headphones button + two buttons
```

## The photo on the sun — `portrait/HeroPortrait.jsx`

- `avinash-cutout.png` is my photo with the black background removed (by `scripts/cutout.mjs`).
- The sun is a plain circle placed lower than the photo (`bottom: -32%`), so my head rises above it.
  `overflow: hidden` on the section cuts the bottom of the circle off.

## Depth with the mouse — `useMouseDepth.js`

The mouse position inside the hero becomes two numbers from −1 to 1, eased each frame and written
to `--mouse-x` / `--mouse-y`. Each layer's CSS multiplies them by its own amount using the CSS
`translate` property: chips 26px, photo 14px, sun −10px (the opposite way). Different amounts =
depth. Off on phones and for reduced motion.

## Music and the beat — `portrait/HeadphonesButton.jsx`, `portrait/useBeatEffects.js`

1. The headphones button calls `toggleMusic` from `App` (the same one the top-bar record button uses).
2. `shared/music/lofiPlayer.js` builds the music in code with the Web Audio API: chords from
   triangle-wave oscillators, a kick from a falling sine wave, a hi-hat from filtered noise.
3. Each kick is scheduled slightly ahead; a `setTimeout` for the same moment sends a
   `lofi-kick-drum` window event.
4. `useBeatEffects` listens and, on each kick, scales the sun with `element.animate()`, adds a ring
   that ripples out, and floats a ♪ up from the headphones. Temporary elements remove themselves
   when their animation ends.

## The rotating line — `heading/RotatingLine.jsx`

A timer changes the phrase index every 2.6 s. The phrase has `key={index}`, so React mounts a fresh
element each time and its CSS entrance animation plays again. Screen readers get the full headline once.

## Proof chips — `proof-chips/`

`proofChipsData.js` builds the chips from `data/projects.js` and `data/codingRatings.js`, so the
numbers stay correct. Hover shows a tooltip (`<em>`); click glides to the section.
On phones they line up above the photo.
