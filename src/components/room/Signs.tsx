'use client'
import { Html } from '@react-three/drei'
import type { RoomTheme, WallSign } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'

const FONT_CLASS: Record<NonNullable<WallSign['font']>, string> = {
  caveat: 'font-hand',
  sora: 'font-body',
  epilogue: 'font-display',
}

function signWorldPosition(
  sign: WallSign,
  theme: RoomTheme,
): [number, number, number] {
  const ww = gridToWorld(theme.gridWidth)
  const wd = gridToWorld(theme.gridDepth)
  const y = 2.4
  switch (sign.wall) {
    case 'north':
      return [sign.position * ww, y, 0.05]
    case 'south':
      return [sign.position * ww, y, wd - 0.05]
    case 'east':
      return [ww - 0.05, y, sign.position * wd]
    case 'west':
      return [0.05, y, sign.position * wd]
  }
}

function signRotation(wall: WallSign['wall']): [number, number, number] {
  switch (wall) {
    case 'north':
      return [0, 0, 0]
    case 'south':
      return [0, Math.PI, 0]
    case 'east':
      return [0, -Math.PI / 2, 0]
    case 'west':
      return [0, Math.PI / 2, 0]
  }
}

export function Signs({ theme }: { theme: RoomTheme }) {
  return (
    <group>
      {theme.signs.map((sign, i) => (
        <group
          key={`sign-${i}`}
          position={signWorldPosition(sign, theme)}
          rotation={signRotation(sign.wall)}
        >
          <Html
            center
            distanceFactor={8}
            transform
            occlude="blending"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`${FONT_CLASS[sign.font ?? 'caveat']} font-bold whitespace-nowrap select-none`}
              style={{
                fontSize: `${(sign.size ?? 0.5) * 80}px`,
                color: sign.color ?? '#0D9488',
                textShadow: '2px 2px 0 #2D2D2D',
                letterSpacing: '0.02em',
              }}
            >
              {sign.text}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}
