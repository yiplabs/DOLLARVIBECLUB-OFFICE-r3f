'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'
import { broadcastPos } from '@/store/roomStore'
import { AvatarMesh } from './avatarLoader'
import type { EmoteState } from './PrimitiveAvatar'

const STEP_SPEED = 3.4

type Props = { onSelect?: () => void }

/** Local player avatar — driven by the avatarStore path queue + emote state. */
export function Avatar({ onSelect }: Props) {
  const config = useAvatarStore((s) => s.config)
  const path = useAvatarStore((s) => s.path)
  const emote = useAvatarStore((s) => s.emote)
  const emoteExpiresAt = useAvatarStore((s) => s.emoteExpiresAt)
  const setPath = useAvatarStore((s) => s.setPath)
  const setPos = useAvatarStore((s) => s.setPos)
  const setEmote = useAvatarStore((s) => s.setEmote)
  const initialPos = useAvatarStore.getState().pos

  const groupRef = useRef<THREE.Group>(null)
  const lastBroadcast = useRef(0)

  // Auto-clear timed emotes
  useEffect(() => {
    if (!emoteExpiresAt) return
    const id = window.setTimeout(
      () => setEmote('idle'),
      Math.max(0, emoteExpiresAt - Date.now()),
    )
    return () => window.clearTimeout(id)
  }, [emoteExpiresAt, setEmote])

  useFrame((_, dt) => {
    const group = groupRef.current
    if (!group) return
    if (path.length === 0) return
    const [tx, tz] = path[0]
    const dx = tx - group.position.x
    const dz = tz - group.position.z
    const dist = Math.hypot(dx, dz)
    const step = Math.min(dist, STEP_SPEED * dt)
    if (dist > 0.001) {
      group.position.x += (dx / dist) * step
      group.position.z += (dz / dist) * step
      group.rotation.y = Math.atan2(dx, dz)
    }
    if (dist < 0.05) {
      group.position.x = tx
      group.position.z = tz
      setPath(path.slice(1))
    }
    setPos([group.position.x, group.position.z])
    const now = performance.now()
    if (now - lastBroadcast.current > 100) {
      lastBroadcast.current = now
      broadcastPos([group.position.x, group.position.z])
    }
  })

  const isWalking = path.length > 0
  const renderEmote: EmoteState = isWalking ? 'walk' : emote

  return (
    <group
      ref={groupRef}
      position={[initialPos[0], 0, initialPos[1]]}
      onPointerOver={(e) => {
        if (!onSelect) return
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        if (!onSelect) return
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        if (!onSelect) return
        e.stopPropagation()
        onSelect()
      }}
    >
      <AvatarMesh config={config} isWalking={isWalking} emote={renderEmote} showName />
    </group>
  )
}
