'use client'
import type { ThreeEvent } from '@react-three/fiber'
import type { RoomTheme } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'
import { useRoomStore } from '@/store/roomStore'
import { useEffect, useState } from 'react'

type FloorProps = {
  theme: RoomTheme
  onFloorClick: (e: ThreeEvent<MouseEvent>) => void
}

export function Floor({ theme, onFloorClick }: FloorProps) {
  const { gridWidth, gridDepth, floorBaseColor, rugs, platforms } = theme
  const click = useRoomStore((s) => s.clickHighlight)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!click) return
    const id = window.setInterval(() => setTick((t) => t + 1), 60)
    return () => window.clearInterval(id)
  }, [click])
  void tick

  return (
    <group>
      {/* Base floor */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[gridToWorld(gridWidth) / 2, 0, gridToWorld(gridDepth) / 2]}
        receiveShadow
        onClick={onFloorClick}
      >
        <planeGeometry args={[gridToWorld(gridWidth), gridToWorld(gridDepth)]} />
        <meshStandardMaterial color={floorBaseColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Rugs (slightly raised so they Z-sort clean) */}
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

      {/* Click highlight ring */}
      {click && Date.now() < click.expires && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[gridToWorld(click.x), 0.02, gridToWorld(click.z)]}
        >
          <ringGeometry args={[0.25, 0.45, 24]} />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  )
}
