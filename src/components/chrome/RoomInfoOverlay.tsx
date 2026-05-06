'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Info, X } from 'lucide-react'
import { getRoom, ROOMS } from '@/lib/rooms/catalog'

type Props = { slug: string }

/**
 * Floating "you are here" badge bottom-left of TopBar that expands to a room
 * info card with current room metadata + jump-to-room links.
 */
export function RoomInfoOverlay({ slug }: Props) {
  const room = getRoom(slug)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!room) return null

  return (
    <div className="fixed top-20 right-[22rem] z-30">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="brut-pill bg-dvc-card hover:bg-dvc-section flex items-center gap-1.5"
          style={{ background: room.accent, color: '#141412' }}
        >
          <Info size={11} />
          <span className="uppercase tracking-wider">{room.name}</span>
        </button>
      ) : (
        <div
          className={`bg-dvc-card border-2 border-dvc-border rounded-xl shadow-brutLg p-4 w-72 ${
            mounted ? 'animate-pop-in' : ''
          }`}
        >
          <header className="flex items-center justify-between">
            <span
              className="px-2 py-0.5 border-2 border-dvc-border rounded font-ui font-black text-[10px] uppercase tracking-wider"
              style={{ background: room.accent, color: '#141412' }}
            >
              {room.theme}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-dvc-cream/60 hover:text-dvc-cream"
            >
              <X size={14} />
            </button>
          </header>
          <h3 className="mt-2 font-hand font-bold text-2xl text-dvc-cream leading-tight">
            {room.name}
          </h3>
          <p className="font-ui font-bold text-xs text-dvc-yellow">
            {room.tagline}
          </p>
          <p className="mt-2 font-body text-sm text-dvc-cream/80 leading-snug">
            {room.description}
          </p>

          <div className="mt-3 pt-3 border-t border-dvc-border/60">
            <span className="font-ui font-bold text-[10px] uppercase tracking-wider text-dvc-muted">
              jump to
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {ROOMS.filter((r) => r.slug !== slug).map((r) => (
                <Link
                  key={r.slug}
                  href={`/room/${r.slug}`}
                  className="px-2 py-0.5 bg-dvc-section border-2 border-dvc-border rounded text-[11px] font-ui font-bold text-dvc-cream hover:bg-dvc-yellow hover:text-dvc-border"
                >
                  {r.name.toLowerCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
