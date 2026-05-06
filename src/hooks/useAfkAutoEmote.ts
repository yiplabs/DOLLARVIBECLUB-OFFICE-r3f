'use client'
import { useEffect, useRef } from 'react'
import { useAvatarStore } from '@/store/avatarStore'

const AFK_THRESHOLD_MS = 30_000

/**
 * If the player hasn't moved or emoted in 30s, gently looks around (sit emote
 * is treated as "sustained" so the avatar can chill there indefinitely).
 *
 * Cleared as soon as the player walks again or fires another emote.
 */
export function useAfkAutoEmote(enabled: boolean) {
  const lastActivity = useRef(Date.now())

  useEffect(() => {
    if (!enabled) return

    const unsubPath = useAvatarStore.subscribe((state, prev) => {
      if (state.path.length !== prev.path.length) {
        lastActivity.current = Date.now()
      }
    })
    const unsubEmote = useAvatarStore.subscribe((state, prev) => {
      if (state.emote !== prev.emote && state.emote !== 'idle') {
        lastActivity.current = Date.now()
      }
    })

    const id = window.setInterval(() => {
      const idleFor = Date.now() - lastActivity.current
      if (idleFor < AFK_THRESHOLD_MS) return
      const cur = useAvatarStore.getState()
      if (cur.emote !== 'idle') return
      // 1-in-4 chance every interval after the threshold to do a small wave
      if (Math.random() < 0.25) {
        cur.setEmote('wave', 2000)
      }
    }, 8000)

    return () => {
      unsubPath()
      unsubEmote()
      window.clearInterval(id)
    }
  }, [enabled])
}
