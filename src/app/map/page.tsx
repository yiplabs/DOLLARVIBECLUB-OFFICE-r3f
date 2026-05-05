'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAvatarStore } from '@/store/avatarStore'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { MobileBlocker } from '@/components/auth/MobileBlocker'

const SceneRoot = dynamic(() => import('@/components/world/SceneRoot'), {
  ssr: false,
})
const WorldMapScene = dynamic(
  () => import('@/components/world/WorldMapScene'),
  { ssr: false },
)

export default function MapPage() {
  const router = useRouter()
  const hasSetup = useAvatarStore((s) => s.hasSetup)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasSetup) {
      router.replace('/create')
      return
    }
    setReady(true)
  }, [router, hasSetup])

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dvc-bg">
        <div className="font-hand text-3xl text-dvc-cream animate-pulse">
          loading the campus…
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dvc-bg">
      <MobileBlocker />

      <SceneRoot cameraZoom={24} cameraPosition={[20, 20, 20]}>
        <WorldMapScene />
      </SceneRoot>

      <header className="absolute top-0 inset-x-0 z-20 px-4 py-3 flex items-center justify-between bg-dvc-card/85 backdrop-blur-md border-b-2 border-dvc-border">
        <Link href="/" className="flex items-center gap-2 group">
          <DollarCoin size={32} />
          <span className="font-hand font-bold text-2xl text-dvc-cream group-hover:text-dvc-yellow">
            DVC Cowork
          </span>
        </Link>
        <div className="font-ui font-bold text-xs text-dvc-cream/80">
          campus map · click a building to enter
        </div>
        <Link
          href="/create"
          className="brut-btn bg-dvc-yellow text-dvc-border px-3 py-1.5 rounded-md font-ui font-bold text-xs"
        >
          edit avatar
        </Link>
      </header>
    </main>
  )
}
