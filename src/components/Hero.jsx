import { useEffect, useRef, useState } from 'react'
import cutout from '../assets/avinash-cutout.png'
import { profile, projects, ratings } from '../data'
import { scrollToSection } from '../lib/scroll'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Play() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  )
}

const go = (id) => (e) => {
  e.preventDefault()
  scrollToSection(document.getElementById(id), { duration: 900 })
}

// The line under my name: the bold part cycles through what I build
const BUILDS = ['RAG systems', 'MERN apps', 'n8n automations', 'AI that answers the question you actually asked']

// Proof, floating around the sun. Numbers come from data.js.
const hr = projects.find((p) => p.id === 'hr-chatbot')
const careops = projects.find((p) => p.id === 'careops')
const leet = ratings.find((r) => r.platform === 'LeetCode')
const CHIPS = [
  hr && { id: 'rag', value: hr.stats[0].value, label: 'RAG challenge', detail: `${hr.name}, NIAT RAG Challenge`, to: 'work', pos: 'c1' },
  careops && { id: 'hack', value: careops.stats[0].value, label: 'hackathon build', detail: `${careops.name}, idea to demo`, to: 'work', pos: 'c2' },
  leet && { id: 'leet', value: leet.value.toLocaleString('en-IN'), label: 'LeetCode', detail: 'Grinding one contest at a time', to: 'stack', pos: 'c3' },
].filter(Boolean)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function RotatingBuild() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion()) return
    const t = setInterval(() => setI((n) => (n + 1) % BUILDS.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <p className="hero-sub">
      <span className="sr-only">{profile.headline}</span>
      <span aria-hidden="true">
        I build{' '}
        <span className="hero-rotor">
          <strong key={i}>{BUILDS[i]}</strong>
        </span>
        .
      </span>
    </p>
  )
}

export default function Hero({ playing, onToggleMusic }) {
  const heroRef = useRef(null)
  const sunRef = useRef(null)
  const notesRef = useRef(null)

  // Depth: photo, sun and chips drift a little with the mouse, each by a different amount
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let frame = 0
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      hero.style.setProperty('--px', x.toFixed(4))
      hero.style.setProperty('--py', y.toFixed(4))
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const r = hero.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      if (!frame) frame = requestAnimationFrame(tick)
    }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // On every kick drum: the sun thumps, a ring ripples out, a note floats up
  useEffect(() => {
    if (!playing || reducedMotion()) return
    const onKick = () => {
      const sun = sunRef.current
      if (!sun) return
      sun.animate([{ scale: 1.045 }, { scale: 1 }], { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' })
      const ring = document.createElement('span')
      ring.className = 'hero-ring'
      sun.parentElement.appendChild(ring)
      ring.animate(
        [
          { opacity: 0.55, transform: 'translateX(-50%) scale(1)' },
          { opacity: 0, transform: 'translateX(-50%) scale(1.22)' },
        ],
        { duration: 1400, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
      ).onfinish = () => ring.remove()
      const notes = notesRef.current
      if (notes) {
        const n = document.createElement('span')
        n.className = 'hero-note-fly'
        n.textContent = Math.random() < 0.5 ? '♪' : '♫'
        notes.appendChild(n)
        const dx = (Math.random() - 0.3) * 90
        n.animate(
          [
            { opacity: 0, transform: 'translate(0, 0) rotate(0deg) scale(0.6)' },
            { opacity: 1, offset: 0.15 },
            { opacity: 0, transform: `translate(${dx}px, -150px) rotate(${dx / 3}deg) scale(1.1)` },
          ],
          { duration: 2200, easing: 'ease-out' }
        ).onfinish = () => n.remove()
      }
    }
    window.addEventListener('lofi-kick', onKick)
    return () => window.removeEventListener('lofi-kick', onKick)
  }, [playing])

  return (
    <section className={`hero ${playing ? 'is-playing' : ''}`} ref={heroRef} aria-labelledby="hero-title">
      <div className="wrap hero-copy">
        <p className="hero-eyebrow">AI builder<span className="hero-eyebrow-loc"> · Bhimavaram → Hyderabad</span></p>
        <h1 id="hero-title">
          Hey, I’m {profile.short}<span className="hero-dot" aria-hidden="true">.</span>
        </h1>
        <RotatingBuild />
      </div>

      {/* Stage = the photo plus the proof chips. Chips float around the sun on wide
          screens and line up above the photo on phones. */}
      <div className="hero-stage">
      <div className="hero-chips">
        {CHIPS.map((c) => (
          <a key={c.id} className={`hero-chip ${c.pos}`} href={`#${c.to}`} onClick={go(c.to)}>
            <strong>{c.value}</strong>
            <span>{c.label}</span>
            <em>{c.detail}</em>
          </a>
        ))}
      </div>
      <div className="hero-figure">
        <span className="hero-sun" ref={sunRef} aria-hidden="true" />
        <img
          className="hero-photo"
          src={cutout}
          alt="Avinash in yellow sunglasses and yellow headphones, wearing a navy blazer"
          width="720"
          height="720"
          fetchPriority="high"
        />

        {/* The headphones in the photo are the play button */}
        <button
          type="button"
          className="hero-phones"
          onClick={onToggleMusic}
          aria-pressed={playing}
          aria-label={playing ? 'Stop the lo-fi music' : 'Play some lo-fi music'}
        >
          <span className="hero-phones-ring" aria-hidden="true" />
        </button>
        <span className="hero-notes" ref={notesRef} aria-hidden="true" />
        <p className="hero-note hand" aria-hidden="true">
          {playing ? 'now playing: lo-fi, made in code ♪' : 'psst, tap my headphones ↙'}
        </p>

        <div className="hero-ctas">
          <a className="hero-btn hero-btn-primary" href="#work" onClick={go('work')}>
            See my work <Arrow />
          </a>
          <a className="hero-btn hero-btn-ghost" href="#journey" onClick={go('journey')}>
            <Play /> Walk my journey
          </a>
        </div>
      </div>
      </div>
    </section>
  )
}
