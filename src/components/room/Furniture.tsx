'use client'
import { Component, type ReactNode, Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import type { FurniturePlacement, RoomTheme } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'

const FURNITURE_BASE = '/models/furniture'

// Footprints + tints for primitive fallback when a GLB is missing.
const FALLBACK: Record<
  string,
  { size: [number, number, number]; color: string; offsetY?: number }
> = {
  desk: { size: [1.4, 0.7, 0.8], color: '#B8895A' },
  deskCorner: { size: [1.4, 0.7, 1.4], color: '#B8895A' },
  chairDesk: { size: [0.7, 1.0, 0.7], color: '#2D2D2D' },
  chairCushion: { size: [0.8, 0.6, 0.8], color: '#FBBF24' },
  computerScreen: { size: [0.6, 0.5, 0.1], color: '#1A1A1A', offsetY: 0.95 },
  computerKeyboard: { size: [0.5, 0.05, 0.2], color: '#2D2D2D', offsetY: 0.75 },
  laptop: { size: [0.5, 0.1, 0.4], color: '#94A3B8', offsetY: 0.75 },
  bookcaseClosed: { size: [0.9, 1.8, 0.4], color: '#8B6440' },
  bookcaseOpen: { size: [1.2, 1.8, 0.35], color: '#8B6440' },
  loungeSofa: { size: [2.0, 0.8, 0.9], color: '#6366F1' },
  loungeSofaCorner: { size: [0.9, 0.8, 0.9], color: '#6366F1' },
  pottedPlant: { size: [0.6, 1.1, 0.6], color: '#4A8B3A' },
  plantSmall: { size: [0.4, 0.5, 0.4], color: '#4A8B3A' },
  coffeeTable: { size: [1.0, 0.4, 0.7], color: '#B8895A' },
  lampSquareTable: { size: [0.3, 0.6, 0.3], color: '#FBBF24' },
  rugRectangle: { size: [2.0, 0.02, 1.4], color: '#0D9488' },
  rugRound: { size: [1.6, 0.02, 1.6], color: '#0D9488' },
  kitchenFridge: { size: [0.9, 1.7, 0.7], color: '#F0EAD8' },
  kitchenStove: { size: [0.9, 0.9, 0.7], color: '#2D2D2D' },
  wallDoorway: { size: [1.4, 2.2, 0.15], color: '#F0EAD8' },
  wallWindow: { size: [1.4, 1.2, 0.15], color: '#A8D5DD' },
}

function FallbackPiece({ p }: { p: FurniturePlacement }) {
  const f = FALLBACK[p.model] ?? { size: [0.8, 0.8, 0.8] as [number, number, number], color: '#888' }
  const color = p.tint ?? f.color
  const yaw = ((p.rotation ?? 0) * Math.PI) / 180
  const scale = p.scale ?? 1
  const y = (f.offsetY ?? f.size[1] / 2) * scale
  return (
    <group
      position={[gridToWorld(p.position[0]), y, gridToWorld(p.position[1])]}
      rotation-y={yaw}
      scale={scale}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={f.size} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  )
}

function GLTFPiece({ p }: { p: FurniturePlacement }) {
  const url = `${FURNITURE_BASE}/${p.model}.glb`
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene])

  useMemo(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if ((mesh as THREE.Mesh).isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (p.tint && mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
          if ('color' in mat) (mat.color as THREE.Color).set(p.tint)
          mesh.material = mat
        }
      }
    })
  }, [cloned, p.tint])

  const yaw = ((p.rotation ?? 0) * Math.PI) / 180
  const scale = p.scale ?? 1

  return (
    <group
      position={[gridToWorld(p.position[0]), 0, gridToWorld(p.position[1])]}
      rotation-y={yaw}
      scale={scale}
    >
      <primitive object={cloned} />
    </group>
  )
}

class Boundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { errored: boolean }
> {
  state = { errored: false }
  static getDerivedStateFromError() {
    return { errored: true }
  }
  componentDidCatch() {
    // swallow — fallback already rendered
  }
  render() {
    if (this.state.errored) return this.props.fallback
    return this.props.children
  }
}

function Piece({ p }: { p: FurniturePlacement }) {
  // useGLTF throws (suspends) until it loads — wrap in Suspense + an error boundary
  // so a missing GLB renders the primitive fallback instead of breaking the room.
  return (
    <Boundary fallback={<FallbackPiece p={p} />}>
      <Suspense fallback={<FallbackPiece p={p} />}>
        <GLTFPiece p={p} />
      </Suspense>
    </Boundary>
  )
}

export function Furniture({ theme }: { theme: RoomTheme }) {
  return (
    <group>
      {theme.furniture.map((p, i) => (
        <Piece key={`${p.model}-${i}`} p={p} />
      ))}
    </group>
  )
}
