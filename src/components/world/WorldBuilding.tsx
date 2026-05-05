'use client'
import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { RoomMeta } from '@/lib/rooms/catalog'

const SHAPE_DIMS: Record<RoomMeta['buildingShape'], [number, number, number]> = {
  small: [3, 2.4, 3],
  medium: [4, 3.0, 4],
  large: [5, 3.4, 5],
  tall: [3, 5, 3],
}

type Props = {
  room: RoomMeta
  occupants: number
  onClick: () => void
}

export function WorldBuilding({ room, occupants, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const [w, h, d] = SHAPE_DIMS[room.buildingShape]
  const lift = hovered ? 0.5 : 0

  return (
    <group
      position={[room.buildingPos[0], lift, room.buildingPos[1]]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Walls */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#F0EAD8" roughness={0.85} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, h + 0.3, 0]} castShadow>
        <boxGeometry args={[w + 0.2, 0.6, d + 0.2]} />
        <meshStandardMaterial color={room.accent} roughness={0.6} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.7, d / 2 + 0.01]}>
        <planeGeometry args={[0.9, 1.4]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      {/* Front sign */}
      <Html
        position={[0, h + 0.9, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div className="font-hand font-bold text-2xl whitespace-nowrap text-dvc-cream"
             style={{ textShadow: '2px 2px 0 #2D2D2D' }}>
          {room.name}
        </div>
      </Html>
      {/* Occupant pill */}
      <Html
        position={[0, h + 1.6, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-dvc-card border-2 border-dvc-border shadow-brutSm rounded-md px-2 py-0.5 font-ui font-bold text-xs text-dvc-cream whitespace-nowrap">
          {occupants} ✦
        </div>
      </Html>

      {/* Hover info card */}
      {hovered && (
        <Html
          position={[w / 2 + 0.3, h, 0]}
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-dvc-card/95 backdrop-blur-md border-2 border-dvc-border shadow-brutCard rounded-xl p-3 w-56">
            <div className="font-hand font-bold text-2xl text-dvc-cream leading-tight">
              {room.name}
            </div>
            <div className="font-ui text-xs text-dvc-muted mt-1">{room.tagline}</div>
            <div className="font-body text-xs text-dvc-cream/80 mt-2 leading-snug">
              {room.description}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-wider text-dvc-yellow font-ui font-bold">
              click to enter →
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
