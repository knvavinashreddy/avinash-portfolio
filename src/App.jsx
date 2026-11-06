import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Work from './components/Work'
import Stack from './components/Stack'
import YouTube from './components/YouTube'
import Life from './components/Life'
import Wall from './components/Wall'
import Contact from './components/Contact'
import Dock from './components/Dock'
import { useFx } from './lib/fx'
import { createLofi } from './lib/lofi'

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [playing, setPlaying] = useState(false)
  const lofi = useRef(null)
  useFx()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => () => lofi.current?.stop(), [])

  const toggleMusic = () => {
    if (!lofi.current) lofi.current = createLofi()
    if (playing) {
      lofi.current.stop()
      setPlaying(false)
    } else if (lofi.current.start()) {
      setPlaying(true)
    }
  }

  return (
    <>
      <Nav
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        playing={playing}
        onToggleMusic={toggleMusic}
      />
      <main id="top">
        <Hero />
        <Journey theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
        <Work />
        <Stack />
        <YouTube />
        <Life />
        <Wall />
        <Contact />
      </main>
      <Dock />
    </>
  )
}
