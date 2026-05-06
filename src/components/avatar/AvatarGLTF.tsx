'use client'
import type { AvatarConfig } from '@/lib/avatar/types'
import type { EmoteState } from './PrimitiveAvatar'

/**
 * Flip to true once you've dropped Kenney Mini Characters .glb files into
 * /public/models/characters/. While false, this component never fetches —
 * the AvatarBoundary in avatarLoader.tsx falls through to <PrimitiveAvatar>.
 */
export const KENNEY_AVAILABLE = false

type Props = {
  config: AvatarConfig
  position?: [number, number, number]
  isWalking?: boolean
  showName?: boolean
  emote?: EmoteState
}

export function AvatarGLTF(_props: Props) {
  if (!KENNEY_AVAILABLE) return null
  return null
}
