'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AvatarMesh } from './avatarLoader'
import { useRoomStore, type Peer } from '@/store/roomStore'

const STEP_SPEED = 3.0

type Props = {
  peer: Peer
  onSelect?: (peer: Peer) => void
}

export function RemoteAvatar({ peer, onSelect }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return
    const cur = useRoomStore.getState().peers[peer.userId]
    const path = cur?.path ?? []
    const target = path.length ? path[0] : (cur?.pos ?? peer.pos)
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
      if (!cur) return
      useRoomStore.getState().upsertPeer({
        ...cur,
        path: cur.path.slice(1),
        pos: target,
      })
    }
  })

  const isWalking =
    (useRoomStore.getState().peers[peer.userId]?.path.length ?? 0) > 0

  return (
    <group
      ref={groupRef}
      position={[peer.pos[0], 0, peer.pos[1]]}
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
        onSelect(peer)
      }}
    >
      <AvatarMesh config={peer.avatarConfig} isWalking={isWalking} showName />
    </group>
  )
}
