// A polaroid photo with a handwritten caption. Without a photo it shows a striped placeholder.

import './PolaroidPhoto.css'

export default function PolaroidPhoto({ src, caption }) {
  return (
    <figure className="polaroid-photo">
      {src ? <img src={src} alt={caption} draggable="false" /> : <div className="polaroid-placeholder">your photo here</div>}
      <figcaption className="handwritten">{caption}</figcaption>
    </figure>
  )
}
