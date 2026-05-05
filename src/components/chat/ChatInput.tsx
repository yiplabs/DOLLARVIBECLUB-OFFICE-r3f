'use client'
import { useEffect, useRef, useState } from 'react'
import { broadcastChat, broadcastEmote } from '@/store/roomStore'

const MAX_LEN = 140
const COOLDOWN_MS = 1500

export function ChatInput() {
  const [value, setValue] = useState('')
  const [cooldown, setCooldown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
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
    if (trimmed.startsWith('/wave')) broadcastEmote('wave')
    else if (trimmed.startsWith('/dance')) broadcastEmote('dance')
    else if (trimmed.startsWith('/sit')) broadcastEmote('sit')
    else if (trimmed.startsWith('/clap')) broadcastEmote('clap')
    else if (trimmed.startsWith('/shout '))
      broadcastChat(trimmed.slice(7).slice(0, MAX_LEN), 'shout')
    else if (trimmed.startsWith('/me '))
      broadcastChat(trimmed.slice(4).slice(0, MAX_LEN), 'me')
    else broadcastChat(trimmed.slice(0, MAX_LEN), 'say')

    setValue('')
    setCooldown(true)
    window.setTimeout(() => setCooldown(false), COOLDOWN_MS)
  }

  return (
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
          placeholder="say something… (try /wave, /dance, /shout)"
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
  )
}
