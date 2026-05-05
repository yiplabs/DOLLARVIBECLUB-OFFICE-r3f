'use client'
import { useMemo } from 'react'
import type { RoomTheme, WallSegment, StickyCluster } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'

const WALL_HEIGHT = 3
const WALL_THICKNESS = 0.15

function WallBox({
  seg,
  color,
}: {
  seg: WallSegment
  color: string
}) {
  const len = useMemo(() => {
    const dx = seg.to[0] - seg.from[0]
    const dz = seg.to[1] - seg.from[1]
    return Math.hypot(dx, dz)
  }, [seg])
  const angle = useMemo(() => {
    const dx = seg.to[0] - seg.from[0]
    const dz = seg.to[1] - seg.from[1]
    return Math.atan2(dz, dx)
  }, [seg])
  const cx = (seg.from[0] + seg.to[0]) / 2
  const cz = (seg.from[1] + seg.to[1]) / 2
  const h = (seg.height ?? 1) * WALL_HEIGHT

  // Doorway: render two segments leaving a gap. Window: full segment, no gap.
  if (seg.opening?.kind === 'door' && len > 0) {
    const doorWidth = seg.opening.width * len
    const halfDoor = doorWidth / 2
    const lenA = seg.opening.at * len - halfDoor
    const lenB = len - (seg.opening.at * len + halfDoor)
    const aCenter = -len / 2 + lenA / 2
    const bCenter = len / 2 - lenB / 2
    return (
      <group position={[gridToWorld(cx), h / 2, gridToWorld(cz)]} rotation-y={-angle}>
        <mesh position={[aCenter, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[Math.max(0.01, lenA), h, WALL_THICKNESS]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[bCenter, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[Math.max(0.01, lenB), h, WALL_THICKNESS]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[gridToWorld(cx), h / 2, gridToWorld(cz)]} rotation-y={-angle}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[Math.max(0.01, len), h, WALL_THICKNESS]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  )
}

function StickyNotes({ cluster, theme }: { cluster: StickyCluster; theme: RoomTheme }) {
  const notes = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number; color: string; size: number }[] = []
    const wallY = WALL_HEIGHT * 0.6
    const wallSpread = (cluster.wall === 'north' || cluster.wall === 'south'
      ? theme.gridWidth
      : theme.gridDepth) - 2
    for (let i = 0; i < cluster.count; i++) {
      const t = (i + 0.5) / cluster.count
      const along = (t - 0.5) * wallSpread
      const yJitter = (Math.sin(i * 1.91) * 0.5 + Math.cos(i * 0.7) * 0.4) * 0.8
      const rot = (Math.sin(i * 3.2) * 0.14)
      const color = cluster.colors[i % cluster.colors.length]
      const size = 0.32 + (i % 3) * 0.08
      let pos: [number, number, number]
      if (cluster.wall === 'north') pos = [gridToWorld(theme.gridWidth) / 2 + along, wallY + yJitter, 0.1]
      else if (cluster.wall === 'south') pos = [gridToWorld(theme.gridWidth) / 2 + along, wallY + yJitter, gridToWorld(theme.gridDepth) - 0.1]
      else if (cluster.wall === 'east') pos = [gridToWorld(theme.gridWidth) - 0.1, wallY + yJitter, gridToWorld(theme.gridDepth) / 2 + along]
      else pos = [0.1, wallY + yJitter, gridToWorld(theme.gridDepth) / 2 + along]
      arr.push({ pos, rot, color, size })
    }
    return arr
  }, [cluster, theme])

  const rotY =
    cluster.wall === 'north' ? 0 :
    cluster.wall === 'south' ? Math.PI :
    cluster.wall === 'east' ? -Math.PI / 2 : Math.PI / 2

  return (
    <group>
      {notes.map((n, i) => (
        <mesh key={i} position={n.pos} rotation={[0, rotY, n.rot]}>
          <planeGeometry args={[n.size, n.size]} />
          <meshStandardMaterial color={n.color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export function Walls({ theme }: { theme: RoomTheme }) {
  return (
    <group>
      {theme.walls.map((seg, i) => (
        <WallBox key={`wall-${i}`} seg={seg} color={theme.wallColor} />
      ))}
      {theme.stickies?.map((c, i) => (
        <StickyNotes key={`sticky-${i}`} cluster={c} theme={theme} />
      ))}
    </group>
  )
}
