'use client'
import { useEffect, useState } from 'react'
import { Activity, ChevronUp, X } from 'lucide-react'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore } from '@/store/roomStore'
import { useAchievementsStore, ACHIEVEMENTS } from '@/store/achievementsStore'

type FeedEvent = {
  id: number
  kind: 'walk' | 'chat' | 'emote' | 'achievement' | 'room' | 'pomodoro'
  message: string
  at: number
}

const KIND_EMOJI: Record<FeedEvent['kind'], string> = {
  walk: '👟',
  chat: '💬',
  emote: '✨',
  achievement: '🏆',
  room: '🚪',
  pomodoro: '🍅',
}

let nextId = 1

/**
 * Floating activity feed — collects what just happened (walks, chats, emotes,
 * achievements). Useful for both debug and a "what did i miss" feel.
 */
export function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  const push = (kind: FeedEvent['kind'], message: string) => {
    setEvents((prev) => [
      { id: nextId++, kind, message, at: Date.now() },
      ...prev.slice(0, 49),
    ])
    if (!open) setUnread((u) => u + 1)
  }

  useEffect(() => {
    const unsubEmote = useAvatarStore.subscribe((state, prev) => {
      if (state.emote !== prev.emote && state.emote !== 'idle') {
        push('emote', `you ${state.emote}d`)
      }
    })

    const unsubBubbles = useRoomStore.subscribe((state, prev) => {
      if (state.bubbles.length > prev.bubbles.length) {
        const latest = state.bubbles[state.bubbles.length - 1]
        if (latest) push('chat', `you said: "${latest.body}"`)
      }
    })

    const unsubAch = useAchievementsStore.subscribe((state, prev) => {
      const newKeys = Object.keys(state.unlocked).filter(
        (k) => !prev.unlocked[k],
      )
      newKeys.forEach((key) => {
        const a = ACHIEVEMENTS.find((x) => x.id === key)
        if (a) push('achievement', `${a.emoji} ${a.title}`)
      })
    })

    return () => {
      unsubEmote()
      unsubBubbles()
      unsubAch()
    }
  }, [open])

  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-44 left-4 z-30 w-11 h-11 rounded-full bg-dvc-card border-2 border-dvc-border shadow-brut flex items-center justify-center text-dvc-cream hover:bg-dvc-yellow hover:text-dvc-border relative"
        aria-label="activity feed"
      >
        <Activity size={16} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white border-2 border-dvc-border font-ui font-black text-[10px] flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-60 left-4 z-30 w-72 max-h-[60vh] bg-dvc-card border-2 border-dvc-border rounded-xl shadow-brutLg flex flex-col animate-pop-in">
          <header className="flex items-center justify-between px-3 py-2 border-b-2 border-dvc-border">
            <span className="font-hand font-bold text-xl text-dvc-cream">
              activity
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-dvc-cream/60 hover:text-dvc-cream"
            >
              <X size={16} />
            </button>
          </header>

          {events.length === 0 ? (
            <div className="p-6 text-center font-ui text-xs text-dvc-muted">
              walk, chat, emote — i&apos;ll log it here.
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto thin-scrollbar">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-2 px-3 py-2 border-b border-dvc-border/40 last:border-0"
                >
                  <span className="text-base leading-none mt-0.5">
                    {KIND_EMOJI[e.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-ui text-xs text-dvc-cream break-words">
                      {e.message}
                    </div>
                    <div className="font-ui text-[10px] text-dvc-muted mt-0.5">
                      {timeAgo(e.at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {events.length > 0 && (
            <button
              onClick={() => setEvents([])}
              className="px-3 py-2 border-t-2 border-dvc-border font-ui text-[11px] text-dvc-muted hover:text-rose-400 flex items-center justify-center gap-1"
            >
              <ChevronUp size={12} /> clear
            </button>
          )}
        </div>
      )}
    </>
  )
}

function timeAgo(then: number): string {
  const sec = Math.floor((Date.now() - then) / 1000)
  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const m = Math.floor(sec / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}
