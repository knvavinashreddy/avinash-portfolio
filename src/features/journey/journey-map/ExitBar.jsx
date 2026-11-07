// "Keep scrolling" bar shown at either end of the heart.
// exitProgress: -1..1 from useScrollTravel (negative = leaving backwards).
// At the last stop the forward bar is always shown (empty) as a hint that you can leave.

import './ExitBar.css'

export default function ExitBar({ exitProgress, isAtLastStop }) {
  const showForwardBar = (isAtLastStop || exitProgress > 0) && exitProgress >= 0
  const showBackBar = exitProgress < 0
  return (
    <>
      {showForwardBar && (
        <div className="exit-bar is-leaving-forward" style={{ '--exit-progress': exitProgress }} aria-hidden="true">
          <span>Keep scrolling · on to my projects ↓</span>
          <i className="exit-bar-fill" />
        </div>
      )}
      {showBackBar && (
        <div className="exit-bar is-leaving-back" style={{ '--exit-progress': -exitProgress }} aria-hidden="true">
          <span>↑ Keep scrolling · back to the journey</span>
          <i className="exit-bar-fill" />
        </div>
      )}
    </>
  )
}
