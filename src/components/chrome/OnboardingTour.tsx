'use client'
import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { DollarCoin } from './DollarCoin'
import { useSettingsStore } from '@/store/settingsStore'

type Step = {
  title: string
  body: string
  badge: string
}

const STEPS: Step[] = [
  {
    badge: 'click',
    title: 'click anywhere on the floor',
    body: 'your avatar walks. A* pathfinding routes around walls and furniture automatically.',
  },
  {
    badge: '/',
    title: 'press / to chat',
    body: 'speech bubbles float in 3D over your head and fade after a few seconds. ephemeral by design.',
  },
  {
    badge: 'E',
    title: 'press E to edit your card',
    body: 'change name, hair, top color anytime. saved to localStorage — your browser, no server.',
  },
  {
    badge: '1-4',
    title: '1, 2, 3, 4 are emotes',
    body: 'wave / dance / sit / clap. broadcast to nearby vibe coders when multiplayer ships.',
  },
  {
    badge: '?',
    title: 'press ? for the full shortcut sheet',
    body: 'or open settings (top-right) to tune lighting, music, and graphics quality.',
  },
]

export function OnboardingTour() {
  const showOnboarding = useSettingsStore((s) => s.showOnboarding)
  const dismiss = useSettingsStore((s) => s.dismissOnboarding)
  const [step, setStep] = useState(0)

  if (!showOnboarding) return null
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto m-6 w-full max-w-md">
        <div className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-5 animate-pop-in">
          <header className="flex items-start gap-3">
            <DollarCoin size={44} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-dvc-yellow text-dvc-border border-2 border-dvc-border rounded font-ui font-black text-xs">
                  {current.badge}
                </span>
                <span className="font-ui text-[10px] uppercase tracking-wider text-dvc-muted">
                  step {step + 1} / {STEPS.length}
                </span>
              </div>
              <h3 className="mt-2 font-hand font-bold text-2xl text-dvc-cream leading-tight">
                {current.title}
              </h3>
              <p className="mt-1 font-body text-sm text-dvc-cream/80">
                {current.body}
              </p>
            </div>
            <button
              onClick={dismiss}
              className="text-dvc-cream/60 hover:text-dvc-cream"
              aria-label="skip onboarding"
            >
              <X size={18} />
            </button>
          </header>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= step ? 'bg-dvc-yellow' : 'bg-dvc-border'
                  }`}
                />
              ))}
            </div>
            {last ? (
              <button
                onClick={dismiss}
                className="brut-btn bg-dvc-teal text-white px-4 py-1.5 rounded-md font-ui font-bold text-xs"
              >
                got it
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="brut-btn bg-dvc-yellow text-dvc-border px-4 py-1.5 rounded-md font-ui font-bold text-xs flex items-center gap-1"
              >
                next <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
