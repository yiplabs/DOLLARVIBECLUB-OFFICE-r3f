'use client'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PrimitiveAvatar } from './PrimitiveAvatar'
import type { AvatarConfig } from '@/lib/avatar/types'
import { useAvatarStore } from '@/store/avatarStore'

const PROXIMITY = 4
const BUBBLE_COOLDOWN_MS = 6000
const BUBBLE_DURATION_MS = 4500

export type NpcDefinition = {
  config: AvatarConfig
  position: [number, number]
  /** Greeting lines rotated in order. */
  lines: string[]
  /** Auto-greet after this many ms of mounting. Set to null to skip. */
  autoGreetMs?: number | null
  /** Bubble background color */
  bubbleBg?: string
  /** Bubble text color */
  bubbleColor?: string
  /** Idle behaviour — "still" (slight head turn) or "fidget" (full-body sway) */
  idle?: 'still' | 'fidget'
}

type Props = NpcDefinition

/**
 * Reusable NPC: stationary primitive avatar + proximity-triggered chat
 * bubbles. Each room composes its own NpcDefinition.
 */
export function NpcAvatar({
  config,
  position,
  lines,
  autoGreetMs = 1000,
  bubbleBg = '#FBBF24',
  bubbleColor = '#141412',
  idle = 'still',
}: Props) {
  const group = useRef<THREE.Group>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const lastBubbleAt = useRef(0)
  const lineIdx = useRef(0)

  useFrame(() => {
    const myPos = useAvatarStore.getState().pos
    const dist = Math.hypot(myPos[0] - position[0], myPos[1] - position[1])
    const now = Date.now()

    if (lines.length > 0 && dist < PROXIMITY && now - lastBubbleAt.current > BUBBLE_COOLDOWN_MS) {
      setBubble(lines[lineIdx.current % lines.length])
      lineIdx.current++
      lastBubbleAt.current = now
      window.setTimeout(() => setBubble(null), BUBBLE_DURATION_MS)
    }

    if (group.current) {
      if (idle === 'fidget') {
        group.current.rotation.y = Math.sin(now / 1600) * 0.6
        group.current.position.y = Math.sin(now / 800) * 0.04
      } else {
        group.current.rotation.y = Math.sin(now / 2400) * 0.4
      }
    }
  })

  useEffect(() => {
    if (autoGreetMs == null || lines.length === 0) return
    const id = window.setTimeout(() => {
      setBubble(lines[0])
      lastBubbleAt.current = Date.now()
      window.setTimeout(() => setBubble(null), BUBBLE_DURATION_MS)
    }, autoGreetMs)
    return () => window.clearTimeout(id)
  }, [autoGreetMs, lines])

  return (
    <group ref={group} position={[position[0], 0, position[1]]}>
      <PrimitiveAvatar config={config} showName />
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
            <div
              className="relative border-2 border-dvc-border rounded-xl px-3 py-2 font-body text-sm max-w-[220px] whitespace-pre-wrap"
              style={{ background: bubbleBg, color: bubbleColor }}
            >
              {bubble}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
