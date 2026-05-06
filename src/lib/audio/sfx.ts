'use client'

/**
 * Tiny WebAudio synth for UI / footstep / emote SFX.
 * No external deps, no audio file fetches — every sound is procedurally
 * generated from oscillators + envelopes.
 *
 * The AudioContext is lazily created on first user gesture (browsers block
 * AudioContext.resume() until then). Volume is gated by useSettingsStore.
 */
let ctx: AudioContext | null = null
let masterGain: GainNode | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const Ctor =
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  masterGain = ctx.createGain()
  masterGain.gain.value = 0.6
  masterGain.connect(ctx.destination)
  return ctx
}

export function setSfxVolume(volume: number) {
  if (!masterGain) return
  masterGain.gain.value = Math.max(0, Math.min(1, volume))
}

function envelope(
  audio: AudioContext,
  attack = 0.005,
  decay = 0.12,
  peak = 1,
): GainNode {
  const g = audio.createGain()
  const now = audio.currentTime
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(peak, now + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay)
  return g
}

function tone(
  audio: AudioContext,
  freq: number,
  attack: number,
  decay: number,
  peak = 0.4,
  type: OscillatorType = 'sine',
) {
  const osc = audio.createOscillator()
  osc.type = type
  osc.frequency.value = freq
  const env = envelope(audio, attack, decay, peak)
  osc.connect(env)
  env.connect(masterGain!)
  const now = audio.currentTime
  osc.start(now)
  osc.stop(now + attack + decay + 0.05)
}

export function playFootstep() {
  const audio = getCtx()
  if (!audio || !masterGain) return
  // Soft thud: low sine + noise burst
  const noise = audio.createBufferSource()
  const buffer = audio.createBuffer(1, audio.sampleRate * 0.06, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length / 4))
  }
  noise.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800
  const env = envelope(audio, 0.002, 0.08, 0.18)
  noise.connect(filter)
  filter.connect(env)
  env.connect(masterGain)
  noise.start()
  noise.stop(audio.currentTime + 0.1)

  tone(audio, 80, 0.001, 0.06, 0.16, 'sine')
}

export function playClick() {
  const audio = getCtx()
  if (!audio) return
  tone(audio, 1200, 0.001, 0.06, 0.18, 'square')
  tone(audio, 800, 0.005, 0.08, 0.1, 'sine')
}

export function playEmote(kind: 'wave' | 'dance' | 'sit' | 'clap') {
  const audio = getCtx()
  if (!audio) return
  switch (kind) {
    case 'wave':
      tone(audio, 660, 0.003, 0.18, 0.22, 'triangle')
      window.setTimeout(() => tone(audio, 880, 0.003, 0.18, 0.22, 'triangle'), 100)
      break
    case 'dance':
      tone(audio, 440, 0.005, 0.2, 0.18, 'sawtooth')
      window.setTimeout(() => tone(audio, 660, 0.005, 0.2, 0.18, 'sawtooth'), 90)
      window.setTimeout(() => tone(audio, 880, 0.005, 0.2, 0.18, 'sawtooth'), 180)
      window.setTimeout(() => tone(audio, 1100, 0.005, 0.22, 0.2, 'sawtooth'), 270)
      break
    case 'sit':
      tone(audio, 220, 0.005, 0.25, 0.16, 'sine')
      tone(audio, 165, 0.005, 0.3, 0.14, 'sine')
      break
    case 'clap':
      for (let i = 0; i < 4; i++) {
        window.setTimeout(() => {
          const noise = audio.createBufferSource()
          const buffer = audio.createBuffer(1, audio.sampleRate * 0.04, audio.sampleRate)
          const data = buffer.getChannelData(0)
          for (let j = 0; j < data.length; j++) {
            data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (data.length / 6))
          }
          noise.buffer = buffer
          const filter = audio.createBiquadFilter()
          filter.type = 'highpass'
          filter.frequency.value = 2400
          const env = envelope(audio, 0.001, 0.05, 0.22)
          noise.connect(filter)
          filter.connect(env)
          env.connect(masterGain!)
          noise.start()
        }, i * 120)
      }
      break
  }
}

export function playToast() {
  const audio = getCtx()
  if (!audio) return
  tone(audio, 880, 0.005, 0.12, 0.2, 'sine')
  window.setTimeout(() => tone(audio, 1320, 0.005, 0.18, 0.18, 'sine'), 60)
}

export function playAchievement() {
  const audio = getCtx()
  if (!audio) return
  // Cheery 4-note arpeggio
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => {
    window.setTimeout(() => tone(audio, f, 0.005, 0.18, 0.22, 'triangle'), i * 90)
  })
}
