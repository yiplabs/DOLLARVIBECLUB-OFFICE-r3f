'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Achievement = {
  id: string
  title: string
  body: string
  emoji: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', title: 'first step', body: 'you walked your first tile', emoji: '👟' },
  { id: 'first-emote', title: 'expressive', body: 'you fired your first emote', emoji: '✨' },
  { id: 'first-chat', title: 'said hi', body: 'sent your first chat bubble', emoji: '💬' },
  { id: 'all-rooms', title: 'tour de cowork', body: 'visited all 6 rooms', emoji: '🗺️' },
  { id: '100-steps', title: 'cracked', body: 'walked 100 grid cells', emoji: '🔥' },
  { id: 'first-pomo', title: 'one pomodoro', body: 'finished a focus session', emoji: '🍅' },
  { id: 'sit-master', title: 'committed sitter', body: 'sat for 30 seconds straight', emoji: '🪑' },
  { id: 'night-owl', title: 'night owl', body: 'visited at night-time of day', emoji: '🌙' },
  { id: 'crown-on', title: 'royalty', body: 'wore the crown accessory', emoji: '👑' },
  { id: 'deep-focus', title: 'in the zone', body: 'visited deep focus', emoji: '🎧' },
]

type State = {
  unlocked: Record<string, number> // achievement id → unlocked-at timestamp
  visitedRooms: Record<string, number> // slug → timestamp
  unlock: (id: string) => Achievement | null
  recordRoomVisit: (slug: string) => void
  hasUnlocked: (id: string) => boolean
  reset: () => void
}

export const useAchievementsStore = create<State>()(
  persist(
    (set, get) => ({
      unlocked: {},
      visitedRooms: {},
      unlock: (id) => {
        if (get().unlocked[id]) return null
        const ach = ACHIEVEMENTS.find((a) => a.id === id)
        if (!ach) return null
        set((s) => ({ unlocked: { ...s.unlocked, [id]: Date.now() } }))
        return ach
      },
      recordRoomVisit: (slug) => {
        set((s) => ({
          visitedRooms: { ...s.visitedRooms, [slug]: Date.now() },
        }))
      },
      hasUnlocked: (id) => Boolean(get().unlocked[id]),
      reset: () => set({ unlocked: {}, visitedRooms: {} }),
    }),
    {
      name: 'dvc_achievements_v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        }
        return window.localStorage
      }),
    },
  ),
)
