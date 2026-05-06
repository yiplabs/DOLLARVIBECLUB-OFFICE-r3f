'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
  OrthographicCamera,
} from '@react-three/drei'
import { PrimitiveAvatar } from '@/components/avatar/PrimitiveAvatar'
import type { AvatarConfig } from '@/lib/avatar/types'

const HERO_AVATAR: AvatarConfig = {
  characterModel: 'character-male-a.glb',
  bodyTint: '#E8B89B',
  hairTint: '#FBBF24',
  topTint: '#0D9488',
  bottomTint: '#1A1A1A',
  shoeTint: '#FBBF24',
  displayName: 'vibe coder',
  accessory: 'glasses',
  accessoryTint: '#1A1A1A',
}

/**
 * A small auto-rotating primitive avatar — drops into the landing hero so
 * the page isn't all 2D. Uses its own tiny <Canvas>.
 */
export function HeroAvatar() {
  return (
    <div className="w-full h-72 md:h-80 rounded-2xl border-2 border-dvc-border bg-gradient-to-br from-dvc-card to-dvc-section overflow-hidden shadow-brutCard">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }}>
        <OrthographicCamera makeDefault position={[3, 4, 5]} zoom={130} />
        <ambientLight intensity={0.6} color="#FFF6E0" />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          color="#FFE5B0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <PrimitiveAvatar config={HERO_AVATAR} showName={false} />
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#E8E2D0" />
          </mesh>
          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.5}
            scale={4}
            blur={2.4}
            far={4}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          target={[0, 0.7, 0]}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
