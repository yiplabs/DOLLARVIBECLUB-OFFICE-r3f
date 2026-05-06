'use client'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAvatarStore } from '@/store/avatarStore'
import { useRealtimeRoom } from '@/hooks/useRealtimeRoom'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAfkAutoEmote } from '@/hooks/useAfkAutoEmote'
import { useAudioWiring } from '@/hooks/useAudioWiring'
import { TopBar } from '@/components/chrome/TopBar'
import { MarqueeTicker } from '@/components/chrome/MarqueeTicker'
import { EmoteBar } from '@/components/chrome/EmoteBar'
import { KeyboardShortcuts } from '@/components/chrome/KeyboardShortcuts'
import { OnboardingTour } from '@/components/chrome/OnboardingTour'
import { SettingsPanel } from '@/components/chrome/SettingsPanel'
import { MusicWidget } from '@/components/chrome/MusicWidget'
import { PomodoroWidget } from '@/components/chrome/PomodoroWidget'
import { PerfHud } from '@/components/chrome/PerfHud'
import { AchievementsPanel } from '@/components/chrome/AchievementsPanel'
import { ActivityFeed } from '@/components/chrome/ActivityFeed'
import { RoomInfoOverlay } from '@/components/chrome/RoomInfoOverlay'
import { getRoom } from '@/lib/rooms/catalog'
import { useSettingsStore } from '@/store/settingsStore'
import { useAchievementWatcher } from '@/hooks/useAchievementWatcher'
import { PresenceSidebar } from '@/components/presence/PresenceSidebar'
import { ChatInput } from '@/components/chat/ChatInput'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { MagicLinkPanel } from '@/components/auth/MagicLinkPanel'
import { MobileBlocker } from '@/components/auth/MobileBlocker'
import type { Peer } from '@/store/roomStore'

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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [selectedPeer, setSelectedPeer] = useState<
    (Peer & { isSelf?: boolean }) | null
  >(null)

  useEffect(() => {
    if (!hasSetup) {
      router.replace('/create')
      return
    }
    setReady(true)
  }, [router, hasSetup])

  const { online, identity } = useRealtimeRoom(ready ? slug : '')

  const handleEscape = useCallback(() => {
    setShortcutsOpen(false)
    setEditOpen(false)
    setAuthOpen(false)
    setSettingsOpen(false)
    setAchievementsOpen(false)
    setSelectedPeer(null)
  }, [])

  useKeyboardShortcuts(ready, {
    onHelp: () => setShortcutsOpen((s) => !s),
    onEdit: () => setEditOpen((s) => !s),
    onSettings: () => setSettingsOpen((s) => !s),
    onEscape: handleEscape,
  })
  useAfkAutoEmote(ready)
  useAchievementWatcher(slug)
  useAudioWiring()
  const showPerfHud = useSettingsStore((s) => s.showPerfHud)

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dvc-bg">
        <div className="font-hand text-3xl text-dvc-cream animate-pulse">
          loading the room…
        </div>
      </main>
    )
  }

  const selfAsPeer: Peer & { isSelf: true } = {
    userId: identity.userId,
    handle: identity.handle,
    displayName: identity.displayName,
    avatarConfig: identity.avatarConfig,
    pos: useAvatarStore.getState().pos,
    path: [],
    lastSeen: Date.now(),
    isSelf: true,
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dvc-bg">
      <MobileBlocker />

      <SceneRoot>
        <RoomScene
          slug={slug}
          onSelectSelf={() => setSelectedPeer(selfAsPeer)}
          onSelectPeer={(peer) => setSelectedPeer(peer)}
        />
      </SceneRoot>

      <TopBar
        online={online}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenEdit={() => setEditOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <PresenceSidebar
        myUserId={identity.userId}
        myHandle={identity.handle}
        online={online}
        slug={slug}
        onSelectPeer={(p) => setSelectedPeer(p)}
        onEditCard={() => setEditOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
      />

      <RoomInfoOverlay slug={slug} />
      <ChatInput />
      <EmoteBar />
      <MarqueeTicker />
      <MusicWidget />
      <ActivityFeed />
      <PomodoroWidget defaultOpen={getRoom(slug)?.theme === 'focus'} />
      <PerfHud visible={showPerfHud} />
      <OnboardingTour />

      {selectedPeer && (
        <ProfileCard peer={selectedPeer} onClose={() => setSelectedPeer(null)} />
      )}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <MagicLinkPanel open={authOpen} onClose={() => setAuthOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AchievementsPanel
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
      />
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
