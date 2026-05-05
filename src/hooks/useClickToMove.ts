'use client'
import { useCallback } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { findPath } from '@/lib/pathfinding'
import { worldToGrid, gridToWorld } from '@/lib/rooms/grid'
import { useAvatarStore } from '@/store/avatarStore'
import { useRoomStore, broadcastWalk } from '@/store/roomStore'

/**
 * Returns an onClick handler for the floor plane. Translates a click point
 * to a grid cell, A*-paths to it, and pushes the path into the avatar store +
 * broadcasts to peers.
 */
export function useClickToMove(mask: number[][]) {
  return useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      const point = e.point
      const tx = worldToGrid(point.x)
      const tz = worldToGrid(point.z)
      const cur = useAvatarStore.getState().pos
      const path = findPath(
        mask,
        [worldToGrid(cur[0]), worldToGrid(cur[1])],
        [tx, tz],
      )
      if (path.length === 0) return

      const worldPath = path.map(
        ([x, z]) => [gridToWorld(x), gridToWorld(z)] as [number, number],
      )
      useAvatarStore.setState({ path: worldPath })
      useRoomStore.getState().setClickHighlight({
        x: tx,
        z: tz,
        expires: Date.now() + 600,
      })
      broadcastWalk(worldPath)
    },
    [mask],
  )
}
