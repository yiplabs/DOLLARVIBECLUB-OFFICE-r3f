'use client'
import { create } from 'zustand'
import { DEFAULT_AVATAR } from '@/lib/avatar/presets'
import type { AvatarConfig } from '@/lib/avatar/types'

const LS_KEY = 'dvc_avatar_config'

type AvatarStore = {
  config: AvatarConfig
  pos: [number, number]
  /** Remaining waypoints (world-units, x/z). Empty when idle. */
  path: [number, number][]
  setConfig: (cfg: AvatarConfig) => void
  patchConfig: (patch: Partial<AvatarConfig>) => void
  setPos: (pos: [number, number]) => void
  setPath: (path: [number, number][]) => void
  loadFromStorage: () => boolean
  saveToStorage: () => void
}

const readInitial = (): AvatarConfig => {
  if (typeof window === 'undefined') return DEFAULT_AVATAR
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return DEFAULT_AVATAR
    return { ...DEFAULT_AVATAR, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_AVATAR
  }
}

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  config: readInitial(),
  pos: [7, 12],
  path: [],
  setConfig: (config) => {
    set({ config })
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(config)) } catch {}
  },
  patchConfig: (patch) => {
    const next = { ...get().config, ...patch }
    set({ config: next })
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
  },
  setPos: (pos) => set({ pos }),
  setPath: (path) => set({ path }),
  loadFromStorage: () => {
    if (typeof window === 'undefined') return false
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return false
    try {
      set({ config: { ...DEFAULT_AVATAR, ...JSON.parse(raw) } })
      return true
    } catch {
      return false
    }
  },
  saveToStorage: () => {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(get().config)) } catch {}
  },
}))

export const hasStoredAvatarConfig = () => {
  if (typeof window === 'undefined') return false
  return Boolean(window.localStorage.getItem(LS_KEY))
}
