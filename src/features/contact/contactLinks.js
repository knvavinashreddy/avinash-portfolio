// The five ways to reach me, each with a keyboard key that works anywhere on the page.

import { links } from '../../data/links'

export const contactShortcuts = [
  { key: 'M', href: `mailto:${links.email}`, title: 'Mail me', text: links.email },
  { key: 'G', href: links.github, title: 'GitHub', text: 'Where the code lives' },
  { key: 'L', href: links.linkedin, title: 'LinkedIn', text: 'The professional me' },
  { key: 'Y', href: links.youtube, title: 'YouTube', text: 'Telugu tech, Jan 2027' },
  { key: 'R', href: links.resume, title: 'Resume', text: 'One click away' },
]

export const isEmailLink = (href) => href.startsWith('mailto:')
