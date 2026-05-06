'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'

const PROXIMITY = 2.4

type Props = {
  /** door pivot position in world space */
  position: [number, number, number]
  /** door width (world units) */
  width?: number
  /** door height (world units) */
  height?: number
  /** swing direction — 'in' = away from interior, 'out' = toward interior */
  swing?: 'in' | 'out'
  color?: string
}

/**
 * A swinging door that opens when the local avatar is within proximity.
 * Useful as the south-wall doorway visual filler in any room.
 */
export function AnimatedDoor({
  position,
  width = 1.2,
  height = 2.2,
  swing = 'out',
  color = '#8B6440',
}: Props) {
  const pivot = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const p = pivot.current
    if (!p) return
    const myPos = useAvatarStore.getState().pos
    const dist = Math.hypot(myPos[0] - position[0], myPos[1] - position[2])
    const open = dist < PROXIMITY ? (swing === 'out' ? -1 : 1) : 0
    const target = open * (Math.PI / 2.2)
    p.rotation.y += (target - p.rotation.y) * Math.min(1, dt * 4)
  })

  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + 0.08, 0.08, 0.18]} />
        <meshStandardMaterial color="#3D2D24" />
      </mesh>
      <group ref={pivot} position={[-width / 2, 0, 0]}>
        <mesh position={[width / 2, height / 2, 0]} castShadow>
          <boxGeometry args={[width, height, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Handle */}
        <mesh position={[width - 0.18, height / 2, 0.04]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.6} />
        </mesh>
        {/* Panel detail */}
        <mesh position={[width / 2, height * 0.7, 0.04]}>
          <boxGeometry args={[width * 0.6, height * 0.18, 0.01]} />
          <meshStandardMaterial color="#3D2D24" />
        </mesh>
        <mesh position={[width / 2, height * 0.3, 0.04]}>
          <boxGeometry args={[width * 0.6, height * 0.18, 0.01]} />
          <meshStandardMaterial color="#3D2D24" />
        </mesh>
      </group>
    </group>
  )
}
