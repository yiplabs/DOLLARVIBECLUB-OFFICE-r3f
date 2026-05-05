'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/rooms/catalog'
import { WorldBuilding } from './WorldBuilding'

function CampusGround() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#E8E2D0" roughness={0.95} />
    </mesh>
  )
}

function Tree({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#8B6440" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#4A8B3A" />
      </mesh>
    </group>
  )
}

function SpinningCoin() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 1.2
    ref.current.position.y = 1.0 + Math.sin(performance.now() / 600) * 0.06
  })
  return (
    <mesh ref={ref} position={[0, 1.0, 0]} castShadow>
      <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
      <meshStandardMaterial color="#FBBF24" roughness={0.35} metalness={0.4} />
    </mesh>
  )
}

function CenterFountain() {
  return (
    <group position={[2, 0, 0]}>
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.5, 24]} />
        <meshStandardMaterial color="#F0EAD8" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 24]} />
        <meshStandardMaterial color="#0D9488" roughness={0.4} metalness={0.1} />
      </mesh>
      <SpinningCoin />
      <Html
        position={[0, 1.6, 0]}
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="font-hand font-bold text-4xl text-dvc-yellow"
          style={{ textShadow: '3px 3px 0 #2D2D2D' }}
        >
          DVC CAMPUS
        </div>
      </Html>
    </group>
  )
}

export default function WorldMapScene() {
  const router = useRouter()
  const [exiting, setExiting] = useState<string | null>(null)

  const enter = (slug: string) => {
    if (exiting) return
    setExiting(slug)
    window.setTimeout(() => router.push(`/room/${slug}`), 480)
  }

  return (
    <>
      <color attach="background" args={['#FFEFC9']} />
      <fogExp2 attach="fog" args={['#FFEFC9', 0.012]} />
      <ambientLight color="#FFF6E0" intensity={0.7} />
      <directionalLight
        color="#FFE5B0"
        intensity={1.2}
        position={[15, 20, 10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <Environment preset="apartment" />

      <CampusGround />
      <CenterFountain />

      <Tree pos={[-12, 8]} />
      <Tree pos={[-10, 9]} />
      <Tree pos={[12, 8]} />
      <Tree pos={[14, -8]} />
      <Tree pos={[-14, -8]} />
      <Tree pos={[0, 12]} />
      <Tree pos={[-3, -10]} />

      {ROOMS.map((room) => (
        <WorldBuilding
          key={room.slug}
          room={room}
          occupants={Math.floor(Math.random() * 8)}
          onClick={() => enter(room.slug)}
        />
      ))}

      {exiting && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-black animate-[fadein_0.5s_ease-in-out_forwards]" />
        </Html>
      )}
    </>
  )
}
