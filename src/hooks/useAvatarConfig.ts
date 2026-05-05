'use client'
import { useEffect } from 'react'
import { useAvatarStore, hasStoredAvatarConfig } from '@/store/avatarStore'
import type { AvatarConfig } from '@/lib/avatar/types'

/** Returns the current avatar config, hydrated from localStorage on first mount. */
export function useAvatarConfig(): AvatarConfig {
  const config = useAvatarStore((s) => s.config)
  const loadFromStorage = useAvatarStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return config
}

export const hasAvatarConfig = hasStoredAvatarConfig
