# How this portfolio is built

React 18 + Vite, plain CSS, no other libraries. Everything else (the heart map, contour lines,
animations, the music) is written by hand with browser features: SVG, CSS variables,
`requestAnimationFrame`, the Web Audio API, `IntersectionObserver` and `localStorage`.

## Start here

1. `index.html` has one `<div id="root">`.
2. `src/main.jsx` loads the three global stylesheets, then renders `<App />` into it.
3. `src/App.jsx` lists every section from top to bottom. Each line points to a folder.

## Folders

```
src/
  main.jsx            entry point
  App.jsx             the page, top to bottom; owns theme + music state
  styles/             CSS shared by everything
    tokens.css          all colours, fonts and the Day / Night values
    base.css            reset, page width, headings, buttons, section labels
    effects.css         film grain, rise-on-scroll, card glow
  data/               all the content (text, numbers, links): edit these, not the components
  shared/             things more than one feature uses
    top-bar/            avatar, status, music button, Day/Night switch
    section-dock/       floating navigation at the bottom
    sticky-note/        sticky-note look (life board + guestbook)
    music/              lo-fi player made in code + the hook that connects it to the page
    theme/              Day / Night
    scroll/             smooth glide to a section
    effects/            rise-on-scroll and card-glow hooks
    motion/             easing curve + "reduce motion" check
  features/           one folder per section of the page
    hero/               see docs/features/hero.md
    journey/            see docs/features/journey-map.md
    work/               project card deck + project details
    toolkit/            tool picker + coding ratings
    youtube-launch/     channel launch card + countdown
    life-board/         draggable "off the clock" board
    guestbook/          leave a note (saved in the browser)
    contact/            contact cards + keyboard shortcuts, palette card, footer
scripts/
  cutout.mjs          removes the black background from my photo (see README)
```

## Rules the code follows

- **One job per file.** A component file (`.jsx`) is the markup; its `.css` file next to it is
  its styles; logic lives in a `useSomething.js` hook or a plain `.js` helper. No file mixes all three.
- **Names say what and where.** Folders are named after the feature; CSS classes start with the
  feature name (`.journey-map-…`, `.story-card-…`, `.proof-chip`); functions say what they do
  (`drawCameraFrame`, `travelToStop`, `scrollToSection`).
- **Every file starts with a comment** saying what it does and how.
- **State lives in one place.** Theme and music are in `App.jsx` because several parts use them;
  everything else is local to its feature.
- **Content is data.** Components read from `src/data/`; changing text never means touching a component.

## How the CSS fits together

- Colours and fonts are CSS variables in `styles/tokens.css` (`--color-text`, `--brand-sapphire`, …).
  Night mode only changes those variables, so components never need "if dark" code.
- Every section has its own background (`styles/sectionThemes.css`): a class like
  `section-theme-work` re-sets the `--color-*` variables for that section only. Cards inside add
  `section-card`, which swaps in a contrasting card colour so they never match the section.
- `main.jsx` imports the global CSS **before** `App`, so each component's own CSS (imported in its
  `.jsx` file) loads later and wins over the shared defaults when both are equally specific.
- State is shown with `is-…` / `has-…` classes added by React: `is-playing`, `is-active`,
  `is-selected`, `is-exiting`, `has-label-below`.

## Data flow, in one picture

```
data/*.js ──► features/*  (read content)
App.jsx: useTheme()      ──► TopBar, Journey (Day/Night buttons)
App.jsx: useLofiMusic()  ──► TopBar (record button), Hero (headphones button)
          └─ every kick drum: window event "lofi-kick-drum" ──► Hero's useBeatEffects (sun thump, notes)
```
