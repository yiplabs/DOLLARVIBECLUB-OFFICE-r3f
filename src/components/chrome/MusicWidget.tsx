'use client'
import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Play, X } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

const TRACKS = [
  {
    id: 'lo-fi-girl',
    label: 'lo-fi · study beats',
    youtubeId: 'jfKfPfyJRdk',
  },
  {
    id: 'jazz-cafe',
    label: 'jazz · slow cafe',
    youtubeId: '-FlxM_0S2lA',
  },
  {
    id: 'synthwave',
    label: 'synthwave · midnight',
    youtubeId: '4xDzrJKXOOY',
  },
]

/**
 * Lightweight floating music widget. Uses a hidden YouTube IFrame for playback;
 * if the embed is blocked (no network, restrictive CSP), the widget gracefully
 * shows a "blocked" state instead of crashing.
 */
export function MusicWidget() {
  const playing = useSettingsStore((s) => s.musicPlaying)
  const togglePlaying = useSettingsStore((s) => s.toggleMusic)
  const volume = useSettingsStore((s) => s.musicVolume)
  const [open, setOpen] = useState(false)
  const [track, setTrack] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Only mount the iframe when the user opts in. We don't auto-start audio.
    if (!playing || blocked) return
    const t = window.setTimeout(() => {
      // crude block detection: if the iframe stays empty for 3s, mark blocked
      if (iframeRef.current && !iframeRef.current.contentWindow) {
        setBlocked(true)
      }
    }, 3000)
    return () => window.clearTimeout(t)
  }, [playing, blocked])

  const current = TRACKS[track]
  const src = `https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&controls=0&mute=${volume === 0 ? 1 : 0}&loop=1&playlist=${current.youtubeId}&iv_load_policy=3&modestbranding=1`

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-12 left-4 z-30 w-11 h-11 rounded-full bg-dvc-card border-2 border-dvc-border shadow-brut flex items-center justify-center hover:bg-dvc-yellow hover:text-dvc-border text-dvc-cream"
        aria-label="music"
        title={playing ? `playing: ${current.label}` : 'music'}
      >
        <Music size={18} className={playing ? 'text-dvc-yellow' : ''} />
      </button>

      {open && (
        <div
          className="fixed bottom-24 left-4 z-30 w-72 bg-dvc-card border-2 border-dvc-border rounded-xl shadow-brutLg p-3 animate-pop-in"
          role="dialog"
        >
          <header className="flex items-center justify-between">
            <span className="font-hand font-bold text-xl text-dvc-cream">
              ambient sounds
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-dvc-cream/60 hover:text-dvc-cream"
            >
              <X size={16} />
            </button>
          </header>

          <ul className="mt-2 space-y-1">
            {TRACKS.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => setTrack(idx)}
                  className={`w-full text-left px-2 py-1.5 rounded-md font-ui font-bold text-xs ${
                    track === idx
                      ? 'bg-dvc-yellow text-dvc-border'
                      : 'text-dvc-cream/80 hover:bg-dvc-section'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={togglePlaying}
              className="brut-btn bg-dvc-teal text-white px-3 py-1.5 rounded-md font-ui font-bold text-xs flex items-center gap-1.5"
            >
              {playing ? (
                <>
                  <Pause size={12} /> pause
                </>
              ) : (
                <>
                  <Play size={12} /> play
                </>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) =>
                useSettingsStore.getState().setMusicVolume(parseFloat(e.target.value))
              }
              className="flex-1 accent-dvc-yellow"
            />
          </div>

          {blocked && (
            <p className="mt-2 font-ui text-[10px] text-rose-400">
              embed blocked by network · try a different track
            </p>
          )}
        </div>
      )}

      {/* Hidden iframe for playback */}
      {playing && !blocked && (
        <iframe
          ref={iframeRef}
          src={src}
          allow="autoplay"
          aria-hidden
          tabIndex={-1}
          style={{
            position: 'fixed',
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: 'none',
            left: -1000,
            top: -1000,
          }}
        />
      )}
    </>
  )
}
