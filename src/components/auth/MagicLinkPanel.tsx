'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { useToast } from '@/components/chrome/ToastProvider'

export function MagicLinkPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { push } = useToast()

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
    push("we'll let you know when sign-in lands", 'success')
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-dvc-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-dvc-card border-l-2 border-dvc-border shadow-brutLg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dvc-cream/60 hover:text-dvc-cream"
        >
          <X size={22} />
        </button>

        <DollarCoin size={64} />

        <h2 className="font-hand font-bold text-4xl text-dvc-cream mt-4">
          sign in is on the way
        </h2>
        <p className="font-ui text-sm text-dvc-muted mt-1">
          v0 is local-only. drop your email and we&apos;ll ping you when accounts ship.
        </p>

        {submitted ? (
          <div className="mt-6 bg-dvc-section border-2 border-dvc-border rounded-lg p-4">
            <div className="font-ui font-bold text-sm text-dvc-yellow mb-1">
              you&apos;re on the list ✦
            </div>
            <div className="font-body text-sm text-dvc-cream/80">
              for now your avatar lives in this browser&apos;s localStorage —
              that&apos;s plenty to vibe.
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vibe.club"
              className="w-full bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-2.5 font-body text-sm text-dvc-cream outline-none focus:border-dvc-yellow"
            />
            <button
              type="submit"
              className="w-full brut-btn bg-dvc-yellow text-dvc-border py-2.5 rounded-md font-ui font-black text-sm"
            >
              put me on the list →
            </button>
          </form>
        )}

        <p className="mt-6 font-ui text-xs text-dvc-muted">
          everything else (walking, chat to yourself, the campus map) works right now,
          no account needed.
        </p>
      </aside>
    </>
  )
}
