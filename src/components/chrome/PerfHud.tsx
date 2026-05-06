'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight FPS / frame-time HUD. Sampled via requestAnimationFrame so it
 * only costs a frame counter — no canvas reads, no GL state inspection.
 */
export function PerfHud({ visible }: { visible: boolean }) {
  const [fps, setFps] = useState(0)
  const [ms, setMs] = useState(0)
  const [memMB, setMemMB] = useState<number | null>(null)
  const frames = useRef(0)
  const last = useRef(performance.now())
  const lastFrame = useRef(performance.now())

  useEffect(() => {
    if (!visible) return
    let raf = 0

    const tick = () => {
      const now = performance.now()
      frames.current++
      const dt = now - lastFrame.current
      lastFrame.current = now
      setMs((prev) => prev * 0.85 + dt * 0.15)

      if (now - last.current > 1000) {
        setFps(Math.round((frames.current * 1000) / (now - last.current)))
        frames.current = 0
        last.current = now

        const perf = performance as Performance & {
          memory?: { usedJSHeapSize: number }
        }
        if (perf.memory?.usedJSHeapSize) {
          setMemMB(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)))
        }
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [visible])

  if (!visible) return null

  const fpsColor =
    fps >= 55 ? 'text-dvc-online' : fps >= 30 ? 'text-dvc-yellow' : 'text-rose-400'

  return (
    <div className="fixed top-20 left-4 z-30 bg-dvc-card/85 backdrop-blur-md border-2 border-dvc-border rounded-md px-3 py-2 shadow-brutSm font-ui font-bold text-xs space-y-1 select-none">
      <div className="flex items-center gap-2">
        <span className="text-dvc-cream/70">fps</span>
        <span className={`tabular-nums font-black ${fpsColor}`}>{fps}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-dvc-cream/70">ms</span>
        <span className="tabular-nums text-dvc-cream">{ms.toFixed(1)}</span>
      </div>
      {memMB !== null && (
        <div className="flex items-center gap-2">
          <span className="text-dvc-cream/70">heap</span>
          <span className="tabular-nums text-dvc-cream">{memMB}mb</span>
        </div>
      )}
    </div>
  )
}
