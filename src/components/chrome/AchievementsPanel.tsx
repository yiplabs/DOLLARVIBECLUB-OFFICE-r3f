'use client'
import { Trophy, X } from 'lucide-react'
import { ACHIEVEMENTS, useAchievementsStore } from '@/store/achievementsStore'

type Props = { open: boolean; onClose: () => void }

export function AchievementsPanel({ open, onClose }: Props) {
  const unlocked = useAchievementsStore((s) => s.unlocked)
  const reset = useAchievementsStore((s) => s.reset)
  if (!open) return null

  const total = ACHIEVEMENTS.length
  const got = Object.keys(unlocked).length

  return (
    <div
      className="fixed inset-0 z-40 bg-dvc-bg/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-6 w-full max-w-lg animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-dvc-yellow" />
            <h2 className="font-hand font-bold text-3xl text-dvc-cream">
              achievements
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-dvc-cream/60 hover:text-dvc-cream"
            aria-label="close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 bg-dvc-section border-2 border-dvc-border rounded-full overflow-hidden">
            <div
              className="h-full bg-dvc-yellow transition-all"
              style={{ width: `${(got / total) * 100}%` }}
            />
          </div>
          <span className="font-ui font-bold text-xs text-dvc-yellow tabular-nums">
            {got}/{total}
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto thin-scrollbar pr-1">
          {ACHIEVEMENTS.map((a) => {
            const got = Boolean(unlocked[a.id])
            return (
              <li
                key={a.id}
                className={`flex items-start gap-2 p-2.5 rounded-lg border-2 ${
                  got
                    ? 'bg-dvc-section border-dvc-yellow shadow-brutSm'
                    : 'bg-dvc-bg/50 border-dvc-border opacity-50'
                }`}
              >
                <span className="text-2xl leading-none">{a.emoji}</span>
                <div className="min-w-0">
                  <div className="font-ui font-bold text-xs text-dvc-cream truncate">
                    {a.title}
                  </div>
                  <div className="font-ui text-[10px] text-dvc-cream/70 leading-tight mt-0.5">
                    {a.body}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <button
          onClick={() => {
            if (confirm('reset all achievements?')) reset()
          }}
          className="mt-5 w-full font-ui font-bold text-[11px] text-dvc-muted hover:text-rose-400 transition-colors"
        >
          reset progress
        </button>
      </div>
    </div>
  )
}
