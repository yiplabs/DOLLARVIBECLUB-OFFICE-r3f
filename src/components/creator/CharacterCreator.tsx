'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Shuffle } from 'lucide-react'
import { useAvatarStore } from '@/store/avatarStore'
import {
  AVATAR_PRESETS,
  type AvatarPreset,
  randomizeAvatar,
} from '@/lib/avatar/presets'
import {
  BODY_TINTS,
  BOTTOM_TINTS,
  CHARACTER_MODELS,
  HAIR_TINTS,
  SHOE_TINTS,
  TOP_TINTS,
} from '@/lib/avatar/types'
import { PresetPicker } from './PresetPicker'
import { OptionRow } from './OptionRow'
import { ColorSwatchGrid } from './ColorSwatchGrid'
import { useToast } from '@/components/chrome/ToastProvider'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'

const AvatarPreview3D = dynamic(
  () => import('./AvatarPreview3D').then((m) => m.AvatarPreview3D),
  { ssr: false, loading: () => <div className="w-full h-full bg-dvc-card animate-pulse" /> },
)

type Tab = 'body' | 'hair' | 'outfit' | 'shoes'

export function CharacterCreator() {
  const config = useAvatarStore((s) => s.config)
  const setConfig = useAvatarStore((s) => s.setConfig)
  const replaceConfig = useAvatarStore((s) => s.replaceConfig)
  const markSetup = useAvatarStore((s) => s.markSetup)
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('body')
  const [presetId, setPresetId] = useState<string | null>('vibe-coder')
  const { push } = useToast()

  const applyPreset = (p: AvatarPreset) => {
    replaceConfig({ ...p.config, displayName: config.displayName })
    setPresetId(p.id)
  }

  const lockIn = () => {
    markSetup()
    push('locked in — see you on the floor', 'success')
    router.push('/map')
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-dvc-bg">
      <AuroraBlobs />

      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="font-hand font-bold text-2xl text-dvc-cream hover:text-dvc-yellow"
        >
          ← DVC Cowork
        </a>
        <div className="font-ui font-bold text-xs text-dvc-yellow border-2 border-dvc-yellow rounded-md px-2 py-1">
          step 1 of 1
        </div>
      </header>

      <main className="relative z-10 flex-1 grid lg:grid-cols-2 gap-6 p-6">
        {/* LEFT: 3D Preview */}
        <section className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg overflow-hidden flex flex-col min-h-[440px]">
          <div className="flex-1 relative">
            <AvatarPreview3D config={config} />
          </div>
          <div className="border-t-2 border-dvc-border p-4 bg-dvc-section/40">
            <button
              onClick={() => {
                replaceConfig(randomizeAvatar(config.displayName))
                setPresetId(null)
              }}
              className="w-full brut-btn bg-dvc-yellow text-dvc-border py-2 rounded-md font-ui font-black text-sm flex items-center justify-center gap-2"
            >
              <Shuffle size={16} /> RANDOMIZE
            </button>
            <input
              value={config.displayName}
              onChange={(e) =>
                setConfig({ displayName: e.target.value.slice(0, 24) })
              }
              placeholder="display name"
              className="mt-3 w-full bg-dvc-card border-2 border-dvc-border rounded-md px-3 py-2 font-body text-sm text-dvc-cream outline-none focus:border-dvc-yellow"
            />
          </div>
        </section>

        {/* RIGHT: Pickers */}
        <section className="space-y-3">
          <OptionRow label="presets">
            <PresetPicker onPick={applyPreset} activeId={presetId} />
          </OptionRow>

          <div className="bg-dvc-card border-2 border-dvc-border rounded-lg p-1 grid grid-cols-4 gap-1">
            {(['body', 'hair', 'outfit', 'shoes'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-2 rounded-md font-ui font-bold text-xs ${
                  tab === t
                    ? 'bg-dvc-yellow text-dvc-border shadow-brutSm border-2 border-dvc-border'
                    : 'text-dvc-cream/70 hover:text-dvc-cream'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'body' && (
            <>
              <OptionRow label="character">
                <div className="grid grid-cols-3 gap-2">
                  {CHARACTER_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setConfig({ characterModel: m.id })}
                      className={`brut-btn rounded-md py-2 font-ui font-bold text-xs ${
                        config.characterModel === m.id
                          ? 'bg-dvc-yellow text-dvc-border'
                          : 'bg-dvc-section text-dvc-cream'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </OptionRow>
              <OptionRow label="skin tone">
                <ColorSwatchGrid
                  colors={BODY_TINTS}
                  value={config.bodyTint}
                  onChange={(c) => setConfig({ bodyTint: c })}
                />
              </OptionRow>
            </>
          )}

          {tab === 'hair' && (
            <OptionRow label="hair color">
              <ColorSwatchGrid
                colors={HAIR_TINTS}
                value={config.hairTint}
                onChange={(c) => setConfig({ hairTint: c })}
              />
            </OptionRow>
          )}

          {tab === 'outfit' && (
            <>
              <OptionRow label="top">
                <ColorSwatchGrid
                  colors={TOP_TINTS}
                  value={config.topTint}
                  onChange={(c) => setConfig({ topTint: c })}
                />
              </OptionRow>
              <OptionRow label="bottom">
                <ColorSwatchGrid
                  colors={BOTTOM_TINTS}
                  value={config.bottomTint}
                  onChange={(c) => setConfig({ bottomTint: c })}
                />
              </OptionRow>
            </>
          )}

          {tab === 'shoes' && (
            <OptionRow label="shoes">
              <ColorSwatchGrid
                colors={SHOE_TINTS}
                value={config.shoeTint}
                onChange={(c) => setConfig({ shoeTint: c })}
              />
            </OptionRow>
          )}
        </section>
      </main>

      <footer className="relative z-10 p-6 bg-dvc-section/85 backdrop-blur-md border-t-2 border-dvc-border flex justify-end">
        <button
          onClick={lockIn}
          className="brut-btn bg-dvc-teal text-white px-6 py-3 rounded-md font-ui font-black text-sm"
        >
          lock it in →
        </button>
      </footer>
    </div>
  )
}
