'use client'
import type { Peer } from '@/store/roomStore'

type Props = {
  peer: Peer & { isSelf?: boolean }
  onClick?: () => void
}

export function OnlineUserCard({ peer, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-dvc-card border-2 border-dvc-border rounded-lg shadow-brutSm hover:shadow-brut p-2.5 flex items-center gap-2.5 group transition-all hover:-translate-y-px hover:translate-x-px"
    >
      <div
        className="w-9 h-9 rounded-md border-2 border-dvc-border shrink-0 relative"
        style={{ background: peer.avatarConfig.topTint }}
      >
        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-dvc-online border border-dvc-border" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-ui font-bold text-sm text-dvc-cream truncate flex items-center gap-1.5">
          {peer.displayName}
          {peer.isSelf && (
            <span className="text-[9px] uppercase tracking-wider bg-dvc-yellow text-dvc-border px-1 py-0.5 rounded">
              you
            </span>
          )}
        </div>
        <div className="font-ui text-[11px] text-dvc-muted truncate">
          @{peer.handle}
        </div>
      </div>
    </button>
  )
}
