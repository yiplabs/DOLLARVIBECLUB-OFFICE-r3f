'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'

const TIME_PRESETS: Record<TimeOfDay, {
  ambient: string
  ambientIntensity: number
  sun: string
  sunIntensity: number
  fog: string
}> = {
  dawn: {
    ambient: '#FFD9B0',
    ambientIntensity: 0.55,
    sun: '#FF9966',
    sunIntensity: 0.85,
    fog: '#FFE5C2',
  },
  morning: {
    ambient: '#FFF6E0',
    ambientIntensity: 0.7,
    sun: '#FFE5B0',
    sunIntensity: 1.2,
    fog: '#FFEFD5',
  },
  noon: {
    ambient: '#FFFFFF',
    ambientIntensity: 0.85,
    sun: '#FFFCEB',
    sunIntensity: 1.5,
    fog: '#F5F0E0',
  },
  afternoon: {
    ambient: '#FFEFC9',
    ambientIntensity: 0.65,
    sun: '#FFD089',
    sunIntensity: 1.1,
    fog: '#FFE5BE',
  },
  dusk: {
    ambient: '#9966B0',
    ambientIntensity: 0.45,
    sun: '#E66A55',
    sunIntensity: 0.7,
    fog: '#7E587A',
  },
  night: {
    ambient: '#2A3A55',
    ambientIntensity: 0.3,
    sun: '#7B8DAE',
    sunIntensity: 0.35,
    fog: '#0A0A1E',
  },
}

export type SettingsState = {
  timeOfDay: TimeOfDay
  musicVolume: number // 0..1
  musicPlaying: boolean
  sfxVolume: number
  showWalkPreview: boolean
  showHoverCell: boolean
  showOnboarding: boolean
  showPerfHud: boolean
  cameraFollow: boolean
  petEnabled: boolean
  setTimeOfDay: (t: TimeOfDay) => void
  setMusicVolume: (v: number) => void
  toggleMusic: () => void
  setSfxVolume: (v: number) => void
  setShowWalkPreview: (b: boolean) => void
  setShowHoverCell: (b: boolean) => void
  setShowPerfHud: (b: boolean) => void
  setCameraFollow: (b: boolean) => void
  setPetEnabled: (b: boolean) => void
  dismissOnboarding: () => void
  resetOnboarding: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      timeOfDay: 'morning',
      musicVolume: 0.4,
      musicPlaying: false,
      sfxVolume: 0.6,
      showWalkPreview: true,
      showHoverCell: true,
      showOnboarding: true,
      showPerfHud: false,
      cameraFollow: true,
      petEnabled: false,
      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
      setMusicVolume: (musicVolume) =>
        set({ musicVolume: Math.max(0, Math.min(1, musicVolume)) }),
      toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
      setSfxVolume: (sfxVolume) =>
        set({ sfxVolume: Math.max(0, Math.min(1, sfxVolume)) }),
      setShowWalkPreview: (showWalkPreview) => set({ showWalkPreview }),
      setShowHoverCell: (showHoverCell) => set({ showHoverCell }),
      setShowPerfHud: (showPerfHud) => set({ showPerfHud }),
      setCameraFollow: (cameraFollow) => set({ cameraFollow }),
      setPetEnabled: (petEnabled) => set({ petEnabled }),
      dismissOnboarding: () => set({ showOnboarding: false }),
      resetOnboarding: () => set({ showOnboarding: true }),
    }),
    {
      name: 'dvc_settings_v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        }
        return window.localStorage
      }),
      partialize: (s) => ({
        timeOfDay: s.timeOfDay,
        musicVolume: s.musicVolume,
        sfxVolume: s.sfxVolume,
        showWalkPreview: s.showWalkPreview,
        showHoverCell: s.showHoverCell,
        showOnboarding: s.showOnboarding,
        showPerfHud: s.showPerfHud,
        cameraFollow: s.cameraFollow,
        petEnabled: s.petEnabled,
      }),
    },
  ),
)

export function getTimeOfDayPreset(t: TimeOfDay) {
  return TIME_PRESETS[t]
}

export const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string; emoji: string }[] = [
  { value: 'dawn', label: 'dawn', emoji: '🌅' },
  { value: 'morning', label: 'morning', emoji: '☀️' },
  { value: 'noon', label: 'noon', emoji: '🌞' },
  { value: 'afternoon', label: 'afternoon', emoji: '🌤️' },
  { value: 'dusk', label: 'dusk', emoji: '🌆' },
  { value: 'night', label: 'night', emoji: '🌙' },
]
