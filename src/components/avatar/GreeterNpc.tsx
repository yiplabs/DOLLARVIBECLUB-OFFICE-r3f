'use client'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PrimitiveAvatar } from './PrimitiveAvatar'
import type { AvatarConfig } from '@/lib/avatar/types'
import { useAvatarStore } from '@/store/avatarStore'

const GREETINGS = [
  'hey, welcome in.',
  "first time? press '?' for the cheat sheet.",
  'click any tile to walk over.',
  'try /dance — i won\'t judge.',
  'six rooms total. lounge is just the start.',
  'press G for settings — try the night palette.',
]

const GREETER_CONFIG: AvatarConfig = {
  characterModel: 'character-female-a.glb',
  bodyTint: '#E8B89B',
  hairTint: '#FBBF24',
  topTint: '#0D9488',
  bottomTint: '#1A1A1A',
  shoeTint: '#FBBF24',
  displayName: 'rita · greeter',
  accessory: 'glasses',
  accessoryTint: '#FBBF24',
}

const PROXIMITY = 4 // grid cells

type Props = {
  position: [number, number]
}

/**
 * Friendly NPC who greets the player with a rotating bubble when they get close.
 * Stationary, primitive-only, idles in place.
 */
export function GreeterNpc({ position }: Props) {
  const group = useRef<THREE.Group>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const lastBubbleAt = useRef(0)
  const lineIdx = useRef(0)

  useFrame(() => {
    const myPos = useAvatarStore.getState().pos
    const dist = Math.hypot(myPos[0] - position[0], myPos[1] - position[1])
    const now = Date.now()
    if (dist < PROXIMITY && now - lastBubbleAt.current > 6000) {
      setBubble(GREETINGS[lineIdx.current % GREETINGS.length])
      lineIdx.current++
      lastBubbleAt.current = now
      window.setTimeout(() => setBubble(null), 4500)
    }
    // Idle wave occasionally
    if (group.current) {
      group.current.rotation.y = Math.sin(now / 2400) * 0.4
    }
  })

  useEffect(() => {
    // Auto-greet after 1s of mounting
    const id = window.setTimeout(() => {
      setBubble(GREETINGS[0])
      lastBubbleAt.current = Date.now()
      window.setTimeout(() => setBubble(null), 4500)
    }, 1000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <group ref={group} position={[position[0], 0, position[1]]}>
      <PrimitiveAvatar config={GREETER_CONFIG} showName />
      {bubble && (
        <Html
          position={[0, 2.6, 0]}
          center
          distanceFactor={8}
          occlude="blending"
          style={{ pointerEvents: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div className="relative">
            <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-dvc-border rounded-xl" />
            <div className="relative bg-dvc-yellow border-2 border-dvc-border rounded-xl px-3 py-2 font-body text-sm text-dvc-border max-w-[220px] whitespace-pre-wrap">
              {bubble}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
