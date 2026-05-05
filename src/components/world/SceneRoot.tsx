'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  AdaptiveDpr,
  AdaptiveEvents,
  OrthographicCamera,
} from '@react-three/drei'

type Props = {
  children: React.ReactNode
  cameraZoom?: number
  cameraPosition?: [number, number, number]
}

/**
 * Root <Canvas> wrapper for any 3D scene. Always rendered via dynamic({ ssr: false })
 * to keep r3f off the SSR path.
 */
export default function SceneRoot({
  children,
  cameraZoom = 48,
  cameraPosition = [20, 20, 20],
}: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <OrthographicCamera
        makeDefault
        position={cameraPosition}
        zoom={cameraZoom}
        near={0.1}
        far={200}
      />
      <Suspense fallback={null}>{children}</Suspense>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
