'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  position: [number, number, number]
  color?: string
}

/**
 * Animated dramatic stage spotlight. Visualized as a downward-facing cone
 * (faked volumetric) plus a real spotLight that swings slowly.
 */
export function StageSpotlight({ position, color = '#FBBF24' }: Props) {
  const lightRef = useRef<THREE.SpotLight>(null)
  const coneRef = useRef<THREE.Mesh>(null)
  const targetRef = useRef<THREE.Object3D>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (lightRef.current && targetRef.current) {
      // Slow figure-8 sweep
      targetRef.current.position.x = Math.sin(t * 0.4) * 1.2
      targetRef.current.position.z = Math.sin(t * 0.4) * Math.cos(t * 0.4) * 0.8
      lightRef.current.target = targetRef.current
    }
    if (coneRef.current) {
      const m = coneRef.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.18 + Math.sin(t * 1.2) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Spotlight fixture */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.3, 12]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.6} />
      </mesh>

      {/* Volumetric cone */}
      <mesh
        ref={coneRef}
        position={[0, -2.4, 0]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[1.6, 4.5, 24, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* The actual spotlight */}
      <spotLight
        ref={lightRef}
        color={color}
        intensity={3.2}
        angle={Math.PI / 6}
        penumbra={0.4}
        distance={12}
        decay={1.5}
        castShadow
        position={[0, 0, 0]}
      />
      <object3D ref={targetRef} position={[0, -position[1], 0]} />
    </group>
  )
}
