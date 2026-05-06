'use client'
import { Html } from '@react-three/drei'
import { gridToWorld } from '@/lib/rooms/grid'

const PROJECTS = [
  { title: 'pomodoros for cli', stack: 'go · bash', stage: 'shipping' },
  { title: 'tiny budget tracker', stack: 'next · drizzle', stage: 'beta' },
  { title: 'lofi.cafe clone', stack: 'tone.js', stage: 'idea' },
  { title: 'rubber duck mcp', stack: 'claude-sdk', stage: 'shipping' },
  { title: 'one-prompt logos', stack: 'sdxl', stage: 'beta' },
  { title: 'meeting transcriber', stack: 'whisper', stage: 'idea' },
]

const STAGE_COLORS: Record<string, string> = {
  shipping: '#0D9488',
  beta: '#FBBF24',
  idea: '#EC4899',
}

type Props = {
  position: [number, number]
  wall: 'north' | 'south' | 'east' | 'west'
  gridWidth: number
  gridDepth: number
}

/**
 * "What we're shipping" wall board — a corkboard of project cards.
 * Used in the Lounge.
 */
export function ProjectBoard({ position, wall, gridWidth, gridDepth }: Props) {
  let pos: [number, number, number] = [0, 0, 0]
  let rotY = 0
  const width = 4
  const height = 2.4

  switch (wall) {
    case 'north':
      pos = [gridToWorld(position[0]), 1.5, 0.16]
      break
    case 'south':
      pos = [gridToWorld(position[0]), 1.5, gridToWorld(gridDepth) - 0.16]
      rotY = Math.PI
      break
    case 'east':
      pos = [gridToWorld(gridWidth) - 0.16, 1.5, gridToWorld(position[1])]
      rotY = -Math.PI / 2
      break
    case 'west':
      pos = [0.16, 1.5, gridToWorld(position[1])]
      rotY = Math.PI / 2
      break
  }

  return (
    <group position={pos} rotation-y={rotY}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#B8895A" roughness={0.85} />
      </mesh>
      <mesh position={[0, height / 2 + 0.18, 0.05]}>
        <planeGeometry args={[width * 0.5, 0.3]} />
        <meshBasicMaterial color="#FAF9F5" transparent opacity={0} />
      </mesh>
      <Html
        position={[0, height / 2 + 0.32, 0.05]}
        center
        distanceFactor={8}
        transform
        style={{ pointerEvents: 'none' }}
      >
        <div className="font-hand font-bold text-3xl text-dvc-cream whitespace-nowrap"
             style={{ textShadow: '2px 2px 0 #2D2D2D' }}>
          shipping right now
        </div>
      </Html>
      <Html
        center
        distanceFactor={6}
        position={[0, 0, 0.04]}
        transform
        occlude="blending"
        style={{ pointerEvents: 'none', width: `${width * 80}px`, height: `${height * 80}px` }}
      >
        <div className="relative w-full h-full">
          {PROJECTS.map((p, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            const x = col * 33 + 4
            const y = row * 48 + 4
            const rot = (i % 2 === 0 ? -1 : 1) * (1 + (i % 3))
            const stageColor = STAGE_COLORS[p.stage]
            return (
              <div
                key={i}
                className="absolute bg-dvc-card text-dvc-cream border-2 border-dvc-border rounded-md p-2 select-none"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: '30%',
                  height: '44%',
                  transform: `rotate(${rot}deg)`,
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.25)',
                }}
              >
                <div
                  className="inline-block px-1.5 py-0.5 rounded font-ui font-bold text-[9px] uppercase tracking-wider border border-dvc-border"
                  style={{ background: stageColor, color: '#141412' }}
                >
                  {p.stage}
                </div>
                <div className="font-hand font-bold text-base mt-1 leading-tight">
                  {p.title}
                </div>
                <div className="font-ui font-bold text-[10px] text-dvc-yellow mt-0.5">
                  {p.stack}
                </div>
              </div>
            )
          })}
        </div>
      </Html>
    </group>
  )
}
