'use client'
import { useEffect, useRef } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import { useSettingsStore } from '@/store/settingsStore'
import { playEmote, playFootstep, setSfxVolume } from '@/lib/audio/sfx'

/**
 * Subscribes to the avatar store and triggers SFX on movement + emote changes.
 * Volume is bound to the settings store's sfxVolume.
 */
export function useAudioWiring() {
  const lastFootstepCell = useRef<[number, number] | null>(null)

  useEffect(() => {
    setSfxVolume(useSettingsStore.getState().sfxVolume)
    const unsubVolume = useSettingsStore.subscribe(
      (state, prev) => {
        if (state.sfxVolume !== prev.sfxVolume) setSfxVolume(state.sfxVolume)
      },
    )

    const unsubMove = useAvatarStore.subscribe((state) => {
      const cell: [number, number] = [
        Math.round(state.pos[0]),
        Math.round(state.pos[1]),
      ]
      const last = lastFootstepCell.current
      if (!last || last[0] !== cell[0] || last[1] !== cell[1]) {
        lastFootstepCell.current = cell
        if (state.path.length > 0) {
          // Only play while actively walking
          playFootstep()
        }
      }
    })

    const unsubEmote = useAvatarStore.subscribe((state, prev) => {
      if (state.emote !== prev.emote && state.emote !== 'idle') {
        playEmote(state.emote)
      }
    })

    return () => {
      unsubVolume()
      unsubMove()
      unsubEmote()
    }
  }, [])
}
