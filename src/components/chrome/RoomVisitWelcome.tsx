'use client'
import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { getRoom } from '@/lib/rooms/catalog'
import { useAchievementsStore } from '@/store/achievementsStore'

const TIPS: Record<string, string[]> = {
  lounge: [
    'rita the greeter is somewhere here. say hi.',
    'check the project showcase board on the north wall.',
    'this is the social default — walk over, vibe, leave.',
  ],
  'deep-focus': [
    'the pomodoro is auto-open down-left.',
    'chat is technically allowed but micah will side-eye you.',
    'six isolated focus pods around the perimeter — pick one.',
  ],
  'the-arena': [
    'two desks face each other. spectators line the walls.',
    'rex the ref will tell you when the next match is.',
    'cheering is participation.',
  ],
  brainstorm: [
    'the whiteboard rotates fresh sticky notes every visit.',
    'nia is here — half-baked ideas are the goal.',
    'pink rug = ideation zone.',
  ],
  'the-stage': [
    'three colored spotlights mean a guest is queued.',
    'sit in the audience. press 4 to clap.',
    'host is in residence — drop a hello.',
  ],
  'mentor-row': [
    'five mini-offices. each has a mentor.',
    'open door = available. no booking, just walk up.',
    'sage is in office one — ask anything.',
  ],
}

type Props = { slug: string }

/**
 * One-time-per-room celebratory pop-in shown when the player visits a room
 * for the very first time. Driven by `achievementsStore.visitedRooms`.
 *
 * IMPORTANT: must mount AFTER `useAchievementWatcher` (which records the
 * visit). We sample the previous-visited state synchronously on mount.
 */
export function RoomVisitWelcome({ slug }: Props) {
  const room = getRoom(slug)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!room) return
    // Read once — if this room was already in visitedRooms before this mount,
    // skip. The watcher's recordRoomVisit happens in its own useEffect,
    // ordering depends on hook registration. To be safe, snapshot via
    // localStorage directly.
    const raw =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('dvc_achievements_v1')
        : null
    let alreadyVisited = false
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          state?: { visitedRooms?: Record<string, number> }
        }
        alreadyVisited = Boolean(parsed.state?.visitedRooms?.[slug])
      } catch {
        // fall through
      }
    }
    if (alreadyVisited) return
    // First visit — record it and open the panel.
    useAchievementsStore.getState().recordRoomVisit(slug)
    setOpen(true)
  }, [slug, room])

  if (!open || !room) return null

  const tips = TIPS[slug] ?? []

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="pointer-events-auto bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-4 w-[460px] animate-pop-in">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-md border-2 border-dvc-border flex items-center justify-center"
              style={{ background: room.accent }}
            >
              <Sparkles size={18} className="text-dvc-border" />
            </span>
            <div>
              <div className="font-ui font-bold text-[10px] uppercase tracking-wider text-dvc-yellow">
                first visit
              </div>
              <div className="font-hand font-bold text-2xl text-dvc-cream leading-tight">
                {room.name}
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-dvc-cream/60 hover:text-dvc-cream"
            aria-label="close"
          >
            <X size={18} />
          </button>
        </header>

        {tips.length > 0 && (
          <ul className="mt-3 space-y-1">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-body text-sm text-dvc-cream/90"
              >
                <span className="text-dvc-yellow leading-tight mt-0.5">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setOpen(false)}
          className="mt-3 w-full brut-btn bg-dvc-teal text-white py-1.5 rounded-md font-ui font-bold text-xs"
        >
          got it — let&apos;s walk around
        </button>
      </div>
    </div>
  )
}
