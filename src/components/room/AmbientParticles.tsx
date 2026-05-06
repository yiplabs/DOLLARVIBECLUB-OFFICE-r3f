'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  /** number of dust motes — keep under 200 for perf */
  count?: number
  bounds?: { x: [number, number]; y: [number, number]; z: [number, number] }
  color?: string
}

/**
 * Cozy floating dust motes — Points cloud animated each frame.
 * One bounded box per room, rendered as additive billboarded points.
 */
export function AmbientParticles({
  count = 80,
  bounds = { x: [0, 14], y: [0.5, 4], z: [0, 14] },
  color = '#FFE5B0',
}: Props) {
  const ref = useRef<THREE.Points>(null)

  // Generate stable initial positions + velocities once.
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] =
        bounds.x[0] + Math.random() * (bounds.x[1] - bounds.x[0])
      positions[i * 3 + 1] =
        bounds.y[0] + Math.random() * (bounds.y[1] - bounds.y[0])
      positions[i * 3 + 2] =
        bounds.z[0] + Math.random() * (bounds.z[1] - bounds.z[0])
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.04
      velocities[i * 3 + 1] = Math.random() * 0.05 + 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04
    }
    return { positions, velocities }
  }, [count, bounds])

  useFrame((_, dt) => {
    const points = ref.current
    if (!points) return
    const attr = points.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] += velocities[i * 3 + 0] * dt
      arr[i * 3 + 1] += velocities[i * 3 + 1] * dt
      arr[i * 3 + 2] += velocities[i * 3 + 2] * dt

      // Wrap around bounds
      if (arr[i * 3 + 1] > bounds.y[1]) arr[i * 3 + 1] = bounds.y[0]
      if (arr[i * 3 + 0] > bounds.x[1]) arr[i * 3 + 0] = bounds.x[0]
      if (arr[i * 3 + 0] < bounds.x[0]) arr[i * 3 + 0] = bounds.x[1]
      if (arr[i * 3 + 2] > bounds.z[1]) arr[i * 3 + 2] = bounds.z[0]
      if (arr[i * 3 + 2] < bounds.z[0]) arr[i * 3 + 2] = bounds.z[1]
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
