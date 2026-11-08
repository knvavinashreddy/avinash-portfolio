// Entry point: loads the global styles, then renders <App /> into <div id="root"> in index.html.
//
// The global stylesheets are imported FIRST, on purpose: CSS that loads later wins when
// two rules are equally specific, so each component's own CSS (imported inside App's files)
// must come after these shared defaults.

import './styles/tokens.css'
import './styles/base.css'
import './styles/effects.css'
import './styles/sectionThemes.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
