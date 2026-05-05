'use client'
import { Html } from '@react-three/drei'
import { useEffect, useState } from 'react'

type Props = { pos: [number, number, number]; text: string; spawnedAt: number }

export function ChatBubble({ pos, text, spawnedAt }: Props) {
  const [opacity, setOpacity] = useState(1)
  useEffect(() => {
    const tick = () => {
      const age = Date.now() - spawnedAt
      if (age < 4000) setOpacity(1)
      else if (age < 5000) setOpacity(1 - (age - 4000) / 1000)
      else setOpacity(0)
    }
    tick()
    const id = window.setInterval(tick, 80)
    return () => window.clearInterval(id)
  }, [spawnedAt])

  return (
    <Html
      position={pos}
      center
      distanceFactor={8}
      occlude="blending"
      style={{ pointerEvents: 'none', opacity }}
      zIndexRange={[100, 0]}
    >
      <div className="relative">
        <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-dvc-border rounded-xl" />
        <div className="relative bg-dvc-card border-2 border-dvc-border rounded-xl px-3 py-2 font-body text-sm text-dvc-cream max-w-[200px] whitespace-pre-wrap">
          {text}
        </div>
      </div>
    </Html>
  )
}
