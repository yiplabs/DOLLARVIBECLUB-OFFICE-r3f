import PF from 'pathfinding'

/**
 * A* over a {0,1} mask. Returns world-grid waypoints (inclusive of start? — qiao
 * returns [start, ..., end]; we strip start for cleaner movement consumption).
 *
 * mask[z][x] — 0 walkable, 1 blocked.
 */
export function findPath(
  mask: number[][],
  from: [number, number],
  to: [number, number],
): [number, number][] {
  if (!mask.length) return []
  const w = mask[0].length
  const d = mask.length
  if (to[0] < 0 || to[0] >= w || to[1] < 0 || to[1] >= d) return []
  if (mask[to[1]]?.[to[0]] === 1) return []

  const grid = new PF.Grid(w, d)
  for (let z = 0; z < d; z++) {
    for (let x = 0; x < w; x++) {
      if (mask[z][x] === 1) grid.setWalkableAt(x, z, false)
    }
  }
  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles,
  })

  // qiao mutates the grid — clone defensively even though we constructed it fresh.
  const path = finder.findPath(from[0], from[1], to[0], to[1], grid.clone())
  if (!path.length) return []
  const smoothed = PF.Util.smoothenPath(grid.clone(), path) as number[][]
  // Strip the start cell so the avatar doesn't snap back.
  return smoothed.slice(1) as [number, number][]
}
