'use client'
import { useEffect, useRef, useState } from 'react'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { joinRoomChannel } from '@/lib/realtime/channel'
import type {
  ChatPayload,
  EmotePayload,
  PosPayload,
  PresenceMeta,
  WalkPayload,
} from '@/lib/realtime/types'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore } from '@/store/roomStore'
import { generateGuestId, pickGuestName } from '@/lib/utils'
import type { AvatarConfig } from '@/lib/avatar/types'

export type Identity = {
  userId: string
  handle: string
  displayName: string
  avatarConfig: AvatarConfig
  isGuest: boolean
}

export type RealtimeStatus = 'connecting' | 'connected' | 'demo' | 'error'

const POS_TICK_MS = 100 // 10 Hz while moving

export function useRealtimeRoom(roomSlug: string): {
  status: RealtimeStatus
  identity: Identity
  online: number
} {
  const [status, setStatus] = useState<RealtimeStatus>('connecting')
  const [online, setOnline] = useState(1)
  const [identity, setIdentity] = useState<Identity>(() => {
    const guestId = generateGuestId()
    const name = pickGuestName()
    return {
      userId: guestId,
      handle: name,
      displayName: name,
      avatarConfig: useAvatarStore.getState().config,
      isGuest: true,
    }
  })

  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  useEffect(() => {
    if (!roomSlug) return
    if (!isSupabaseConfigured()) {
      setStatus('demo')
      useRoomStore.getState().setBroadcaster({
        walk: () => {},
        pos: () => {},
        chat: (body) => {
          useRoomStore.getState().addBubble({
            id: `${Date.now()}-self`,
            userId: identity.userId,
            body,
            spawnedAt: Date.now(),
          })
        },
        emote: () => {},
      })
      return
    }

    const supabase = createClient()
    supabaseRef.current = supabase

    let cancelled = false
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let id: Identity
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, handle, display_name, avatar_config')
          .eq('id', user.id)
          .single()
        id = {
          userId: user.id,
          handle: profile?.handle ?? `user_${user.id.slice(0, 8)}`,
          displayName: profile?.display_name ?? 'vibe coder',
          avatarConfig:
            (profile?.avatar_config as AvatarConfig | null) ??
            useAvatarStore.getState().config,
          isGuest: false,
        }
      } else {
        const guestId = generateGuestId()
        const name = pickGuestName()
        id = {
          userId: guestId,
          handle: name,
          displayName: useAvatarStore.getState().config.displayName || name,
          avatarConfig: useAvatarStore.getState().config,
          isGuest: true,
        }
      }
      if (cancelled) return
      setIdentity(id)

      const channel = joinRoomChannel(supabase, roomSlug, id.userId)
      channelRef.current = channel

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<PresenceMeta>()
          const peers = Object.values(state)
            .flat()
            .filter((m) => m.userId !== id.userId)
            .map((m) => ({
              userId: m.userId,
              handle: m.handle,
              displayName: m.displayName,
              avatarConfig: m.avatarConfig,
              pos: m.pos,
              path: [],
              lastSeen: Date.now(),
            }))
          useRoomStore.getState().setPeers(peers)
          setOnline(Object.values(state).flat().length)
        })
        .on('broadcast', { event: 'walk' }, ({ payload }) => {
          const p = payload as WalkPayload
          if (p.userId === id.userId) return
          const cur = useRoomStore.getState().peers[p.userId]
          if (!cur) return
          useRoomStore.getState().upsertPeer({ ...cur, path: p.path, lastSeen: Date.now() })
        })
        .on('broadcast', { event: 'pos' }, ({ payload }) => {
          const p = payload as PosPayload
          if (p.userId === id.userId) return
          const cur = useRoomStore.getState().peers[p.userId]
          if (!cur) return
          useRoomStore.getState().upsertPeer({
            ...cur,
            pos: [p.x, p.z],
            lastSeen: Date.now(),
          })
        })
        .on('broadcast', { event: 'chat' }, ({ payload }) => {
          const p = payload as ChatPayload
          useRoomStore.getState().addBubble({
            id: `${p.sentAt}-${p.userId}`,
            userId: p.userId,
            body: p.body,
            spawnedAt: Date.now(),
          })
        })
        .on('broadcast', { event: 'emote' }, ({ payload }) => {
          // emote rendering left as a follow-up (animation crossfade)
          void (payload as EmotePayload)
        })
        .subscribe(async (s) => {
          if (s !== 'SUBSCRIBED') return
          setStatus('connected')
          await channel.track({
            userId: id.userId,
            handle: id.handle,
            displayName: id.displayName,
            avatarConfig: id.avatarConfig,
            pos: useAvatarStore.getState().pos,
          } satisfies PresenceMeta)
        })

      // Wire the room broadcaster
      let lastPosTick = 0
      useRoomStore.getState().setBroadcaster({
        walk: (path) =>
          void channel.send({
            type: 'broadcast',
            event: 'walk',
            payload: {
              userId: id.userId,
              path,
              startedAt: Date.now(),
            } satisfies WalkPayload,
          }),
        pos: (pos) => {
          const now = Date.now()
          if (now - lastPosTick < POS_TICK_MS) return
          lastPosTick = now
          void channel.send({
            type: 'broadcast',
            event: 'pos',
            payload: {
              userId: id.userId,
              x: pos[0],
              z: pos[1],
              t: now,
            } satisfies PosPayload,
          })
        },
        chat: (body, kind) =>
          void channel.send({
            type: 'broadcast',
            event: 'chat',
            payload: {
              userId: id.userId,
              body,
              sentAt: Date.now(),
              kind,
            } satisfies ChatPayload,
          }),
        emote: (kind) =>
          void channel.send({
            type: 'broadcast',
            event: 'emote',
            payload: { userId: id.userId, kind } satisfies EmotePayload,
          }),
      })
    })().catch(() => setStatus('error'))

    return () => {
      cancelled = true
      if (channelRef.current) {
        supabaseRef.current?.removeChannel(channelRef.current)
        channelRef.current = null
      }
      useRoomStore.getState().reset()
    }
  }, [roomSlug, identity.userId])

  return { status, identity, online }
}
