'use client'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
  OrthographicCamera,
} from '@react-three/drei'
import { PrimitiveAvatar } from '@/components/avatar/PrimitiveAvatar'
import type { AvatarConfig } from '@/lib/avatar/types'

export function AvatarPreview3D({ config }: { config: AvatarConfig }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-dvc-card to-dvc-section">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }}>
        <OrthographicCamera makeDefault position={[3, 4, 5]} zoom={120} near={0.1} far={50} />
        <ambientLight intensity={0.6} color="#FFF6E0" />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          color="#FFE5B0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <PrimitiveAvatar config={config} position={[0, 0, 0]} showName={false} />

        <mesh rotation-x={-Math.PI / 2} receiveShadow position-y={0}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#E8E2D0" />
        </mesh>

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.5}
          scale={4}
          blur={2.4}
          far={4}
          resolution={512}
          color="#1a0f0a"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          target={[0, 0.7, 0]}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
