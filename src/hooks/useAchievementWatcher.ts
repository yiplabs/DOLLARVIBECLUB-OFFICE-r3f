'use client'
import { useEffect, useRef } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore } from '@/store/roomStore'
import { ROOMS } from '@/lib/rooms/catalog'
import { useAchievementsStore } from '@/store/achievementsStore'
import { useToast } from '@/components/chrome/ToastProvider'
import { useSettingsStore } from '@/store/settingsStore'

/**
 * Centralized watcher that subscribes to all the right stores and unlocks
 * achievements as conditions are met. Fires friendly toasts on unlock.
 */
export function useAchievementWatcher(slug: string) {
  const { push } = useToast()
  const sitStartedAt = useRef<number | null>(null)

  useEffect(() => {
    const ach = useAchievementsStore.getState()
    ach.recordRoomVisit(slug)

    const unlock = (id: string) => {
      const result = ach.unlock(id)
      if (!result) return
      push(`${result.emoji} ${result.title} — ${result.body}`, 'success')
    }

    // First time visiting deep-focus
    if (slug === 'deep-focus') unlock('deep-focus')

    // All rooms visited?
    const visited = useAchievementsStore.getState().visitedRooms
    if (ROOMS.every((r) => visited[r.slug])) unlock('all-rooms')

    // Time of day check
    const tod = useSettingsStore.getState().timeOfDay
    if (tod === 'night') unlock('night-owl')

    // Subscribe: first walk
    const unsubPath = useAvatarStore.subscribe((s, prev) => {
      if (s.path.length > 0 && prev.path.length === 0) {
        unlock('first-step')
      }
    })

    // Subscribe: emotes
    const unsubEmote = useAvatarStore.subscribe((s, prev) => {
      if (s.emote !== prev.emote) {
        if (s.emote !== 'idle') unlock('first-emote')
        if (s.emote === 'sit') {
          sitStartedAt.current = Date.now()
        } else if (prev.emote === 'sit' && sitStartedAt.current) {
          const sitFor = Date.now() - sitStartedAt.current
          if (sitFor >= 30_000) unlock('sit-master')
          sitStartedAt.current = null
        }
      }
    })

    // Subscribe: bubbles (chat sent)
    const unsubBubbles = useRoomStore.subscribe((s, prev) => {
      if (s.bubbles.length > prev.bubbles.length) {
        const latest = s.bubbles[s.bubbles.length - 1]
        if (latest?.userId === 'local') unlock('first-chat')
      }
    })

    // Subscribe: accessory worn
    const unsubAccessory = useAvatarStore.subscribe((s, prev) => {
      if (s.config.accessory !== prev.config.accessory) {
        if (s.config.accessory === 'crown') unlock('crown-on')
      }
    })

    // Step counter for 100-steps
    let stepCount = 0
    let lastPos = useAvatarStore.getState().pos
    let acc = 0
    const unsubSteps = useAvatarStore.subscribe((s) => {
      const dx = s.pos[0] - lastPos[0]
      const dz = s.pos[1] - lastPos[1]
      const d = Math.hypot(dx, dz)
      if (d > 0.01) {
        acc += d
        const stepped = Math.floor(acc)
        if (stepped > 0) {
          stepCount += stepped
          acc -= stepped
          if (stepCount >= 100) unlock('100-steps')
        }
        lastPos = s.pos
      }
    })

    return () => {
      unsubPath()
      unsubEmote()
      unsubBubbles()
      unsubAccessory()
      unsubSteps()
    }
  }, [slug, push])
}
