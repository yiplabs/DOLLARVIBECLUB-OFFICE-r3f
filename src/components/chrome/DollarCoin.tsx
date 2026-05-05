'use client'
import { cn } from '@/lib/utils'

export function DollarCoin({
  size = 40,
  className,
  spin = false,
}: {
  size?: number
  className?: string
  spin?: boolean
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-dvc-yellow border-dvc-border shadow-brutSm',
        spin && 'hover:animate-spin-slow',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderWidth: Math.max(2, Math.round(size / 14)),
      }}
      aria-hidden
    >
      <span
        className="font-ui font-black text-dvc-border leading-none"
        style={{ fontSize: size * 0.55 }}
      >
        $
      </span>
    </div>
  )
}
