'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AvatarConfig } from '@/lib/avatar/types'
import { AVATAR_PRESETS, DEFAULT_AVATAR } from '@/lib/avatar/presets'

const guestName = () =>
  'guest_' + Math.random().toString(36).slice(2, 6)

export type EmoteKind = 'idle' | 'wave' | 'dance' | 'sit' | 'clap'

type AvatarState = {
  config: AvatarConfig
  pos: [number, number]
  path: [number, number][]
  emote: EmoteKind
  /** undefined = sustained (e.g. sit); a number = epoch ms when the emote auto-clears. */
  emoteExpiresAt: number | undefined
  hasSetup: boolean
  setConfig: (patch: Partial<AvatarConfig>) => void
  replaceConfig: (config: AvatarConfig) => void
  applyPreset: (presetId: string) => void
  setPos: (pos: [number, number]) => void
  setPath: (path: [number, number][]) => void
  clearPath: () => void
  setEmote: (kind: EmoteKind, durationMs?: number) => void
  markSetup: () => void
  reset: () => void
}

const initialConfig: AvatarConfig = {
  ...DEFAULT_AVATAR,
  displayName: guestName(),
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      config: initialConfig,
      pos: [7, 12],
      path: [],
      emote: 'idle',
      emoteExpiresAt: undefined,
      hasSetup: false,
      setConfig: (patch) =>
        set((s) => ({ config: { ...s.config, ...patch } })),
      replaceConfig: (config) => set({ config }),
      applyPreset: (presetId) => {
        const preset = AVATAR_PRESETS.find((p) => p.id === presetId)
        if (!preset) return
        set((s) => ({
          config: { ...preset.config, displayName: s.config.displayName },
        }))
      },
      setPos: (pos) => set({ pos }),
      setPath: (path) => set({ path }),
      clearPath: () => set({ path: [] }),
      setEmote: (kind, durationMs) =>
        set({
          emote: kind,
          emoteExpiresAt:
            kind === 'idle' || kind === 'sit' || durationMs === undefined
              ? undefined
              : Date.now() + durationMs,
        }),
      markSetup: () => set({ hasSetup: true }),
      reset: () =>
        set({
          config: { ...DEFAULT_AVATAR, displayName: guestName() },
          pos: [7, 12],
          path: [],
          emote: 'idle',
          emoteExpiresAt: undefined,
          hasSetup: false,
        }),
    }),
    {
      name: 'dvc_avatar_v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return window.localStorage
      }),
      // Don't persist transient runtime state
      partialize: (s) => ({ config: s.config, hasSetup: s.hasSetup }),
    },
  ),
)

