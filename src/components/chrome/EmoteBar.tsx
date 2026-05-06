'use client'
import { useAvatarStore, type EmoteKind } from '@/store/avatarStore'

const EMOTES: { key: string; kind: EmoteKind; label: string; emoji: string; durationMs?: number }[] = [
  { key: '1', kind: 'wave', label: 'wave', emoji: '👋', durationMs: 2200 },
  { key: '2', kind: 'dance', label: 'dance', emoji: '💃', durationMs: 4500 },
  { key: '3', kind: 'sit', label: 'sit', emoji: '🪑' },
  { key: '4', kind: 'clap', label: 'clap', emoji: '👏', durationMs: 2000 },
]

export function EmoteBar() {
  const setEmote = useAvatarStore((s) => s.setEmote)
  const currentEmote = useAvatarStore((s) => s.emote)

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 translate-y-[-3.5rem]">
      <div className="flex items-center gap-1.5 bg-dvc-card/85 backdrop-blur-md border-2 border-dvc-border rounded-xl shadow-brut p-1.5">
        {EMOTES.map((e) => {
          const active = currentEmote === e.kind
          return (
            <button
              key={e.kind}
              onClick={() => {
                if (e.kind === 'sit') {
                  // toggle sit on/off
                  setEmote(currentEmote === 'sit' ? 'idle' : 'sit')
                } else {
                  setEmote(e.kind, e.durationMs)
                }
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-ui font-bold text-xs transition-all ${
                active
                  ? 'bg-dvc-yellow text-dvc-border shadow-brutSm'
                  : 'text-dvc-cream/80 hover:bg-dvc-section'
              }`}
              title={`${e.label} (${e.key})`}
            >
              <span className="text-base leading-none">{e.emoji}</span>
              <span className="hidden md:inline">{e.label}</span>
              <kbd className="px-1 py-0 bg-dvc-bg/40 border border-dvc-border rounded text-[9px]">
                {e.key}
              </kbd>
            </button>
          )
        })}
      </div>
    </div>
  )
}
