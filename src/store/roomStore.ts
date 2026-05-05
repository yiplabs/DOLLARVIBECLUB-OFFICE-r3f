'use client'
import { create } from 'zustand'
import type { AvatarConfig } from '@/lib/avatar/types'
import type { ChatPayload } from '@/lib/realtime/types'

export type Peer = {
  userId: string
  handle: string
  displayName: string
  avatarConfig: AvatarConfig
  pos: [number, number]
  path: [number, number][]
  lastSeen: number
}

export type ChatBubble = {
  id: string
  userId: string
  body: string
  spawnedAt: number
}

type ClickHighlight = { x: number; z: number; expires: number } | null

type Broadcaster = {
  walk: (path: [number, number][]) => void
  pos: (pos: [number, number]) => void
  chat: (body: string, kind: ChatPayload['kind']) => void
  emote: (kind: 'wave' | 'dance' | 'sit' | 'clap') => void
}

const noopBroadcaster: Broadcaster = {
  walk: () => {},
  pos: () => {},
  chat: () => {},
  emote: () => {},
}

type RoomStore = {
  peers: Record<string, Peer>
  bubbles: ChatBubble[]
  clickHighlight: ClickHighlight
  broadcaster: Broadcaster
  upsertPeer: (peer: Peer) => void
  removePeer: (userId: string) => void
  setPeers: (peers: Peer[]) => void
  addBubble: (bubble: ChatBubble) => void
  spawnLocalBubble: (userId: string, body: string) => void
  pruneBubbles: (now: number) => void
  setBroadcaster: (b: Broadcaster) => void
  setClickHighlight: (h: ClickHighlight) => void
  reset: () => void
}

let bubbleCounter = 0

export const useRoomStore = create<RoomStore>((set) => ({
  peers: {},
  bubbles: [],
  clickHighlight: null,
  broadcaster: noopBroadcaster,
  upsertPeer: (peer) =>
    set((s) => ({ peers: { ...s.peers, [peer.userId]: peer } })),
  removePeer: (userId) =>
    set((s) => {
      const { [userId]: _gone, ...rest } = s.peers
      void _gone
      return { peers: rest }
    }),
  setPeers: (peers) =>
    set(() => ({
      peers: Object.fromEntries(peers.map((p) => [p.userId, p])),
    })),
  addBubble: (bubble) =>
    set((s) => ({ bubbles: [...s.bubbles.slice(-12), bubble] })),
  spawnLocalBubble: (userId, body) =>
    set((s) => ({
      bubbles: [
        ...s.bubbles.slice(-12),
        {
          id: `${Date.now()}-${bubbleCounter++}`,
          userId,
          body,
          spawnedAt: Date.now(),
        },
      ],
    })),
  pruneBubbles: (now) =>
    set((s) => ({
      bubbles: s.bubbles.filter((b) => now - b.spawnedAt < 5500),
    })),
  setBroadcaster: (b) => set({ broadcaster: b }),
  setClickHighlight: (h) => set({ clickHighlight: h }),
  reset: () =>
    set({
      peers: {},
      bubbles: [],
      clickHighlight: null,
      broadcaster: noopBroadcaster,
    }),
}))

export const broadcastWalk = (path: [number, number][]) =>
  useRoomStore.getState().broadcaster.walk(path)
export const broadcastPos = (pos: [number, number]) =>
  useRoomStore.getState().broadcaster.pos(pos)
export const broadcastChat = (body: string, kind: ChatPayload['kind'] = 'say') =>
  useRoomStore.getState().broadcaster.chat(body, kind)
export const broadcastEmote = (kind: 'wave' | 'dance' | 'sit' | 'clap') =>
  useRoomStore.getState().broadcaster.emote(kind)
