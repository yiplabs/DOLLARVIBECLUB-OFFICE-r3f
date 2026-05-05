'use client'
import { cn } from '@/lib/utils'

type Props = {
  colors: readonly string[]
  value: string
  onChange: (color: string) => void
  size?: number
}

export function ColorSwatchGrid({ colors, value, onChange, size = 32 }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          aria-label={c}
          className={cn(
            'rounded-md border-2 transition-all',
            value === c
              ? 'border-dvc-yellow shadow-brutSm scale-110'
              : 'border-dvc-border hover:scale-105',
          )}
          style={{ background: c, width: size, height: size }}
        />
      ))}
    </div>
  )
}
