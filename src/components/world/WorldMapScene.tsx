'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/rooms/catalog'
import { WorldBuilding } from './WorldBuilding'
import { useSettingsStore, getTimeOfDayPreset } from '@/store/settingsStore'

function CampusGround() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#E8E2D0" roughness={0.95} />
      </mesh>
      {/* Path tiles connecting buildings, faintly visible */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.8, 12, 32]} />
        <meshStandardMaterial color="#D4C9B0" roughness={0.9} />
      </mesh>
    </>
  )
}

function Tree({ pos, scale = 1 }: { pos: [number, number]; scale?: number }) {
  return (
    <group position={[pos[0], 0, pos[1]]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#8B6440" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#4A8B3A" />
      </mesh>
      <mesh position={[0.2, 1.8, 0.1]} castShadow>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#6BB44E" />
      </mesh>
    </group>
  )
}

function Lamppost({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
        <meshStandardMaterial color="#2D2D2D" metalness={0.4} />
      </mesh>
      <mesh position={[0, 3.05, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color="#FFF6E0"
          emissive="#FFE5B0"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight
        position={[0, 3.05, 0]}
        color="#FFE5B0"
        intensity={0.6}
        distance={6}
        decay={2}
      />
    </group>
  )
}

function Bench({ pos, rotY = 0 }: { pos: [number, number]; rotY?: number }) {
  return (
    <group position={[pos[0], 0, pos[1]]} rotation-y={rotY}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial color="#B8895A" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, -0.18]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.06]} />
        <meshStandardMaterial color="#B8895A" roughness={0.6} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.4]} />
          <meshStandardMaterial color="#2D2D2D" />
        </mesh>
      ))}
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
  const tod = getTimeOfDayPreset(useSettingsStore((s) => s.timeOfDay))

  const enter = (slug: string) => {
    if (exiting) return
    setExiting(slug)
    window.setTimeout(() => router.push(`/room/${slug}`), 480)
  }

  return (
    <>
      <color attach="background" args={[tod.fog]} />
      <fogExp2 attach="fog" args={[tod.fog, 0.012]} />
      <ambientLight color={tod.ambient} intensity={tod.ambientIntensity * 0.95} />
      <directionalLight
        color={tod.sun}
        intensity={tod.sunIntensity}
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
      <hemisphereLight args={[tod.sun, '#3D2D24', 0.4]} />

      <CampusGround />
      <CenterFountain />

      {/* Trees scattered around the perimeter */}
      <Tree pos={[-12, 8]} />
      <Tree pos={[-10, 9]} scale={0.85} />
      <Tree pos={[12, 8]} />
      <Tree pos={[14, -8]} scale={1.1} />
      <Tree pos={[-14, -8]} />
      <Tree pos={[0, 12]} scale={0.95} />
      <Tree pos={[-3, -10]} />
      <Tree pos={[5, 11]} scale={0.9} />
      <Tree pos={[-7, 11]} scale={0.8} />

      {/* Lampposts at the building entrances */}
      <Lamppost pos={[3, 3]} />
      <Lamppost pos={[-5, -3]} />
      <Lamppost pos={[6, -2]} />
      <Lamppost pos={[-3, 9]} />

      {/* Benches by the fountain */}
      <Bench pos={[-2, 3]} rotY={Math.PI / 2} />
      <Bench pos={[6, 3]} rotY={-Math.PI / 2} />
      <Bench pos={[2, -3]} rotY={Math.PI} />

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
          <div className="absolute inset-0 bg-black animate-fadein" />
        </Html>
      )}
    </>
  )
}
