// Contact section: heading, the five contact cards (with keyboard shortcuts),
// the site's colour palette, and the footer.

import ContactShortcuts from './ContactShortcuts'
import PaletteCard from './PaletteCard'
import SiteFooter from './SiteFooter'
import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="contact-section section-theme-navy" aria-labelledby="contact-title">
      <div className="page-container">
        <p className="section-label">07 · Contact</p>
        <h2 id="contact-title">Got a project, a role, or a bug that won’t die?</h2>
        <p className="section-intro">I reply fast. Faster if it involves AI or food.</p>
        <p className="handwritten">psst, these work on your keyboard too</p>
        <ContactShortcuts />
        <PaletteCard />
      </div>
      <SiteFooter />
    </section>
  )
}
