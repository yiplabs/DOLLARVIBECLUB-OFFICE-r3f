'use client'
import { AVATAR_PRESETS, type AvatarPreset } from '@/lib/avatar/presets'

export function PresetPicker({
  onPick,
  activeId,
}: {
  onPick: (p: AvatarPreset) => void
  activeId: string | null
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {AVATAR_PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => onPick(p)}
          className={`brut-btn flex flex-col items-center gap-1 px-2 py-2 rounded-md ${
            activeId === p.id
              ? 'bg-dvc-yellow text-dvc-border'
              : 'bg-dvc-card text-dvc-cream'
          }`}
        >
          <span className="text-xl">{p.emoji}</span>
          <span className="font-ui font-bold text-[11px]">{p.name}</span>
        </button>
      ))}
    </div>
  )
}
