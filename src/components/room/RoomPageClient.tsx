'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAvatarStore } from '@/store/avatarStore'
import { useRealtimeRoom } from '@/hooks/useRealtimeRoom'
import { TopBar } from '@/components/chrome/TopBar'
import { MarqueeTicker } from '@/components/chrome/MarqueeTicker'
import { KeyboardShortcuts } from '@/components/chrome/KeyboardShortcuts'
import { PresenceSidebar } from '@/components/presence/PresenceSidebar'
import { ChatInput } from '@/components/chat/ChatInput'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { MagicLinkPanel } from '@/components/auth/MagicLinkPanel'
import { MobileBlocker } from '@/components/auth/MobileBlocker'
import type { Peer } from '@/store/roomStore'
import { broadcastEmote } from '@/store/roomStore'

const SceneRoot = dynamic(() => import('@/components/world/SceneRoot'), {
  ssr: false,
})
const RoomScene = dynamic(() => import('@/components/room/RoomScene'), {
  ssr: false,
})

export default function RoomPageClient({ slug }: { slug: string }) {
  const router = useRouter()
  const hasSetup = useAvatarStore((s) => s.hasSetup)
  const [ready, setReady] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [selectedPeer, setSelectedPeer] = useState<
    (Peer & { isSelf?: boolean }) | null
  >(null)

  // Wait for zustand-persist to hydrate from localStorage on first paint.
  useEffect(() => {
    if (!hasSetup) {
      router.replace('/create')
      return
    }
    setReady(true)
  }, [router, hasSetup])

  const { online, identity } = useRealtimeRoom(ready ? slug : '')

  useEffect(() => {
    if (!ready) return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === '?') {
        e.preventDefault()
        setShortcutsOpen((s) => !s)
      } else if (e.key === 'Escape') {
        setShortcutsOpen(false)
        setEditOpen(false)
        setAuthOpen(false)
        setSelectedPeer(null)
      } else if (e.key.toLowerCase() === 'e') {
        if (!editOpen) setEditOpen(true)
      } else if (e.key === '1') broadcastEmote('wave')
      else if (e.key === '2') broadcastEmote('dance')
      else if (e.key === '3') broadcastEmote('sit')
      else if (e.key === '4') broadcastEmote('clap')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [ready, editOpen])

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dvc-bg">
        <div className="font-hand text-3xl text-dvc-cream animate-pulse">
          loading the room…
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dvc-bg">
      <MobileBlocker />

      <SceneRoot>
        <RoomScene slug={slug} />
      </SceneRoot>

      <TopBar
        online={online}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenEdit={() => setEditOpen(true)}
      />

      <PresenceSidebar
        myUserId={identity.userId}
        myHandle={identity.handle}
        online={online}
        onSelectPeer={(p) => setSelectedPeer(p)}
        onEditCard={() => setEditOpen(true)}
      />

      <ChatInput />
      <MarqueeTicker />

      {selectedPeer && (
        <ProfileCard peer={selectedPeer} onClose={() => setSelectedPeer(null)} />
      )}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <MagicLinkPanel open={authOpen} onClose={() => setAuthOpen(false)} />
      <KeyboardShortcuts
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <button
        onClick={() => setShortcutsOpen(true)}
        className="fixed bottom-12 right-96 z-20 w-9 h-9 rounded-full bg-dvc-card border-2 border-dvc-border shadow-brutSm font-ui font-black text-dvc-cream hover:bg-dvc-yellow hover:text-dvc-border"
        aria-label="keyboard shortcuts"
      >
        ?
      </button>
    </main>
  )
}
