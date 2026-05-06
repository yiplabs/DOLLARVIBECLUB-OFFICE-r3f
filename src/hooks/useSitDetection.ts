'use client'
import { useEffect } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import type { RoomTheme } from '@/lib/rooms/themes'

const SIT_TRIGGER_DISTANCE = 0.6
const STILL_THRESHOLD_MS = 1500

const CHAIR_MODELS = new Set(['chairDesk', 'chairCushion'])

/**
 * If the avatar comes to rest within {@link SIT_TRIGGER_DISTANCE} cells of a
 * chair piece for more than {@link STILL_THRESHOLD_MS}, automatically applies
 * the sit emote. Disabled while the user manually emotes anything else.
 */
export function useSitDetection(theme: RoomTheme, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    let stillSinceMs: number | null = null
    let lastPos = useAvatarStore.getState().pos
    let lastTrigger: [number, number] | null = null

    const id = window.setInterval(() => {
      const state = useAvatarStore.getState()
      const cur = state.pos
      const moved = Math.hypot(cur[0] - lastPos[0], cur[1] - lastPos[1]) > 0.05
      lastPos = cur

      if (state.path.length > 0 || moved || state.emote !== 'idle') {
        stillSinceMs = null
        lastTrigger = null
        return
      }
      if (stillSinceMs == null) stillSinceMs = Date.now()
      if (Date.now() - stillSinceMs < STILL_THRESHOLD_MS) return

      // Find the closest chair within trigger distance.
      let closest: { dist: number; pos: [number, number] } | null = null
      for (const f of theme.furniture) {
        if (!CHAIR_MODELS.has(f.model)) continue
        const d = Math.hypot(f.position[0] - cur[0], f.position[1] - cur[1])
        if (d > SIT_TRIGGER_DISTANCE + 0.6) continue
        if (!closest || d < closest.dist) {
          closest = { dist: d, pos: f.position }
        }
      }
      if (!closest) return

      // Avoid re-triggering on the same chair until the player moves away.
      if (
        lastTrigger &&
        lastTrigger[0] === closest.pos[0] &&
        lastTrigger[1] === closest.pos[1]
      ) {
        return
      }
      lastTrigger = closest.pos
      state.setEmote('sit')
    }, 600)

    return () => window.clearInterval(id)
  }, [theme, enabled])
}
