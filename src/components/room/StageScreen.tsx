'use client'
import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSettingsStore, getTimeOfDayPreset } from '@/store/settingsStore'

const NEXT_BUILDS = [
  { name: 'tiny saas in 7d', by: 'rita', color: '#0D9488' },
  { name: 'github roastbot', by: 'micah', color: '#FBBF24' },
  { name: 'one-prompt logos', by: 'nia', color: '#EC4899' },
]

type Props = {
  position: [number, number, number]
}

/**
 * Wall-mounted screen behind the stage. Shows time of day, scrolling lineup,
 * and a pulsing LIVE indicator. The screen face is a plane — content is a
 * transformed <Html> so the layout stays crisp.
 */
export function StageScreen({ position }: Props) {
  const tod = getTimeOfDayPreset(useSettingsStore((s) => s.timeOfDay))
  const [idx, setIdx] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const glowRef = useRef<THREE.MeshBasicMaterial>(null)

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setIdx((i) => (i + 1) % NEXT_BUILDS.length)
    }, 5000)
    const tick = window.setInterval(() => setNow(new Date()), 1000)
    return () => {
      window.clearInterval(cycle)
      window.clearInterval(tick)
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (glowRef.current) {
      glowRef.current.opacity = 0.55 + Math.sin(t * 1.5) * 0.1
    }
  })

  const upcoming = NEXT_BUILDS[idx]

  return (
    <group position={position}>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.6, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Screen face */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[4.0, 2.2]} />
        <meshBasicMaterial color="#0F1714" />
      </mesh>
      {/* Glow halo */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[4.2, 2.4]} />
        <meshBasicMaterial
          ref={glowRef}
          color={tod.sun}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      {/* HTML layered on top of the screen */}
      <Html
        center
        transform
        position={[0, 0, 0.12]}
        distanceFactor={6}
        occlude="blending"
        style={{ pointerEvents: 'none', width: '320px', height: '180px' }}
      >
        <div className="w-full h-full bg-dvc-section/95 border-2 border-dvc-border rounded-lg p-3 flex flex-col justify-between text-dvc-cream">
          <header className="flex items-center justify-between">
            <span className="font-ui font-black text-[10px] uppercase tracking-[0.2em] text-dvc-yellow">
              the stage · live
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-ui font-bold text-[10px] tabular-nums">
                {now.toUTCString().slice(17, 22)} utc
              </span>
            </span>
          </header>
          <div>
            <div className="font-ui font-bold text-[10px] uppercase tracking-wider text-dvc-cream/60">
              now
            </div>
            <div className="font-hand font-bold text-3xl leading-none mt-0.5">
              hunter live
            </div>
          </div>
          <div>
            <div className="font-ui font-bold text-[10px] uppercase tracking-wider text-dvc-cream/60">
              up next
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="w-3 h-3 rounded-sm border border-dvc-border"
                style={{ background: upcoming.color }}
              />
              <span className="font-body text-sm leading-tight">
                <span className="font-bold">{upcoming.name}</span>
                <span className="text-dvc-cream/60"> · {upcoming.by}</span>
              </span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
