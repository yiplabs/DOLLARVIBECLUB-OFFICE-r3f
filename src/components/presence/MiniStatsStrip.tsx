'use client'

export function MiniStatsStrip({
  online,
  msgsPerMin,
  steps,
}: {
  online: number
  msgsPerMin: number
  steps: number
}) {
  const cards = [
    { label: 'here', value: online },
    { label: 'msg/min', value: msgsPerMin },
    { label: 'my steps', value: steps },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-dvc-card border-2 border-dvc-border rounded-md shadow-brutSm py-2 px-1 text-center"
        >
          <div className="font-display font-black text-xl text-dvc-yellow leading-none">
            {c.value}
          </div>
          <div className="font-ui font-bold text-[10px] text-dvc-cream/70 mt-0.5 uppercase tracking-wider">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  )
}
