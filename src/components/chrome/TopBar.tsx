'use client'
import Link from 'next/link'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { DollarCoin } from './DollarCoin'
import { useAvatarStore } from '@/store/avatarStore'

type Props = {
  online: number
  onOpenAuth?: () => void
  onOpenEdit?: () => void
  isGuest?: boolean
}

export function TopBar({ online, onOpenAuth, onOpenEdit, isGuest = true }: Props) {
  const config = useAvatarStore((s) => s.config)

  return (
    <header className="sticky top-0 z-20 h-16 bg-dvc-card/85 backdrop-blur-md border-b-2 border-dvc-border">
      <div className="h-full px-4 flex items-center gap-3">
        <Link href="/map" className="flex items-center gap-2 group">
          <DollarCoin size={36} />
          <span className="font-hand font-bold text-2xl text-dvc-cream group-hover:text-dvc-yellow transition-colors">
            DVC Cowork
          </span>
        </Link>
        <Link
          href="/map"
          className="ml-2 flex items-center gap-1 px-2 py-1 font-ui font-bold text-xs text-dvc-cream/70 hover:text-dvc-yellow"
        >
          <ArrowLeft size={14} />
          back to campus
        </Link>

        <div className="flex-1 flex justify-center">
          <div className="bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-1 shadow-brutSm">
            <span className="font-ui font-bold text-xs text-dvc-yellow">
              FRI 20:00 utc
            </span>
            <span className="mx-2 text-dvc-border">·</span>
            <span className="font-ui font-bold text-xs text-dvc-cream">
              ship-or-die · join →
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-dvc-section border-2 border-dvc-border rounded-md">
            <span className="w-2 h-2 rounded-full bg-dvc-online animate-pulse" />
            <span className="font-ui font-bold text-xs text-dvc-cream">
              {online} online
            </span>
          </div>

          <button
            onClick={onOpenEdit}
            className="flex items-center gap-2 px-2 py-1 bg-dvc-section border-2 border-dvc-border rounded-md hover:shadow-brutSm transition-all"
            aria-label="edit your card"
          >
            <span
              className="w-4 h-4 rounded-full border border-dvc-border"
              style={{ background: config.topTint }}
            />
            <span className="font-ui font-bold text-xs text-dvc-cream max-w-[100px] truncate">
              {config.displayName}
            </span>
            <Edit3 size={12} className="text-dvc-cream/60" />
          </button>

          {isGuest ? (
            <button
              onClick={onOpenAuth}
              className="brut-btn bg-dvc-yellow text-dvc-border px-3 py-1.5 rounded-md font-ui font-bold text-xs"
            >
              claim your spot
            </button>
          ) : (
            <a
              href="https://dollarvibeclub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="brut-btn bg-dvc-teal text-white px-3 py-1.5 rounded-md font-ui font-bold text-xs"
            >
              $1/mo
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
