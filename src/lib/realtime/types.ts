import type { AvatarConfig } from '@/lib/avatar/types'

export type PosPayload = { userId: string; x: number; z: number; t: number }
export type WalkPayload = {
  userId: string
  /** waypoint list in world units (x, z) */
  path: [number, number][]
  startedAt: number
}
export type ChatPayload = {
  userId: string
  body: string
  sentAt: number
  kind: 'say' | 'shout' | 'me'
}
export type EmotePayload = {
  userId: string
  kind: 'wave' | 'dance' | 'sit' | 'clap'
}
export type PresenceMeta = {
  userId: string
  handle: string
  displayName: string
  avatarConfig: AvatarConfig
  pos: [number, number]
}

export type RealtimeEvents = {
  pos: PosPayload
  walk: WalkPayload
  chat: ChatPayload
  emote: EmotePayload
}
