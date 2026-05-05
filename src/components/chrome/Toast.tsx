'use client'
import { cn } from '@/lib/utils'

export type ToastKind = 'info' | 'success' | 'warn' | 'error'

const ACCENT: Record<ToastKind, string> = {
  info: 'bg-dvc-teal',
  success: 'bg-dvc-online',
  warn: 'bg-dvc-yellow',
  error: 'bg-rose-500',
}

export function Toast({
  kind = 'info',
  message,
  onClose,
}: {
  kind?: ToastKind
  message: string
  onClose?: () => void
}) {
  return (
    <div className="relative flex items-stretch bg-dvc-card border-2 border-dvc-border rounded-lg shadow-brutSm overflow-hidden">
      <div className={cn('w-1.5', ACCENT[kind])} />
      <div className="px-3 py-2 font-ui font-bold text-sm text-dvc-cream pr-6">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-dvc-cream/60 hover:text-dvc-cream font-bold text-sm"
          aria-label="dismiss"
        >
          ×
        </button>
      )}
    </div>
  )
}
