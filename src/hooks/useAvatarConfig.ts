'use client'
import { useAvatarStore } from '@/store/avatarStore'
import type { AvatarConfig } from '@/lib/avatar/types'

/**
 * Returns the persisted avatar config. Zustand's `persist` middleware
 * handles localStorage hydration on first mount automatically.
 */
export function useAvatarConfig(): AvatarConfig {
  return useAvatarStore((s) => s.config)
}
