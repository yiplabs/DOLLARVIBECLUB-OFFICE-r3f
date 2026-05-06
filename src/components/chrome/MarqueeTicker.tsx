'use client'

const ITEMS = [
  '💻 hunter is shipping live · join the stage →',
  '✨ 14 vibe coders online right now',
  '🎟️ FRI 20:00 utc · $1 ship-or-die',
  '🚀 47 projects shipped this week',
  '🌱 first day? say hi in the lounge',
  '🪴 pomodoros are running — deep focus is hot',
  '🎤 mentor row: 2 doors open',
]

export function MarqueeTicker() {
  const repeated = [...ITEMS, ...ITEMS]
  return (
    <div className="fixed bottom-0 inset-x-0 z-20 bg-dvc-card/85 backdrop-blur-md border-t-2 border-dvc-border h-8 overflow-hidden">
      <div className="flex items-center h-full whitespace-nowrap animate-marquee">
        {repeated.map((item, i) => (
          <span key={i} className="px-6 font-ui font-bold text-xs text-dvc-cream/80">
            {item}
            <span className="ml-6 text-dvc-yellow">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
