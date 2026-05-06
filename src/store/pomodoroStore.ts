'use client'
import { create } from 'zustand'

export type PomodoroPhase = 'work' | 'break' | 'idle'

type PomodoroState = {
  phase: PomodoroPhase
  endsAt: number | null
  sessionsCompleted: number
  workMinutes: number
  breakMinutes: number
  start: (phase: 'work' | 'break') => void
  pause: () => void
  reset: () => void
  tick: () => void
  configure: (workMinutes: number, breakMinutes: number) => void
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  phase: 'idle',
  endsAt: null,
  sessionsCompleted: 0,
  workMinutes: 25,
  breakMinutes: 5,
  start: (phase) => {
    const minutes = phase === 'work' ? get().workMinutes : get().breakMinutes
    set({ phase, endsAt: Date.now() + minutes * 60 * 1000 })
  },
  pause: () => set({ phase: 'idle', endsAt: null }),
  reset: () => set({ phase: 'idle', endsAt: null, sessionsCompleted: 0 }),
  tick: () => {
    const { phase, endsAt, sessionsCompleted } = get()
    if (phase === 'idle' || !endsAt) return
    if (Date.now() >= endsAt) {
      // Auto-roll to the next phase.
      if (phase === 'work') {
        set({
          phase: 'break',
          endsAt: Date.now() + get().breakMinutes * 60 * 1000,
          sessionsCompleted: sessionsCompleted + 1,
        })
      } else {
        set({
          phase: 'work',
          endsAt: Date.now() + get().workMinutes * 60 * 1000,
        })
      }
    }
  },
  configure: (workMinutes, breakMinutes) => set({ workMinutes, breakMinutes }),
}))
