'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useAvatarStore } from '@/store/avatarStore'
import { TOP_TINTS, BODY_TINTS, HAIR_TINTS } from '@/lib/avatar/types'
import { useToast } from '@/components/chrome/ToastProvider'

type Props = {
  open: boolean
  onClose: () => void
}

export function EditProfileModal({ open, onClose }: Props) {
  const config = useAvatarStore((s) => s.config)
  const setConfig = useAvatarStore((s) => s.setConfig)
  const [displayName, setDisplayName] = useState(config.displayName)
  const { push } = useToast()

  if (!open) return null

  const save = () => {
    setConfig({ displayName })
    push('saved your card', 'success')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-dvc-bg/85 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dvc-cream/60 hover:text-dvc-cream"
        >
          <X size={20} />
        </button>
        <h2 className="font-hand font-bold text-3xl text-dvc-cream mb-4">
          edit your card
        </h2>

        <label className="block">
          <span className="font-ui font-bold text-xs text-dvc-cream/70 uppercase tracking-wider">
            display name
          </span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 24))}
            className="mt-1 w-full bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-2 font-body text-sm text-dvc-cream outline-none focus:border-dvc-yellow"
          />
        </label>

        <div className="mt-4">
          <span className="font-ui font-bold text-xs text-dvc-cream/70 uppercase tracking-wider">
            top color
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {TOP_TINTS.map((c) => (
              <button
                key={c}
                onClick={() => setConfig({ topTint: c })}
                className={`w-7 h-7 rounded-md border-2 ${
                  config.topTint === c ? 'border-dvc-yellow' : 'border-dvc-border'
                }`}
                style={{ background: c }}
                aria-label={`top color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3">
          <span className="font-ui font-bold text-xs text-dvc-cream/70 uppercase tracking-wider">
            hair
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {HAIR_TINTS.map((c) => (
              <button
                key={c}
                onClick={() => setConfig({ hairTint: c })}
                className={`w-6 h-6 rounded-md border-2 ${
                  config.hairTint === c ? 'border-dvc-yellow' : 'border-dvc-border'
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3">
          <span className="font-ui font-bold text-xs text-dvc-cream/70 uppercase tracking-wider">
            skin
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {BODY_TINTS.map((c) => (
              <button
                key={c}
                onClick={() => setConfig({ bodyTint: c })}
                className={`w-6 h-6 rounded-md border-2 ${
                  config.bodyTint === c ? 'border-dvc-yellow' : 'border-dvc-border'
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 brut-btn bg-dvc-section text-dvc-cream py-2 rounded-md font-ui font-bold text-sm"
          >
            cancel
          </button>
          <button
            onClick={save}
            className="flex-1 brut-btn bg-dvc-teal text-white py-2 rounded-md font-ui font-bold text-sm"
          >
            save
          </button>
        </div>
      </div>
    </div>
  )
}
