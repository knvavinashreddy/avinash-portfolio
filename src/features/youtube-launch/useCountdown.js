// Time left until a date, updated every second.
// Returns { days, hours, minutes, seconds, isFinished }.

import { useEffect, useState } from 'react'

function timeLeftUntil(date) {
  const milliseconds = Math.max(0, new Date(date).getTime() - Date.now())
  return {
    days: Math.floor(milliseconds / 864e5),
    hours: Math.floor((milliseconds / 36e5) % 24),
    minutes: Math.floor((milliseconds / 6e4) % 60),
    seconds: Math.floor((milliseconds / 1e3) % 60),
    isFinished: milliseconds === 0,
  }
}

export function useCountdown(date) {
  const [timeLeft, setTimeLeft] = useState(() => timeLeftUntil(date))
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(timeLeftUntil(date)), 1000)
    return () => clearInterval(timer)
  }, [date])
  return timeLeft
}
