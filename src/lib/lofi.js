// A tiny lo-fi loop made entirely with the Web Audio API.
// No audio files, no licences to worry about.

const CHORDS = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 349.23], // G7
]

export function createLofi() {
  let ctx = null
  let out = null
  let timer = null
  let step = 0
  const beat = 60 / 74

  function chord(freqs, t, dur) {
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      o.detune.value = (i - 1.5) * 4
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.06, t + 0.25)
      g.gain.setValueAtTime(0.06, t + dur - 0.4)
      g.gain.linearRampToValueAtTime(0, t + dur)
      o.connect(g).connect(out)
      o.start(t)
      o.stop(t + dur + 0.05)
    })
  }

  function kick(t) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(130, t)
    o.frequency.exponentialRampToValueAtTime(45, t + 0.18)
    g.gain.setValueAtTime(0.5, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    o.connect(g).connect(out)
    o.start(t)
    o.stop(t + 0.32)
  }

  function hat(t) {
    const len = Math.floor(ctx.sampleRate * 0.05)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const s = ctx.createBufferSource()
    const hp = ctx.createBiquadFilter()
    const g = ctx.createGain()
    hp.type = 'highpass'
    hp.frequency.value = 7000
    g.gain.value = 0.05
    s.buffer = buf
    s.connect(hp).connect(g).connect(out)
    s.start(t)
  }

  function tick() {
    const t = ctx.currentTime + 0.05
    if (step % 4 === 0) chord(CHORDS[(step / 4) % CHORDS.length], t, beat * 4)
    if (step % 4 === 0 || step % 4 === 2) kick(t)
    hat(t + beat / 2)
    step++
  }

  return {
    start() {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return false
      ctx = new AC()
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 1400
      out = ctx.createGain()
      out.gain.value = 0.9
      out.connect(lp).connect(ctx.destination)
      step = 0
      tick()
      timer = setInterval(tick, beat * 1000)
      return true
    },
    stop() {
      clearInterval(timer)
      timer = null
      if (ctx) ctx.close()
      ctx = null
    },
  }
}
