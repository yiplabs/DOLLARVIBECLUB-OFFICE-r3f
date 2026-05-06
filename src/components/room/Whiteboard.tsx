'use client'
import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import { gridToWorld } from '@/lib/rooms/grid'

type Note = { text: string; color: string; rot: number }

const SEED_NOTES: Note[] = [
  { text: 'tiny saas in 7 days?', color: '#FBBF24', rot: -3 },
  { text: 'voice notes app for devs', color: '#EC4899', rot: 4 },
  { text: 'github roastbot', color: '#22C55E', rot: -2 },
  { text: 'side project insurance', color: '#3B82F6', rot: 5 },
  { text: 'lo-fi for terminals', color: '#FBBF24', rot: 1 },
  { text: 'one-prompt logo gen', color: '#F97316', rot: -4 },
  { text: 'time tracker that\nlooks like notion', color: '#EC4899', rot: 3 },
  { text: 'AI rubber duck', color: '#22C55E', rot: -1 },
  { text: 'a better readme', color: '#FBBF24', rot: 2 },
]

type Props = {
  /** Grid position of the whiteboard's center (z = wall depth). */
  position: [number, number]
  /** Which wall it's mounted on. */
  wall: 'north' | 'south' | 'east' | 'west'
  width?: number
  height?: number
  gridDepth: number
  gridWidth: number
}

/**
 * Brainstorm-room whiteboard — a wall-mounted plane with sticky-note <Html>
 * children rotated and scattered across it. Read-only for v0.
 */
export function Whiteboard({
  position,
  wall,
  width = 5,
  height = 2.6,
  gridDepth,
  gridWidth,
}: Props) {
  const notes = useMemo(() => SEED_NOTES, [])

  let pos: [number, number, number] = [0, 0, 0]
  let rotY = 0

  switch (wall) {
    case 'north':
      pos = [gridToWorld(position[0]), 1.5, 0.18]
      rotY = 0
      break
    case 'south':
      pos = [gridToWorld(position[0]), 1.5, gridToWorld(gridDepth) - 0.18]
      rotY = Math.PI
      break
    case 'east':
      pos = [gridToWorld(gridWidth) - 0.18, 1.5, gridToWorld(position[1])]
      rotY = -Math.PI / 2
      break
    case 'west':
      pos = [0.18, 1.5, gridToWorld(position[1])]
      rotY = Math.PI / 2
      break
  }

  return (
    <group position={pos} rotation-y={rotY}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color="#FAF9F5" roughness={0.65} />
      </mesh>
      {/* Frame */}
      {[
        [0, height / 2 - 0.08, 0.03],
        [0, -height / 2 + 0.08, 0.03],
      ].map((p, i) => (
        <mesh key={`hframe-${i}`} position={p as [number, number, number]}>
          <boxGeometry args={[width + 0.05, 0.05, 0.06]} />
          <meshStandardMaterial color="#8B6440" roughness={0.7} />
        </mesh>
      ))}
      {[
        [width / 2 - 0.08, 0, 0.03],
        [-width / 2 + 0.08, 0, 0.03],
      ].map((p, i) => (
        <mesh key={`vframe-${i}`} position={p as [number, number, number]}>
          <boxGeometry args={[0.05, height + 0.05, 0.06]} />
          <meshStandardMaterial color="#8B6440" roughness={0.7} />
        </mesh>
      ))}

      <Html
        center
        distanceFactor={6}
        position={[0, 0, 0.05]}
        transform
        occlude="blending"
        style={{ pointerEvents: 'none', width: `${width * 80}px`, height: `${height * 80}px` }}
      >
        <div className="relative w-full h-full">
          {notes.map((n, i) => {
            const x = (i % 3) * 33 + 6
            const y = Math.floor(i / 3) * 32 + 6
            return (
              <div
                key={i}
                className="absolute font-hand font-bold text-sm text-dvc-border whitespace-pre-line p-1.5 select-none"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: '28%',
                  height: '28%',
                  background: n.color,
                  transform: `rotate(${n.rot}deg)`,
                  boxShadow: '2px 3px 0 rgba(0,0,0,0.18)',
                  borderRadius: '4px',
                }}
              >
                {n.text}
              </div>
            )
          })}
        </div>
      </Html>
    </group>
  )
}
