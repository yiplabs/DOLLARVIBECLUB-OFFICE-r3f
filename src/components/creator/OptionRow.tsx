'use client'

export function OptionRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-dvc-card border-2 border-dvc-border rounded-lg shadow-brutSm p-3">
      <div className="font-ui font-bold text-[10px] uppercase tracking-wider text-dvc-cream/70 mb-2">
        {label}
      </div>
      {children}
    </div>
  )
}
