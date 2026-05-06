'use client'
import { useEffect, useRef, useState } from 'react'
import { broadcastChat } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'

const MAX_LEN = 140
const COOLDOWN_MS = 1500

const SLASH_HELP = [
  { cmd: '/wave', what: 'wave for 2.2s' },
  { cmd: '/dance', what: 'dance for 4.5s' },
  { cmd: '/sit', what: 'sit (toggle)' },
  { cmd: '/clap', what: 'clap for 2s' },
  { cmd: '/shout <msg>', what: 'shout in red' },
  { cmd: '/me <action>', what: 'roleplay action' },
]

export function ChatInput() {
  const [value, setValue] = useState('')
  const [cooldown, setCooldown] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const setEmote = useAvatarStore((s) => s.setEmote)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = () => {
    const trimmed = value.trim()
    if (!trimmed || cooldown) return
    if (trimmed === '/wave') setEmote('wave', 2200)
    else if (trimmed === '/dance') setEmote('dance', 4500)
    else if (trimmed === '/sit') {
      const cur = useAvatarStore.getState().emote
      setEmote(cur === 'sit' ? 'idle' : 'sit')
    } else if (trimmed === '/clap') setEmote('clap', 2000)
    else if (trimmed.startsWith('/shout '))
      broadcastChat(trimmed.slice(7).slice(0, MAX_LEN), 'shout')
    else if (trimmed.startsWith('/me '))
      broadcastChat(trimmed.slice(4).slice(0, MAX_LEN), 'me')
    else if (trimmed === '/help') {
      setHelpOpen(true)
      setValue('')
      return
    } else broadcastChat(trimmed.slice(0, MAX_LEN), 'say')

    setValue('')
    setCooldown(true)
    window.setTimeout(() => setCooldown(false), COOLDOWN_MS)
  }

  return (
    <>
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="bg-dvc-card/85 backdrop-blur-md border-2 border-dvc-border rounded-xl shadow-brut p-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            maxLength={MAX_LEN}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send()
            }}
            placeholder="say something… (try /wave, /dance, /shout, /help)"
            className="flex-1 bg-transparent outline-none px-2 py-1 font-body text-sm text-dvc-cream placeholder:text-dvc-muted/60"
          />
          <span className="font-ui text-[10px] text-dvc-muted tabular-nums">
            {value.length}/{MAX_LEN}
          </span>
          <button
            onClick={send}
            disabled={cooldown || !value.trim()}
            className="brut-btn bg-dvc-teal text-white px-3 py-1 rounded-md font-ui font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            send
          </button>
        </div>
      </div>

      {helpOpen && (
        <div
          className="fixed inset-0 z-50 bg-dvc-bg/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-hand font-bold text-3xl text-dvc-cream mb-3">
              chat slash commands
            </h3>
            <ul className="space-y-2">
              {SLASH_HELP.map((s) => (
                <li
                  key={s.cmd}
                  className="flex items-center justify-between bg-dvc-section rounded-md px-3 py-1.5 border-2 border-dvc-border"
                >
                  <code className="font-ui font-bold text-xs text-dvc-yellow">
                    {s.cmd}
                  </code>
                  <span className="font-ui text-xs text-dvc-cream/80">
                    {s.what}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setHelpOpen(false)}
              className="mt-4 w-full brut-btn bg-dvc-teal text-white py-2 rounded-md font-ui font-bold text-sm"
            >
              got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
