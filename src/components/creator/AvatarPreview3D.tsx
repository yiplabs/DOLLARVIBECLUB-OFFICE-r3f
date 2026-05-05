'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows, OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { AvatarMesh } from '@/components/avatar/avatarLoader'
import type { AvatarConfig } from '@/lib/avatar/types'

function PreviewBody({ config }: { config: AvatarConfig }) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group | null>(null)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.4
  })
  return (
    <group ref={group}>
      <AvatarMesh config={config} state="idle" innerRef={inner} />
    </group>
  )
}

export function AvatarPreview3D({ config }: { config: AvatarConfig }) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <OrthographicCamera makeDefault position={[3, 3, 3]} zoom={120} />
        <ambientLight intensity={0.6} color="#FFF6E0" />
        <directionalLight
          intensity={1.4}
          color="#FFE5B0"
          position={[5, 8, 5]}
          castShadow
        />
        <Environment preset="apartment" />
        <PreviewBody config={config} />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={3}
          blur={2.4}
          far={2}
          color="#1a1a16"
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
