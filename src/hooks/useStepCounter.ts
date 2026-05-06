'use client'
import { useEffect, useRef, useState } from 'react'
import { useAvatarStore } from '@/store/avatarStore'

/**
 * Counts how far the local avatar has walked this session, in grid cells.
 * One "step" = sqrt(2) world units of motion (a diagonal grid hop).
 */
export function useStepCounter() {
  const [steps, setSteps] = useState(0)
  const lastPos = useRef<[number, number] | null>(null)
  const distAcc = useRef(0)

  useEffect(() => {
    return useAvatarStore.subscribe((state) => {
      const cur = state.pos
      if (!lastPos.current) {
        lastPos.current = cur
        return
      }
      const dx = cur[0] - lastPos.current[0]
      const dz = cur[1] - lastPos.current[1]
      const d = Math.hypot(dx, dz)
      if (d > 0.01) {
        distAcc.current += d
        // every full grid unit ≈ one step
        const newSteps = Math.floor(distAcc.current)
        if (newSteps > 0) {
          distAcc.current -= newSteps
          setSteps((s) => s + newSteps)
        }
        lastPos.current = cur
      }
    })
  }, [])

  return steps
}
