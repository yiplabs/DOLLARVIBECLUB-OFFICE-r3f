'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'
import { broadcastPos } from '@/store/roomStore'
import { AvatarMesh } from './avatarLoader'

const STEP_SPEED = 3.4

/** Local player avatar — driven by the avatarStore path queue. */
export function Avatar() {
  const config = useAvatarStore((s) => s.config)
  const path = useAvatarStore((s) => s.path)
  const setPath = useAvatarStore((s) => s.setPath)
  const setPos = useAvatarStore((s) => s.setPos)
  const initialPos = useAvatarStore.getState().pos

  const groupRef = useRef<THREE.Group>(null)
  const lastBroadcast = useRef(0)

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

  return (
    <group ref={groupRef} position={[initialPos[0], 0, initialPos[1]]}>
      <AvatarMesh config={config} isWalking={isWalking} showName />
    </group>
  )
}
