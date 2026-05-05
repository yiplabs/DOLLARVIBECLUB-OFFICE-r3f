import type { RoomTheme } from './themes'

export const TILE_SIZE = 1

export const worldToGrid = (x: number) => Math.round(x / TILE_SIZE)
export const gridToWorld = (gx: number) => gx * TILE_SIZE

/**
 * Builds a walkable mask for A* pathfinding.
 * 0 = walkable, 1 = blocked.
 *
 * Walls are full-height segments only (height undefined or >= 1). Waist-high partitions
 * (height < 1) are kept walkable so avatars can step around them visually but pathing
 * doesn't fight low partitions.
 */
export function buildWalkableMask(theme: RoomTheme): number[][] {
  const { gridWidth, gridDepth } = theme
  const mask: number[][] = Array.from({ length: gridDepth }, () =>
    Array(gridWidth).fill(0),
  )

  for (const seg of theme.walls) {
    if (seg.height !== undefined && seg.height < 1) continue
    const cells = bresenham(seg.from[0], seg.from[1], seg.to[0], seg.to[1])
    const total = cells.length
    let opening: { startIdx: number; endIdx: number } | null = null
    if (seg.opening && total > 1) {
      const center = Math.round(seg.opening.at * (total - 1))
      const half = Math.max(1, Math.round((seg.opening.width * total) / 2))
      opening = {
        startIdx: Math.max(0, center - half),
        endIdx: Math.min(total - 1, center + half),
      }
    }
    cells.forEach(([x, z], idx) => {
      if (opening && idx >= opening.startIdx && idx <= opening.endIdx) return
      if (z >= 0 && z < gridDepth && x >= 0 && x < gridWidth) mask[z][x] = 1
    })
  }

  for (const f of theme.furniture) {
    const [gx, gz] = f.position
    if (gz >= 0 && gz < gridDepth && gx >= 0 && gx < gridWidth) mask[gz][gx] = 1
  }

  return mask
}

function bresenham(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const out: [number, number][] = []
  let cx = x0
  let cy = y0
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  while (true) {
    out.push([cx, cy])
    if (cx === x1 && cy === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      cx += sx
    }
    if (e2 < dx) {
      err += dx
      cy += sy
    }
  }
  return out
}
