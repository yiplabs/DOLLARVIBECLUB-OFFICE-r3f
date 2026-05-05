'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarConfig } from '@/lib/avatar/types'

type Props = {
  config: AvatarConfig
  position?: [number, number, number]
  showName?: boolean
  isWalking?: boolean
}

/**
 * 100% reliable Three.js primitive avatar — no fetches, no GLBs.
 * Must render inside a <Canvas> (the <Html> name label requires it).
 */
export function PrimitiveAvatar({
  config,
  position = [0, 0, 0],
  showName = true,
  isWalking = false,
}: Props) {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (isWalking) {
      group.current.position.y = position[1] + Math.abs(Math.sin(t * 8)) * 0.08
      if (body.current) body.current.rotation.z = Math.sin(t * 8) * 0.05
    } else {
      group.current.position.y = position[1] + Math.sin(t * 2) * 0.02
      if (body.current) body.current.rotation.z = 0
    }
  })

  return (
    <group ref={group} position={position}>
      {/* soft ground blob */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01} receiveShadow>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.25} transparent />
      </mesh>

      {/* legs */}
      <mesh position={[-0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.15]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.15]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>

      {/* shoes */}
      <mesh position={[-0.1, 0.03, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.22]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.22]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>

      {/* torso */}
      <mesh ref={body} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshStandardMaterial color={config.topTint} />
      </mesh>

      {/* arms */}
      <mesh position={[-0.27, 0.75, 0]} castShadow>
        <boxGeometry args={[0.12, 0.45, 0.18]} />
        <meshStandardMaterial color={config.topTint} />
      </mesh>
      <mesh position={[0.27, 0.75, 0]} castShadow>
        <boxGeometry args={[0.12, 0.45, 0.18]} />
        <meshStandardMaterial color={config.topTint} />
      </mesh>

      {/* head */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={config.bodyTint} />
      </mesh>

      {/* hair cap */}
      <mesh position={[0, 1.28, -0.02]} castShadow>
        <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={config.hairTint} />
      </mesh>

      {showName && (
        <Html
          position={[0, 1.65, 0]}
          center
          distanceFactor={10}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="bg-dvc-card border-2 border-dvc-border rounded-md px-2 py-0.5 font-ui font-bold text-xs text-dvc-cream whitespace-nowrap"
            style={{ boxShadow: '2px 2px 0 #2D2D2D' }}
          >
            {config.displayName}
          </div>
        </Html>
      )}
    </group>
  )
}
