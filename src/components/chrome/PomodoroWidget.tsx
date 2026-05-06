'use client'
import { useEffect, useState } from 'react'
import { Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { usePomodoroStore, type PomodoroPhase } from '@/store/pomodoroStore'

const PHASE_COLORS: Record<PomodoroPhase, { bg: string; fg: string; label: string }> = {
  work: { bg: 'bg-rose-600', fg: 'text-white', label: 'focus' },
  break: { bg: 'bg-dvc-online', fg: 'text-white', label: 'break' },
  idle: { bg: 'bg-dvc-section', fg: 'text-dvc-cream', label: 'paused' },
}

function fmtRemaining(endsAt: number | null) {
  if (!endsAt) return '00:00'
  const ms = Math.max(0, endsAt - Date.now())
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * Floating pomodoro widget. Auto-rolls work → break → work. State is in-memory
 * (resets on reload by design — fresh sessions every time).
 */
export function PomodoroWidget({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const phase = usePomodoroStore((s) => s.phase)
  const endsAt = usePomodoroStore((s) => s.endsAt)
  const sessions = usePomodoroStore((s) => s.sessionsCompleted)
  const start = usePomodoroStore((s) => s.start)
  const pause = usePomodoroStore((s) => s.pause)
  const reset = usePomodoroStore((s) => s.reset)
  const tick = usePomodoroStore((s) => s.tick)
  const [, force] = useState(0)
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    const id = window.setInterval(() => {
      tick()
      force((n) => n + 1)
    }, 500)
    return () => window.clearInterval(id)
  }, [tick])

  const palette = PHASE_COLORS[phase]
  const remaining = fmtRemaining(endsAt)
  const running = phase !== 'idle' && endsAt !== null

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-28 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full border-2 border-dvc-border shadow-brut ${
          running ? palette.bg : 'bg-dvc-card'
        } ${running ? palette.fg : 'text-dvc-cream'} hover:scale-105 transition-transform`}
        aria-label="pomodoro"
      >
        <Timer size={16} />
        <span className="font-ui font-black text-xs tabular-nums">
          {running ? remaining : 'pomodoro'}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-44 left-4 z-30 w-72 bg-dvc-card border-2 border-dvc-border rounded-xl shadow-brutLg p-4 animate-pop-in">
          <header className="flex items-center justify-between">
            <span className="font-hand font-bold text-2xl text-dvc-cream">
              pomodoro
            </span>
            <span
              className={`px-2 py-0.5 ${palette.bg} ${palette.fg} border-2 border-dvc-border rounded-md font-ui font-black text-[10px] uppercase tracking-wider`}
            >
              {palette.label}
            </span>
          </header>

          <div className="mt-3 text-center">
            <div className="font-display font-black text-5xl text-dvc-cream tabular-nums">
              {remaining}
            </div>
            <div className="font-ui text-xs text-dvc-muted mt-1">
              completed: {sessions} session{sessions === 1 ? '' : 's'}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {!running ? (
              <>
                <button
                  onClick={() => start('work')}
                  className="brut-btn bg-rose-600 text-white py-2 rounded-md font-ui font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Play size={12} /> focus 25m
                </button>
                <button
                  onClick={() => start('break')}
                  className="brut-btn bg-dvc-online text-white py-2 rounded-md font-ui font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Play size={12} /> break 5m
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={pause}
                  className="brut-btn bg-dvc-section text-dvc-cream py-2 rounded-md font-ui font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Pause size={12} /> pause
                </button>
                <button
                  onClick={reset}
                  className="brut-btn bg-dvc-card text-dvc-cream border-2 border-dvc-border py-2 rounded-md font-ui font-bold text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw size={12} /> reset
                </button>
              </>
            )}
          </div>

          <p className="mt-3 font-ui text-[10px] text-dvc-muted">
            timer is local-only — closing the tab ends the session.
          </p>
        </div>
      )}
    </>
  )
}
