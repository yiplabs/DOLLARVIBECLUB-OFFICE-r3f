'use client'

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['/'], label: 'focus chat' },
  { keys: ['?'], label: 'this help' },
  { keys: ['Esc'], label: 'close / blur' },
  { keys: ['E'], label: 'edit your card' },
  { keys: ['1'], label: 'wave' },
  { keys: ['2'], label: 'dance' },
  { keys: ['3'], label: 'sit' },
  { keys: ['4'], label: 'clap' },
  { keys: ['Click'], label: 'walk to spot' },
]

export function KeyboardShortcuts({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-40 bg-dvc-bg/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-hand font-bold text-3xl text-dvc-cream mb-1">
          keyboard
        </h2>
        <p className="font-ui text-xs text-dvc-muted mb-4">
          tap any time to come back to this list
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-2">
              <span className="font-ui text-sm text-dvc-cream/90">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-1.5 py-0.5 bg-dvc-section border-2 border-dvc-border rounded text-[10px] font-ui font-bold text-dvc-yellow shadow-brutSm"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-5 w-full brut-btn bg-dvc-teal text-white py-2 rounded-md font-ui font-bold text-sm"
        >
          got it
        </button>
      </div>
    </div>
  )
}
