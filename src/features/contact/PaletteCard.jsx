// The colours of this site, shown like a swatch sheet: one row per colour family, light → dark.

import './PaletteCard.css'

const PALETTE_FAMILIES = [
  { family: 'Blue', colours: [['Ice Blue', '#D6E6F3'], ['Powder Blue', '#A6C5D7'], ['Sapphire', '#0F52BA'], ['Deep Navy', '#000926']] },
  { family: 'Green', colours: [['Mint Whisper', '#D1F2EB'], ['Emerald Green', '#50C878'], ['Forest Green', '#0B6E4F'], ['Dark Evergreen', '#013220']] },
  { family: 'Purple', colours: [['Lilac Mist', '#E6C7E6'], ['Soft Violet', '#A3779D'], ['Royal Amethyst', '#663399'], ['Midnight Plum', '#2E1A47']] },
  { family: 'Red', colours: [['Soft Blush', '#FBE4E3'], ['Crimson Silk', '#D72638'], ['Ruby Red', '#98111E'], ['Deep Bordeaux', '#3F0D12']] },
  { family: 'Rose', colours: [['Blush Pink', '#FADADD'], ['Rose Gold', '#B66E79'], ['Muted Copper', '#8C4E4F'], ['Dark Mahogany', '#3B1F1B']] },
]

// light swatches get dark text, dark ones light text (decided by how bright the colour is)
function isLightSwatch(hex) {
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5
}

export default function PaletteCard() {
  return (
    <ul className="palette-card" aria-label="The colours of this site">
      {PALETTE_FAMILIES.flatMap(({ family, colours }) =>
        colours.map(([name, hex]) => (
          <li
            key={hex}
            className={isLightSwatch(hex) ? 'palette-swatch is-light' : 'palette-swatch is-dark'}
            style={{ background: hex }}
            title={`${family} · ${name}`}
          >
            <span>{hex}</span>
            <strong>{name}</strong>
          </li>
        ))
      )}
    </ul>
  )
}
