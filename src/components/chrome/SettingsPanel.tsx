'use client'
import { Settings as SettingsIcon, X } from 'lucide-react'
import {
  TIME_OF_DAY_OPTIONS,
  useSettingsStore,
} from '@/store/settingsStore'
import { useQualityStore, type QualityTier } from '@/store/qualityStore'

const TIERS: { value: QualityTier; label: string; sub: string }[] = [
  { value: 'low', label: 'low', sub: 'fastest' },
  { value: 'medium', label: 'medium', sub: 'balanced' },
  { value: 'high', label: 'high', sub: 'cinema' },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: Props) {
  const settings = useSettingsStore()
  const quality = useQualityStore()

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-dvc-bg/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-dvc-card border-l-2 border-dvc-border shadow-brutLg p-6 overflow-y-auto thin-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dvc-cream/60 hover:text-dvc-cream"
          aria-label="close settings"
        >
          <X size={22} />
        </button>

        <header className="flex items-center gap-3">
          <SettingsIcon className="text-dvc-yellow" size={28} />
          <h2 className="font-hand font-bold text-4xl text-dvc-cream">settings</h2>
        </header>

        {/* ── Time of day ─────────────────────────────────────── */}
        <section className="mt-6">
          <h3 className="font-ui font-bold text-xs uppercase tracking-wider text-dvc-cream/70 mb-2">
            time of day
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OF_DAY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => settings.setTimeOfDay(opt.value)}
                className={`brut-btn flex flex-col items-center gap-1 py-2 rounded-md ${
                  settings.timeOfDay === opt.value
                    ? 'bg-dvc-yellow text-dvc-border'
                    : 'bg-dvc-section text-dvc-cream'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="font-ui font-bold text-[10px] uppercase tracking-wider">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Graphics quality ────────────────────────────────── */}
        <section className="mt-6">
          <h3 className="font-ui font-bold text-xs uppercase tracking-wider text-dvc-cream/70 mb-2">
            graphics quality
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((t) => (
              <button
                key={t.value}
                onClick={() => quality.setTier(t.value)}
                className={`brut-btn flex flex-col items-center gap-0.5 py-2 rounded-md ${
                  quality.tier === t.value
                    ? 'bg-dvc-teal text-white'
                    : 'bg-dvc-section text-dvc-cream'
                }`}
              >
                <span className="font-ui font-bold text-xs uppercase">
                  {t.label}
                </span>
                <span className="font-ui text-[10px] text-dvc-cream/60">
                  {t.sub}
                </span>
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-1.5 font-ui text-xs text-dvc-cream/70">
            <li>shadows · {quality.shadows ? '✓ on' : '✗ off'}</li>
            <li>bloom · {quality.bloom ? '✓ on' : '✗ off'}</li>
            <li>depth-of-field · {quality.dof ? '✓ on' : '✗ off'}</li>
          </ul>
        </section>

        {/* ── Audio ────────────────────────────────────────── */}
        <section className="mt-6">
          <h3 className="font-ui font-bold text-xs uppercase tracking-wider text-dvc-cream/70 mb-2">
            audio
          </h3>
          <Slider
            label="lo-fi music"
            value={settings.musicVolume}
            onChange={settings.setMusicVolume}
            badge={settings.musicPlaying ? 'playing' : 'paused'}
          />
          <Slider
            label="ui sfx"
            value={settings.sfxVolume}
            onChange={settings.setSfxVolume}
          />
          <button
            onClick={settings.toggleMusic}
            className="mt-2 w-full brut-btn bg-dvc-section text-dvc-cream py-2 rounded-md font-ui font-bold text-xs"
          >
            {settings.musicPlaying ? 'pause music' : 'play lo-fi'}
          </button>
        </section>

        {/* ── Room helpers ─────────────────────────────────── */}
        <section className="mt-6">
          <h3 className="font-ui font-bold text-xs uppercase tracking-wider text-dvc-cream/70 mb-2">
            walking helpers
          </h3>
          <Toggle
            label="show walk preview path"
            value={settings.showWalkPreview}
            onChange={settings.setShowWalkPreview}
          />
          <Toggle
            label="show cell hover dot"
            value={settings.showHoverCell}
            onChange={settings.setShowHoverCell}
          />
          <Toggle
            label="camera follows avatar"
            value={settings.cameraFollow}
            onChange={settings.setCameraFollow}
          />
          <Toggle
            label="performance hud (fps + ms)"
            value={settings.showPerfHud}
            onChange={settings.setShowPerfHud}
          />
          <Toggle
            label="bring my pet 🦝"
            value={settings.petEnabled}
            onChange={settings.setPetEnabled}
          />
        </section>

        {/* ── Onboarding ───────────────────────────────────── */}
        <section className="mt-6">
          <h3 className="font-ui font-bold text-xs uppercase tracking-wider text-dvc-cream/70 mb-2">
            onboarding
          </h3>
          <button
            onClick={settings.resetOnboarding}
            className="w-full brut-btn bg-dvc-section text-dvc-cream py-2 rounded-md font-ui font-bold text-xs"
          >
            replay tutorial
          </button>
        </section>

        <p className="mt-6 font-ui text-xs text-dvc-muted">
          settings persist locally to this browser. nothing leaves your device.
        </p>
      </aside>
    </>
  )
}

function Slider({
  label,
  value,
  onChange,
  badge,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  badge?: string
}) {
  return (
    <label className="block mt-3">
      <div className="flex justify-between items-baseline">
        <span className="font-ui font-bold text-xs text-dvc-cream/90">
          {label}
        </span>
        <span className="font-ui text-[10px] text-dvc-yellow uppercase tracking-wider">
          {badge ?? `${Math.round(value * 100)}%`}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-1 accent-dvc-yellow"
      />
    </label>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (b: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full mt-2 flex items-center justify-between gap-3 bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-2 hover:bg-dvc-card transition-colors"
    >
      <span className="font-ui font-bold text-xs text-dvc-cream">{label}</span>
      <span
        className={`relative w-9 h-5 rounded-full border-2 border-dvc-border transition-colors ${
          value ? 'bg-dvc-teal' : 'bg-dvc-bg'
        }`}
      >
        <span
          className={`absolute top-0.5 ${
            value ? 'left-4' : 'left-0.5'
          } w-3 h-3 bg-dvc-cream rounded-full transition-all`}
        />
      </span>
    </button>
  )
}
