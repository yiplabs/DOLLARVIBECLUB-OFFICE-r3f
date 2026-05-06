'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { AccessoryKind, AvatarConfig, HairStyle } from '@/lib/avatar/types'

function Hair({
  style = 'short',
  tint,
}: {
  style?: HairStyle
  tint: string
}) {
  switch (style) {
    case 'buzz':
      // a thin sphere cap, hugging the head
      return (
        <mesh position={[0, 1.32, -0.02]} castShadow>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          <meshStandardMaterial color={tint} roughness={0.95} />
        </mesh>
      )
    case 'mohawk':
      return (
        <group>
          <mesh position={[0, 1.28, -0.02]} castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          {/* central spike */}
          <mesh position={[0, 1.46, -0.02]} castShadow>
            <boxGeometry args={[0.08, 0.18, 0.32]} />
            <meshStandardMaterial color={tint} roughness={0.7} />
          </mesh>
        </group>
      )
    case 'long':
      return (
        <group>
          <mesh position={[0, 1.28, -0.02]} castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          {/* hair fall behind shoulders */}
          <mesh position={[0, 0.95, -0.13]} castShadow>
            <boxGeometry args={[0.36, 0.55, 0.08]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
        </group>
      )
    case 'bun':
      return (
        <group>
          <mesh position={[0, 1.28, -0.02]} castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.42, -0.06]} castShadow>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
        </group>
      )
    case 'short':
    default:
      return (
        <mesh position={[0, 1.28, -0.02]} castShadow>
          <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={tint} />
        </mesh>
      )
  }
}

function Accessory({
  kind,
  tint,
}: {
  kind: AccessoryKind
  tint: string
}) {
  switch (kind) {
    case 'glasses':
      return (
        <group position={[0, 1.18, 0.16]}>
          <mesh>
            <torusGeometry args={[0.05, 0.012, 8, 16]} />
            <meshStandardMaterial color={tint} metalness={0.5} />
          </mesh>
          <mesh position={[-0.09, 0, 0]}>
            <torusGeometry args={[0.05, 0.012, 8, 16]} />
            <meshStandardMaterial color={tint} metalness={0.5} />
          </mesh>
          <mesh position={[0.09, 0, 0]}>
            <torusGeometry args={[0.05, 0.012, 8, 16]} />
            <meshStandardMaterial color={tint} metalness={0.5} />
          </mesh>
        </group>
      )
    case 'beanie':
      return (
        <group>
          <mesh position={[0, 1.4, 0]} castShadow>
            <sphereGeometry args={[0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
            <meshStandardMaterial color={tint} roughness={0.95} />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={tint} roughness={0.95} />
          </mesh>
        </group>
      )
    case 'crown':
      return (
        <group position={[0, 1.45, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.08, 6]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.17, 0.07, Math.sin(a) * 0.17]}
                castShadow
              >
                <coneGeometry args={[0.04, 0.12, 4]} />
                <meshStandardMaterial color="#FBBF24" metalness={0.8} />
              </mesh>
            )
          })}
        </group>
      )
    case 'headphones':
      return (
        <group position={[0, 1.32, 0]}>
          <mesh>
            <torusGeometry args={[0.21, 0.025, 8, 18, Math.PI]} />
            <meshStandardMaterial color={tint} metalness={0.4} />
          </mesh>
          <mesh position={[-0.21, -0.02, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={tint} />
          </mesh>
          <mesh position={[0.21, -0.02, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={tint} />
          </mesh>
        </group>
      )
    case 'none':
    default:
      return null
  }
}

export type EmoteState = 'idle' | 'walk' | 'wave' | 'dance' | 'sit' | 'clap'

type Props = {
  config: AvatarConfig
  position?: [number, number, number]
  showName?: boolean
  isWalking?: boolean
  emote?: EmoteState
  /** When > 0, the emote auto-clears after this many ms (set to 0 for sustained sit). */
  emoteAutoClearMs?: number
}

/**
 * 100% reliable Three.js primitive avatar — no fetches, no GLBs.
 * Drives idle/walk/wave/dance/sit/clap from per-frame trig — all emotes are
 * additive offsets on a stable base pose.
 */
export function PrimitiveAvatar({
  config,
  position = [0, 0, 0],
  showName = true,
  isWalking = false,
  emote = 'idle',
}: Props) {
  const group = useRef<THREE.Group>(null!)
  const torso = useRef<THREE.Mesh>(null!)
  const armL = useRef<THREE.Mesh>(null!)
  const armR = useRef<THREE.Mesh>(null!)
  const legL = useRef<THREE.Mesh>(null!)
  const legR = useRef<THREE.Mesh>(null!)
  const head = useRef<THREE.Mesh>(null!)
  const hair = useRef<THREE.Group>(null!)

  const activeEmote: EmoteState = isWalking ? 'walk' : emote

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return

    // Reset transforms each frame so emote logic is stateless.
    group.current.position.y = position[1]
    if (torso.current) torso.current.rotation.set(0, 0, 0)
    if (armL.current) armL.current.rotation.set(0, 0, 0)
    if (armR.current) armR.current.rotation.set(0, 0, 0)
    if (legL.current) legL.current.position.set(-0.1, 0.25, 0)
    if (legR.current) legR.current.position.set(0.1, 0.25, 0)
    if (head.current) head.current.rotation.set(0, 0, 0)
    if (hair.current) hair.current.rotation.set(0, 0, 0)

    switch (activeEmote) {
      case 'walk': {
        group.current.position.y = position[1] + Math.abs(Math.sin(t * 8)) * 0.08
        if (torso.current) torso.current.rotation.z = Math.sin(t * 8) * 0.05
        if (armL.current) armL.current.rotation.x = Math.sin(t * 8) * 0.6
        if (armR.current) armR.current.rotation.x = -Math.sin(t * 8) * 0.6
        break
      }
      case 'wave': {
        if (armR.current) {
          armR.current.rotation.z = -1.4 + Math.sin(t * 8) * 0.2
          armR.current.rotation.x = -0.3
        }
        if (head.current) head.current.rotation.y = Math.sin(t * 4) * 0.15
        break
      }
      case 'dance': {
        const bob = Math.abs(Math.sin(t * 6)) * 0.18
        group.current.position.y = position[1] + bob
        if (torso.current) {
          torso.current.rotation.z = Math.sin(t * 6) * 0.18
          torso.current.rotation.y = Math.sin(t * 3) * 0.4
        }
        if (armL.current) armL.current.rotation.x = -1.2 + Math.sin(t * 6) * 0.5
        if (armR.current) armR.current.rotation.x = -1.2 - Math.sin(t * 6) * 0.5
        if (head.current) head.current.rotation.z = Math.sin(t * 6) * 0.1
        break
      }
      case 'clap': {
        const c = Math.sin(t * 10) * 0.5 + 0.5
        if (armL.current) armL.current.rotation.z = -0.8 + c * 0.6
        if (armR.current) armR.current.rotation.z = 0.8 - c * 0.6
        if (armL.current) armL.current.rotation.x = -0.6
        if (armR.current) armR.current.rotation.x = -0.6
        break
      }
      case 'sit': {
        // Lower the entire avatar and bend legs forward.
        group.current.position.y = position[1] - 0.18
        if (legL.current) legL.current.position.set(-0.1, 0.18, 0.1)
        if (legR.current) legR.current.position.set(0.1, 0.18, 0.1)
        if (torso.current) torso.current.rotation.x = -0.05
        break
      }
      case 'idle':
      default: {
        group.current.position.y = position[1] + Math.sin(t * 2) * 0.02
        if (torso.current) torso.current.rotation.z = Math.sin(t * 2) * 0.02
        break
      }
    }
  })

  return (
    <group ref={group} position={position}>
      {/* soft ground blob */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01} receiveShadow>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.25} transparent />
      </mesh>

      {/* legs */}
      <mesh ref={legL} position={[-0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.15]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>
      <mesh ref={legR} position={[0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.15]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>

      {/* shoes */}
      <mesh position={[-0.1, 0.03, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.22]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.22]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>

      {/* torso */}
      <mesh ref={torso} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshStandardMaterial color={config.topTint} />
      </mesh>

      {/* arms — pivoted at shoulder so rotation feels right */}
      <group position={[-0.27, 0.96, 0]}>
        <mesh ref={armL} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.18]} />
          <meshStandardMaterial color={config.topTint} />
        </mesh>
      </group>
      <group position={[0.27, 0.96, 0]}>
        <mesh ref={armR} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.18]} />
          <meshStandardMaterial color={config.topTint} />
        </mesh>
      </group>

      {/* head */}
      <mesh ref={head} position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={config.bodyTint} />
      </mesh>

      {/* hair (style-aware) */}
      <group ref={hair}>
        <Hair style={config.hairStyle} tint={config.hairTint} />
      </group>

      <Accessory
        kind={config.accessory ?? 'none'}
        tint={config.accessoryTint ?? '#1A1A1A'}
      />

      {/* face dots */}
      <mesh position={[-0.06, 1.2, 0.16]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.06, 1.2, 0.16]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>

      {showName && (
        <Html
          position={[0, 1.65, 0]}
          center
          distanceFactor={10}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="bg-dvc-card border-2 border-dvc-border rounded-md px-2 py-0.5 font-ui font-bold text-xs text-dvc-cream whitespace-nowrap"
            style={{ boxShadow: '2px 2px 0 #2D2D2D' }}
          >
            {config.displayName}
          </div>
        </Html>
      )}
    </group>
  )
}
