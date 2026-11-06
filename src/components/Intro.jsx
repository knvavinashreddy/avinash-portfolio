import photo from '../assets/avinash.jpg'
import { links, profile } from '../data'

export default function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="wrap intro-grid">
        <figure className="portrait">
          <img src={photo} alt="Avinash wearing yellow sunglasses and yellow headphones, in a navy blazer" />
          <figcaption className="hand">{profile.photoNote}</figcaption>
        </figure>
        <div>
          <p className="hello">hey, I’m {profile.short} 👋</p>
          <h1 id="intro-title">{profile.headline}</h1>
          <p className="lede">{profile.intro}</p>
          <p className="degree">{profile.degree}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#work">See what I built</a>
            <a className="btn" href={links.resume} target="_blank" rel="noreferrer">Open my resume</a>
          </div>
        </div>
      </div>
    </section>
  )
}
