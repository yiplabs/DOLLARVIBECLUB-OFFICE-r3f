'use client'

export function DemoModeBanner({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed top-0 inset-x-0 z-30 bg-dvc-yellow text-dvc-border border-b-2 border-dvc-border font-ui font-bold text-xs sm:text-sm px-4 py-1.5 text-center">
      demo mode — multiplayer offline · add Supabase env vars to enable real-time
    </div>
  )
}
