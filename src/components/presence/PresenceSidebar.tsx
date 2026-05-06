'use client'
import { useRoomStore } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'
import type { Peer } from '@/store/roomStore'
import { OnlineUserCard } from './OnlineUserCard'
import { MiniStatsStrip } from './MiniStatsStrip'
import { Minimap } from './Minimap'
import { useStepCounter } from '@/hooks/useStepCounter'

type Props = {
  myUserId: string
  myHandle: string
  online: number
  slug: string
  onSelectPeer: (peer: Peer & { isSelf?: boolean }) => void
  onEditCard: () => void
  onOpenAchievements?: () => void
}

export function PresenceSidebar({
  myUserId,
  myHandle,
  online,
  slug,
  onSelectPeer,
  onEditCard,
  onOpenAchievements,
}: Props) {
  const peers = useRoomStore((s) => s.peers)
  const myConfig = useAvatarStore((s) => s.config)
  const myPos = useAvatarStore((s) => s.pos)
  const steps = useStepCounter()
  const bubbles = useRoomStore((s) => s.bubbles)
  const msgsPerMin = bubbles.filter((b) => Date.now() - b.spawnedAt < 60000).length

  const selfPeer: Peer & { isSelf: true } = {
    userId: myUserId,
    handle: myHandle,
    displayName: myConfig.displayName,
    avatarConfig: myConfig,
    pos: myPos,
    path: [],
    lastSeen: Date.now(),
    isSelf: true,
  }

  const list = [selfPeer, ...Object.values(peers)]

  return (
    <aside className="fixed right-0 top-16 bottom-8 w-80 z-20 bg-dvc-section/85 backdrop-blur-md border-l-2 border-dvc-border flex flex-col">
      <div className="p-4 border-b-2 border-dvc-border">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-hand font-bold text-3xl text-dvc-cream">
            everyone here
          </h3>
          <span className="bg-dvc-yellow text-dvc-border px-2 py-0.5 rounded-md font-ui font-bold text-xs border-2 border-dvc-border shadow-brutSm">
            {online}
          </span>
        </div>
        <MiniStatsStrip online={online} msgsPerMin={msgsPerMin} steps={steps} />
        <div className="mt-3 flex justify-center">
          <Minimap slug={slug} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar p-3 space-y-2">
        {list.map((p) => (
          <OnlineUserCard
            key={p.userId}
            peer={p}
            onClick={() => onSelectPeer(p)}
          />
        ))}
      </div>

      <div className="p-3 border-t-2 border-dvc-border bg-dvc-bg/50 flex items-center justify-between">
        <button
          onClick={onEditCard}
          className="font-ui font-bold text-xs text-dvc-yellow hover:text-dvc-cream"
        >
          edit your card →
        </button>
        {onOpenAchievements && (
          <button
            onClick={onOpenAchievements}
            className="font-ui font-bold text-xs text-dvc-cream/70 hover:text-dvc-yellow"
          >
            🏆 achievements
          </button>
        )}
      </div>
    </aside>
  )
}
