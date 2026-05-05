'use client'
import { useEffect } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore } from '@/store/roomStore'
import type { AvatarConfig } from '@/lib/avatar/types'

export type Identity = {
  userId: string
  handle: string
  displayName: string
  avatarConfig: AvatarConfig
  isGuest: boolean
}

/**
 * Local-only mock — no network, no auth, no peers. The user is always a guest.
 * Wires the roomStore broadcaster so chat input -> a local self-bubble.
 */
export function useRealtimeRoom(roomSlug: string) {
  const config = useAvatarStore((s) => s.config)

  useEffect(() => {
    if (!roomSlug) return
    useRoomStore.getState().setBroadcaster({
      walk: () => {},
      pos: () => {},
      chat: (body) => {
        useRoomStore.getState().spawnLocalBubble('local', body)
      },
      emote: () => {},
    })
    return () => {
      useRoomStore.getState().reset()
    }
  }, [roomSlug])

  const identity: Identity = {
    userId: 'local',
    handle: config.displayName || 'guest',
    displayName: config.displayName || 'guest',
    avatarConfig: config,
    isGuest: true,
  }

  return {
    isReady: true,
    online: 1,
    identity,
    status: 'local' as const,
  }
}
