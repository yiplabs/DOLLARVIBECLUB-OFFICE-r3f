'use client'
import { useEffect } from 'react'
import { useAvatarStore } from '@/store/avatarStore'

export type ShortcutHandlers = {
  onHelp?: () => void
  onEdit?: () => void
  onSettings?: () => void
  onEscape?: () => void
}

/**
 * Global keydown listener — short-circuits when an input/textarea is focused.
 * Numbered keys 1-4 are wired directly to the avatarStore's emote system.
 */
export function useKeyboardShortcuts(
  enabled: boolean,
  handlers: ShortcutHandlers,
) {
  useEffect(() => {
    if (!enabled) return
    const setEmote = useAvatarStore.getState().setEmote

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return
      }

      switch (e.key) {
        case '?':
          e.preventDefault()
          handlers.onHelp?.()
          break
        case 'Escape':
          handlers.onEscape?.()
          break
        case 'e':
        case 'E':
          handlers.onEdit?.()
          break
        case 'g':
        case 'G':
          handlers.onSettings?.()
          break
        case '1':
          setEmote('wave', 2200)
          break
        case '2':
          setEmote('dance', 4500)
          break
        case '3': {
          const cur = useAvatarStore.getState().emote
          setEmote(cur === 'sit' ? 'idle' : 'sit')
          break
        }
        case '4':
          setEmote('clap', 2000)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, handlers])
}
