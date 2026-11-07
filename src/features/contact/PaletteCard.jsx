// The five colours of this site, shown like a colour swatch sheet.

import './PaletteCard.css'

const PALETTE = [
  { className: 'palette-chicory', hex: '#A33C52', name: 'Red Chicory.' },
  { className: 'palette-mustard', hex: '#DBC977', name: 'Mustard Oil.' },
  { className: 'palette-beige', hex: '#F8F1DF', name: 'Breezy Beige.' },
  { className: 'palette-lime', hex: '#D4E79E', name: 'Lime Cream' },
  { className: 'palette-light-blue', hex: '#ADD8E6', name: 'Light Blue' },
]

export default function PaletteCard() {
  return (
    <ul className="palette-card" aria-label="The colours of this site">
      {PALETTE.map((colour, i) => (
        <li key={colour.className} className={colour.className}>
          <span>COLOR {String(i + 1).padStart(2, '0')} <em>{colour.hex}</em></span>
          <strong>{colour.name}</strong>
        </li>
      ))}
    </ul>
  )
}
