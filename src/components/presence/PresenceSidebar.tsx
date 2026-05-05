'use client'
import { useRoomStore } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'
import type { Peer } from '@/store/roomStore'
import { OnlineUserCard } from './OnlineUserCard'
import { MiniStatsStrip } from './MiniStatsStrip'

type Props = {
  myUserId: string
  myHandle: string
  online: number
  onSelectPeer: (peer: Peer & { isSelf?: boolean }) => void
  onEditCard: () => void
}

export function PresenceSidebar({
  myUserId,
  myHandle,
  online,
  onSelectPeer,
  onEditCard,
}: Props) {
  const peers = useRoomStore((s) => s.peers)
  const myConfig = useAvatarStore((s) => s.config)

  const selfPeer: Peer & { isSelf: true } = {
    userId: myUserId,
    handle: myHandle,
    displayName: myConfig.displayName,
    avatarConfig: myConfig,
    pos: useAvatarStore.getState().pos,
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
        <MiniStatsStrip online={online} msgsPerMin={3} steps={0} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
        {list.map((p) => (
          <OnlineUserCard
            key={p.userId}
            peer={p}
            onClick={() => onSelectPeer(p)}
          />
        ))}
      </div>

      <div className="p-3 border-t-2 border-dvc-border bg-dvc-bg/50">
        <button
          onClick={onEditCard}
          className="w-full font-ui font-bold text-xs text-dvc-yellow hover:text-dvc-cream"
        >
          edit your card →
        </button>
      </div>
    </aside>
  )
}
