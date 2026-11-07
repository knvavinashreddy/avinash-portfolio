// A tiny lo-fi loop made entirely in code with the Web Audio API.
// No audio files, no licences to worry about.
//
// How it works: every beat, `playBeat()` schedules sounds a few milliseconds ahead:
//   - every 4 beats: a soft 4-note chord (the chord progression below)
//   - beats 1 and 3 of each bar: a kick drum (a quick low "boom")
//   - between every beat: a hi-hat (a tiny burst of filtered noise)
// Everything goes through a low-pass filter, which gives the warm, muffled lo-fi sound.

const BEATS_PER_MINUTE = 74
const SECONDS_PER_BEAT = 60 / BEATS_PER_MINUTE

// Chord progression: Cmaj7 → Am7 → Fmaj7 → G7 (note frequencies in hertz)
const CHORD_PROGRESSION = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 349.23], // G7
]

// onKickDrum is called in time with each kick drum, so the page can move to the beat
export function createLofiPlayer({ onKickDrum } = {}) {
  let audio = null // the AudioContext, created on start
  let mixer = null // everything plays into this, then through the warm filter
  let beatTimer = null
  let beatNumber = 0

  function playChord(frequencies, startTime, duration) {
    frequencies.forEach((frequency, i) => {
      const oscillator = audio.createOscillator()
      const volume = audio.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      oscillator.detune.value = (i - 1.5) * 4 // tiny detune between notes = warmer sound
      // fade in, hold, fade out
      volume.gain.setValueAtTime(0, startTime)
      volume.gain.linearRampToValueAtTime(0.06, startTime + 0.25)
      volume.gain.setValueAtTime(0.06, startTime + duration - 0.4)
      volume.gain.linearRampToValueAtTime(0, startTime + duration)
      oscillator.connect(volume).connect(mixer)
      oscillator.start(startTime)
      oscillator.stop(startTime + duration + 0.05)
    })
  }

  function playKickDrum(startTime) {
    // tell the page exactly when the kick is heard (it's scheduled slightly in the future)
    if (onKickDrum) setTimeout(onKickDrum, Math.max(0, (startTime - audio.currentTime) * 1000))
    // a kick is a sine wave that drops quickly in pitch and fades out
    const oscillator = audio.createOscillator()
    const volume = audio.createGain()
    oscillator.frequency.setValueAtTime(130, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(45, startTime + 0.18)
    volume.gain.setValueAtTime(0.5, startTime)
    volume.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)
    oscillator.connect(volume).connect(mixer)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.32)
  }

  function playHiHat(startTime) {
    // a hi-hat is a very short burst of random noise with only the high frequencies kept
    const length = Math.floor(audio.sampleRate * 0.05)
    const noise = audio.createBuffer(1, length, audio.sampleRate)
    const samples = noise.getChannelData(0)
    for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length)
    const source = audio.createBufferSource()
    const highPass = audio.createBiquadFilter()
    const volume = audio.createGain()
    highPass.type = 'highpass'
    highPass.frequency.value = 7000
    volume.gain.value = 0.05
    source.buffer = noise
    source.connect(highPass).connect(volume).connect(mixer)
    source.start(startTime)
  }

  function playBeat() {
    const startTime = audio.currentTime + 0.05
    const beatInBar = beatNumber % 4
    if (beatInBar === 0) playChord(CHORD_PROGRESSION[(beatNumber / 4) % CHORD_PROGRESSION.length], startTime, SECONDS_PER_BEAT * 4)
    if (beatInBar === 0 || beatInBar === 2) playKickDrum(startTime)
    playHiHat(startTime + SECONDS_PER_BEAT / 2)
    beatNumber++
  }

  return {
    // returns false if this browser has no Web Audio
    start() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return false
      audio = new AudioContextClass()
      const warmFilter = audio.createBiquadFilter()
      warmFilter.type = 'lowpass'
      warmFilter.frequency.value = 1400
      mixer = audio.createGain()
      mixer.gain.value = 0.9
      mixer.connect(warmFilter).connect(audio.destination)
      beatNumber = 0
      playBeat()
      beatTimer = setInterval(playBeat, SECONDS_PER_BEAT * 1000)
      return true
    },
    stop() {
      clearInterval(beatTimer)
      beatTimer = null
      if (audio) audio.close()
      audio = null
    },
  }
}
