'use client'
import { useEffect, useState } from 'react'

/**
 * Counts down to the next "Friday 20:00 UTC" ship-or-die event.
 * If the event is currently live (within a 60-minute window), shows a LIVE pill.
 */
function nextFriday20UTC(): Date {
  const now = new Date()
  const target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      20, 0, 0, 0,
    ),
  )
  const todayDow = now.getUTCDay() // 0=Sun..6=Sat ; Friday=5
  let daysUntilFri = (5 - todayDow + 7) % 7
  if (daysUntilFri === 0 && now.getUTCHours() >= 21) daysUntilFri = 7
  target.setUTCDate(target.getUTCDate() + daysUntilFri)
  return target
}

function formatDelta(ms: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

export function LiveEventCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const target = nextFriday20UTC()
  const delta = target.getTime() - now
  const live = delta < 0 && delta > -60 * 60 * 1000 // 1h window

  if (live) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 border-2 border-dvc-border rounded-md shadow-brutSm">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="font-ui font-black text-[11px] text-white uppercase tracking-widest">
          live · ship-or-die
        </span>
      </div>
    )
  }

  const { d, h, m, s } = formatDelta(delta)
  return (
    <div className="bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-1 shadow-brutSm flex items-center gap-1">
      <span className="font-ui font-bold text-xs text-dvc-yellow">
        ship-or-die in
      </span>
      <span className="font-ui font-black text-xs text-dvc-cream tabular-nums">
        {d > 0 && `${d}d `}
        {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:
        {s.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
