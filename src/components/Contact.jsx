import { useEffect } from 'react'
import { links } from '../data'

const KEYS = [
  { k: 'M', href: `mailto:${links.email}`, title: 'Mail me', text: links.email },
  { k: 'G', href: links.github, title: 'GitHub', text: 'Where the code lives' },
  { k: 'L', href: links.linkedin, title: 'LinkedIn', text: 'The professional me' },
  { k: 'Y', href: links.youtube, title: 'YouTube', text: 'Telugu tech, Jan 2027' },
  { k: 'R', href: links.resume, title: 'Resume', text: 'One click away' },
]

export default function Contact() {
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
      // A full-screen dialog (the journey map) owns the keyboard while it's open
      if (document.querySelector('[aria-modal="true"]')) return
      const hit = KEYS.find((x) => x.k === e.key.toUpperCase())
      if (!hit) return
      if (hit.href.startsWith('mailto:')) window.location.href = hit.href
      else window.open(hit.href, '_blank', 'noopener')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section id="hello" className="contact" aria-labelledby="hello-title">
      <div className="wrap">
        <h2 id="hello-title">Got a project, a role, or a bug that won’t die?</h2>
        <p className="lede">I reply fast. Faster if it involves AI or food.</p>
        <p className="hand">psst, these work on your keyboard too</p>
        <ul className="keys">
          {KEYS.map((x) => (
            <li key={x.k}>
              <a href={x.href} target={x.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                <kbd>{x.k}</kbd>
                <strong>{x.title}</strong>
                <span>{x.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Avinash Reddy Konala</span>
        <span>Built with React, from Bhimavaram to Hyderabad.</span>
      </footer>
    </section>
  )
}
