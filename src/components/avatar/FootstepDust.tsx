'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'

const MAX_PUFFS = 24
const PUFF_LIFE_MS = 700

type Puff = {
  x: number
  z: number
  bornAt: number
  size: number
}

/**
 * Spawns a small expanding-and-fading dust puff each time the avatar crosses
 * a grid cell while walking. Renders the active puffs as instanced quads on
 * the floor — a single bufferGeometry / shaderless implementation.
 */
export function FootstepDust() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const puffs = useRef<Puff[]>([])
  const lastCell = useRef<[number, number] | null>(null)
  const tmp = useRef(new THREE.Object3D())

  useEffect(() => {
    return useAvatarStore.subscribe((state) => {
      const cell: [number, number] = [
        Math.round(state.pos[0]),
        Math.round(state.pos[1]),
      ]
      const last = lastCell.current
      if (!last || last[0] !== cell[0] || last[1] !== cell[1]) {
        lastCell.current = cell
        if (state.path.length > 0) {
          puffs.current.push({
            x: state.pos[0],
            z: state.pos[1],
            bornAt: Date.now(),
            size: 0.18 + Math.random() * 0.06,
          })
          if (puffs.current.length > MAX_PUFFS) {
            puffs.current.shift()
          }
        }
      }
    })
  }, [])

  useFrame(() => {
    const inst = ref.current
    if (!inst) return

    const now = Date.now()
    // Drop expired puffs
    while (puffs.current.length && now - puffs.current[0].bornAt > PUFF_LIFE_MS) {
      puffs.current.shift()
    }

    inst.count = puffs.current.length
    if (inst.count === 0) {
      inst.instanceMatrix.needsUpdate = true
      return
    }

    for (let i = 0; i < puffs.current.length; i++) {
      const p = puffs.current[i]
      const age = (now - p.bornAt) / PUFF_LIFE_MS
      const grow = 1 + age * 1.4
      tmp.current.position.set(p.x, 0.02 + age * 0.18, p.z)
      tmp.current.rotation.set(-Math.PI / 2, 0, age * 1.2)
      tmp.current.scale.setScalar(p.size * grow)
      tmp.current.updateMatrix()
      inst.setMatrixAt(i, tmp.current.matrix)

      // Set opacity per-instance via instanceColor (we cheat: alpha-style fade
      // via material opacity isn't per-instance, so we modulate scale instead
      // and let the additive material naturally fade as it spreads).
    }
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MAX_PUFFS]}>
      <ringGeometry args={[0.05, 0.18, 12]} />
      <meshBasicMaterial
        color="#FFE5B0"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
