'use client'
import { X } from 'lucide-react'
import type { Peer } from '@/store/roomStore'
import { ProfileStats } from './ProfileStats'

type Props = {
  peer: Peer & { isSelf?: boolean; workingOn?: string | null }
  onClose: () => void
}

export function ProfileCard({ peer, onClose }: Props) {
  return (
    <div
      className="fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: 'translate(-50%, -50%) rotate(-3deg)' }}
    >
      <div className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-5 w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-dvc-cream/60 hover:text-dvc-cream"
          aria-label="close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-lg border-2 border-dvc-border shrink-0"
            style={{ background: peer.avatarConfig.topTint }}
          />
          <div className="min-w-0">
            <div className="font-hand font-bold text-3xl text-dvc-cream leading-none truncate">
              {peer.displayName}
            </div>
            <div className="font-ui text-xs text-dvc-muted mt-1 truncate">
              @{peer.handle}
            </div>
          </div>
        </div>

        {peer.workingOn && (
          <div className="mt-4 inline-block bg-dvc-section border-2 border-dvc-border rounded-md px-2 py-1 font-ui font-bold text-xs text-dvc-yellow shadow-brutSm">
            shipping: {peer.workingOn}
          </div>
        )}

        <div className="mt-5 bg-dvc-section/60 border-2 border-dvc-border rounded-lg p-3">
          <div className="font-ui text-[10px] uppercase tracking-wider text-dvc-muted">
            current project
          </div>
          <div className="font-body text-sm text-dvc-cream/90 mt-1">
            {peer.workingOn ?? 'just vibing for now'}
          </div>
        </div>

        <ProfileStats isSelf={Boolean(peer.isSelf)} />

        {!peer.isSelf && (
          <button className="mt-5 w-full brut-btn bg-dvc-teal text-white py-2 rounded-md font-ui font-bold text-sm">
            wanna collab? →
          </button>
        )}
      </div>
    </div>
  )
}
