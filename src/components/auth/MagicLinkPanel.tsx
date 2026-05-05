'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useToast } from '@/components/chrome/ToastProvider'

export function MagicLinkPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { push } = useToast()

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      push('add Supabase env vars to enable auth', 'warn')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      push(error.message, 'error')
      return
    }
    setSent(true)
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
          claim your spot
        </h2>
        <p className="font-ui text-sm text-dvc-muted mt-1">
          one email, one click. no passwords.
        </p>

        {sent ? (
          <div className="mt-6 bg-dvc-section border-2 border-dvc-border rounded-lg p-4">
            <div className="font-ui font-bold text-sm text-dvc-yellow mb-1">
              check your inbox ✦
            </div>
            <div className="font-body text-sm text-dvc-cream/80">
              we sent a magic link to{' '}
              <span className="font-bold text-dvc-cream">{email}</span>.
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
              disabled={loading}
              className="w-full brut-btn bg-dvc-yellow text-dvc-border py-2.5 rounded-md font-ui font-black text-sm disabled:opacity-60"
            >
              {loading ? 'sending…' : 'send me the link →'}
            </button>
          </form>
        )}

        <p className="mt-6 font-ui text-xs text-dvc-muted">
          guests can walk + chat. signed-in members get persistent profiles, projects, and the
          full $1/mo of dvc.
        </p>
      </aside>
    </>
  )
}
