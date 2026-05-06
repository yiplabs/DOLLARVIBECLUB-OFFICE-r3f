'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { RoomTheme } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'
import { useRoomStore } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'

type FloorProps = {
  theme: RoomTheme
  onFloorClick: (e: ThreeEvent<MouseEvent>) => void
}

/** Click-to-move ring — pulses for 600ms then unmounts itself. */
function ClickHighlight() {
  const ref = useRef<THREE.Mesh>(null)
  const click = useRoomStore((s) => s.clickHighlight)
  const [, force] = useState(0)

  useFrame(() => {
    if (!click) return
    const remaining = (click.expires - Date.now()) / 600
    if (remaining <= 0) {
      force((n) => n + 1)
      return
    }
    if (!ref.current) return
    const pulse = 0.5 + (1 - remaining) * 0.4
    ref.current.scale.setScalar(pulse)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, remaining * 0.9)
  })

  if (!click || Date.now() > click.expires) return null
  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[gridToWorld(click.x), 0.02, gridToWorld(click.z)]}
    >
      <ringGeometry args={[0.28, 0.5, 28]} />
      <meshBasicMaterial color="#FBBF24" transparent opacity={0.85} />
    </mesh>
  )
}

/** Dotted preview of the avatar's pending walk path. */
function WalkPreview() {
  const path = useAvatarStore((s) => s.path)
  if (!path.length) return null
  return (
    <group>
      {path.map(([x, z], i) => (
        <mesh
          key={i}
          rotation-x={-Math.PI / 2}
          position={[gridToWorld(x), 0.015, gridToWorld(z)]}
        >
          <circleGeometry args={[0.08, 12]} />
          <meshBasicMaterial
            color="#FBBF24"
            transparent
            opacity={Math.max(0.2, 0.85 - i * 0.08)}
          />
        </mesh>
      ))}
    </group>
  )
}

export function Floor({ theme, onFloorClick }: FloorProps) {
  const { gridWidth, gridDepth, floorBaseColor, rugs, platforms } = theme
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null)

  return (
    <group>
      {/* Base floor — single click + hover receiver */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[gridToWorld(gridWidth) / 2, 0, gridToWorld(gridDepth) / 2]}
        receiveShadow
        onClick={onFloorClick}
        onPointerMove={(e) => {
          const cx = Math.round(e.point.x)
          const cz = Math.round(e.point.z)
          if (!hoverCell || hoverCell[0] !== cx || hoverCell[1] !== cz) {
            setHoverCell([cx, cz])
          }
        }}
        onPointerOut={() => setHoverCell(null)}
      >
        <planeGeometry args={[gridToWorld(gridWidth), gridToWorld(gridDepth)]} />
        <meshStandardMaterial color={floorBaseColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Rugs */}
      {rugs.map((rug, i) => (
        <mesh
          key={`rug-${i}`}
          rotation-x={-Math.PI / 2}
          position={[gridToWorld(rug.position[0]), 0.01, gridToWorld(rug.position[1])]}
          receiveShadow
        >
          {rug.shape === 'round' ? (
            <circleGeometry args={[Math.max(rug.size[0], rug.size[1]) / 2, 32]} />
          ) : (
            <planeGeometry args={[rug.size[0], rug.size[1]]} />
          )}
          <meshStandardMaterial color={rug.color} roughness={0.85} />
        </mesh>
      ))}

      {/* Stage platforms */}
      {platforms?.map((p, i) => (
        <mesh
          key={`platform-${i}`}
          position={[
            gridToWorld(p.position[0]),
            (p.height ?? 0.3) / 2,
            gridToWorld(p.position[1]),
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[p.size[0], p.height ?? 0.3, p.size[1]]} />
          <meshStandardMaterial color={p.color} roughness={0.7} />
        </mesh>
      ))}

      {/* Hover dot under cursor */}
      {hoverCell && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[gridToWorld(hoverCell[0]), 0.012, gridToWorld(hoverCell[1])]}
        >
          <ringGeometry args={[0.18, 0.32, 20]} />
          <meshBasicMaterial color="#F0EAD8" transparent opacity={0.35} />
        </mesh>
      )}

      <WalkPreview />
      <ClickHighlight />
    </group>
  )
}
