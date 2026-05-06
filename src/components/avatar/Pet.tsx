'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'

const FOLLOW_SPEED = 2.6
const FOLLOW_DISTANCE = 0.7
const TELEPORT_THRESHOLD = 8

type Props = {
  /** Pet body color */
  color?: string
  /** Pet accent (ears, snout) color */
  accent?: string
  /** Pet "name" — shown above when hovered */
  name?: string
}

/**
 * A small primitive pet that trails behind the avatar.
 * Cute, low-poly, no GLB required.
 */
export function Pet({ color = '#FBBF24', accent = '#2D2D2D' }: Props) {
  const group = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Mesh>(null)
  const targetVec = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return

    const ownerPos = useAvatarStore.getState().pos
    // Trail behind the owner — offset by FOLLOW_DISTANCE in -Z direction
    targetVec.current.set(ownerPos[0] - 0.5, 0, ownerPos[1] + FOLLOW_DISTANCE)

    const dx = targetVec.current.x - g.position.x
    const dz = targetVec.current.z - g.position.z
    const dist = Math.hypot(dx, dz)

    if (dist > TELEPORT_THRESHOLD) {
      g.position.set(targetVec.current.x, 0, targetVec.current.z)
    } else if (dist > 0.05) {
      const step = Math.min(dist, FOLLOW_SPEED * dt)
      g.position.x += (dx / dist) * step
      g.position.z += (dz / dist) * step
      g.rotation.y = Math.atan2(dx, dz)
    }

    // Bob + tail wag
    const t = state.clock.elapsedTime
    g.position.y = Math.abs(Math.sin(t * 6)) * 0.05
    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 12) * 0.6
    }
  })

  return (
    <group ref={group}>
      {/* body */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.32, 0.28]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* snout */}
      <mesh position={[0, 0.28, 0.4]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.1]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {/* ears */}
      <mesh position={[-0.09, 0.45, 0.26]} rotation-z={-0.4} castShadow>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.09, 0.45, 0.26]} rotation-z={0.4} castShadow>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.06, 0.34, 0.41]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.06, 0.34, 0.41]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      {/* legs */}
      {[-0.1, 0.1].map((x, i) =>
        [-0.15, 0.15].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.06, z]} castShadow>
            <boxGeometry args={[0.06, 0.12, 0.06]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        )),
      )}
      {/* tail */}
      <mesh ref={tail} position={[0, 0.22, -0.22]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.18]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  )
}
