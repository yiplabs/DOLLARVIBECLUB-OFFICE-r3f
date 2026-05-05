'use client'
import { useEffect } from 'react'
import { useDetectGPU } from '@react-three/drei'
import { useQualityStore } from '@/store/qualityStore'

/**
 * Auto-tunes quality tier on mount based on the GPU.
 * - Mobile or tier 0/1 → 'low'
 * - tier 2 → 'medium'
 * - tier 3 → 'high'
 */
export function useDeviceQuality() {
  const gpu = useDetectGPU()
  const setTier = useQualityStore((s) => s.setTier)

  useEffect(() => {
    if (!gpu) return
    if (gpu.isMobile || gpu.tier <= 1) setTier('low')
    else if (gpu.tier === 2) setTier('medium')
    else setTier('high')
  }, [gpu, setTier])

  return gpu
}
