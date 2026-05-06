'use client'
import { useEffect, useRef } from 'react'
import { THEMES } from '@/lib/rooms/themes'
import { buildWalkableMask } from '@/lib/rooms/grid'
import { getRoom } from '@/lib/rooms/catalog'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore } from '@/store/roomStore'

type Props = { slug: string }

const SIZE = 160 // px

export function Minimap({ slug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const meta = getRoom(slug)
  const theme = meta ? THEMES[meta.theme] : THEMES.lounge
  const pos = useAvatarStore((s) => s.pos)
  const peers = useRoomStore((s) => s.peers)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellSize = SIZE / theme.gridWidth
    ctx.imageSmoothingEnabled = false

    // Background
    ctx.fillStyle = theme.floorBaseColor
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Walls
    const mask = buildWalkableMask(theme)
    ctx.fillStyle = theme.wallColor
    for (let z = 0; z < theme.gridDepth; z++) {
      for (let x = 0; x < theme.gridWidth; x++) {
        if (mask[z][x] === 1) {
          ctx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize)
        }
      }
    }

    // Rugs
    for (const rug of theme.rugs) {
      ctx.fillStyle = rug.color
      ctx.globalAlpha = 0.5
      const w = rug.size[0] * cellSize
      const h = rug.size[1] * cellSize
      ctx.fillRect(
        rug.position[0] * cellSize - w / 2,
        rug.position[1] * cellSize - h / 2,
        w,
        h,
      )
      ctx.globalAlpha = 1
    }

    // Peers
    ctx.fillStyle = '#94A3B8'
    for (const p of Object.values(peers)) {
      ctx.beginPath()
      ctx.arc(
        p.pos[0] * cellSize,
        p.pos[1] * cellSize,
        cellSize * 0.45,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }

    // You
    ctx.fillStyle = '#FBBF24'
    ctx.strokeStyle = '#2D2D2D'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(pos[0] * cellSize, pos[1] * cellSize, cellSize * 0.55, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }, [theme, pos, peers])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="rounded-md border-2 border-dvc-border shadow-brutSm bg-dvc-card"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-dvc-card/90 border border-dvc-border rounded text-[10px] font-ui font-bold uppercase tracking-wider text-dvc-yellow">
        map · {meta?.slug}
      </div>
    </div>
  )
}
