'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { AvatarMesh } from './avatarLoader'
import type { Peer } from '@/store/roomStore'
import { useRoomStore } from '@/store/roomStore'

const STEP_SPEED = 3.0

export function RemoteAvatar({ peer }: { peer: Peer }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Group | null>(null)

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return
    const path = useRoomStore.getState().peers[peer.userId]?.path ?? []
    const target = path.length
      ? path[0]
      : useRoomStore.getState().peers[peer.userId]?.pos ?? peer.pos
    const dx = target[0] - g.position.x
    const dz = target[1] - g.position.z
    const dist = Math.hypot(dx, dz)
    const step = Math.min(dist, STEP_SPEED * dt)
    if (dist > 0.001) {
      g.position.x += (dx / dist) * step
      g.position.z += (dz / dist) * step
      g.rotation.y = Math.atan2(dx, dz)
    }
    if (path.length && dist < 0.05) {
      const cur = useRoomStore.getState().peers[peer.userId]
      if (!cur) return
      useRoomStore.getState().upsertPeer({ ...cur, path: cur.path.slice(1), pos: target })
    }
  })

  const animState =
    (useRoomStore.getState().peers[peer.userId]?.path.length ?? 0) > 0 ? 'walk' : 'idle'

  return (
    <group ref={groupRef} position={[peer.pos[0], 0, peer.pos[1]]}>
      <AvatarMesh config={peer.avatarConfig} state={animState} innerRef={meshRef} />
      <Html
        position={[0, 2.2, 0]}
        center
        distanceFactor={8}
        occlude="blending"
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-dvc-card border-2 border-dvc-border rounded-md shadow-brutSm px-2 py-0.5 font-ui font-bold text-xs text-dvc-cream whitespace-nowrap">
          {peer.displayName}
        </div>
      </Html>
    </group>
  )
}
