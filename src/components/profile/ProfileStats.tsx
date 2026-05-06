'use client'
import { useAchievementsStore, ACHIEVEMENTS } from '@/store/achievementsStore'

type Props = {
  /** Self-only — peers don't have stats locally yet (multiplayer is v1). */
  isSelf: boolean
}

/**
 * A small achievements + visited-rooms summary, dropped into the bottom of
 * <ProfileCard /> when the card is the user's own.
 */
export function ProfileStats({ isSelf }: Props) {
  const unlocked = useAchievementsStore((s) => s.unlocked)
  const visited = useAchievementsStore((s) => s.visitedRooms)

  if (!isSelf) return null

  const got = Object.keys(unlocked).length
  const visitedCount = Object.keys(visited).length

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Stat label="achievements" value={`${got}/${ACHIEVEMENTS.length}`} />
      <Stat label="rooms visited" value={`${visitedCount}/6`} />
      <Stat
        label="streak"
        value={got > 0 ? `${Math.min(got, 7)} day` : 'fresh'}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-dvc-section border-2 border-dvc-border rounded-md py-2 text-center">
      <div className="font-display font-black text-base text-dvc-yellow leading-none tabular-nums">
        {value}
      </div>
      <div className="font-ui font-bold text-[9px] text-dvc-cream/70 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}
