// Footer line at the very bottom of the page.

import './SiteFooter.css'

export default function SiteFooter() {
  return (
    <footer className="page-container site-footer">
      <span>© {new Date().getFullYear()} Avinash Reddy Konala</span>
      <span>Built with React, from Bhimavaram to Hyderabad.</span>
    </footer>
  )
}
