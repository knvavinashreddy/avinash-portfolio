// The whole page, top to bottom. Start reading here.
//
//   TopBar          avatar, status, music button, Day/Night       shared/top-bar
//   Hero            "Hey, I'm Avinash." + photo on the sun          features/hero
//   Journey         the heart map                                   features/journey
//   Work            project card deck                               features/work
//   Toolkit         tools + coding ratings                          features/toolkit
//   YouTubeLaunch   channel launch countdown                        features/youtube-launch
//   LifeBoard       draggable "off the clock" board                 features/life-board
//   Guestbook       leave a note                                    features/guestbook
//   Contact         contact cards, palette, footer                  features/contact
//   SectionDock     floating navigation at the bottom               shared/section-dock
//
// App owns the two pieces of state several parts share: the theme and the music.

import Contact from './features/contact/Contact'
import Guestbook from './features/guestbook/Guestbook'
import Hero from './features/hero/Hero'
import Journey from './features/journey/Journey'
import LifeBoard from './features/life-board/LifeBoard'
import Toolkit from './features/toolkit/Toolkit'
import Work from './features/work/Work'
import YouTubeLaunch from './features/youtube-launch/YouTubeLaunch'
import { useCardGlow } from './shared/effects/useCardGlow'
import { useScrollReveal } from './shared/effects/useScrollReveal'
import { useLofiMusic } from './shared/music/useLofiMusic'
import SectionDock from './shared/section-dock/SectionDock'
import { useTheme } from './shared/theme/useTheme'
import TopBar from './shared/top-bar/TopBar'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { isMusicPlaying, toggleMusic } = useLofiMusic()
  useCardGlow()
  useScrollReveal()

  return (
    <>
      <TopBar theme={theme} onToggleTheme={toggleTheme} isMusicPlaying={isMusicPlaying} onToggleMusic={toggleMusic} />
      <main id="top">
        <Hero isMusicPlaying={isMusicPlaying} onToggleMusic={toggleMusic} />
        <Journey theme={theme} onToggleTheme={toggleTheme} />
        <Work />
        <Toolkit />
        <YouTubeLaunch />
        <LifeBoard />
        <Guestbook />
        <Contact />
      </main>
      <SectionDock />
    </>
  )
}
