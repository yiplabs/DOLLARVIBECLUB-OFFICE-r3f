'use client'
import { Component, type ReactNode, Suspense, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import type { AvatarConfig } from '@/lib/avatar/types'

const CHARACTERS_BASE = '/models/characters'

/** Tints submeshes of a Kenney Mini Characters GLB based on AvatarConfig. */
function applyTints(scene: THREE.Object3D, config: AvatarConfig) {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!(mesh as THREE.Mesh).isMesh || !mesh.material) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    const name = (mesh.name || '').toLowerCase()
    const matSrc = mesh.material as THREE.MeshStandardMaterial
    const next = matSrc.clone()
    if (name.includes('hair')) (next.color as THREE.Color).set(config.hairTint)
    else if (name.includes('skin') || name.includes('body') || name.includes('head'))
      (next.color as THREE.Color).set(config.bodyTint)
    else if (name.includes('shirt') || name.includes('top') || name.includes('torso'))
      (next.color as THREE.Color).set(config.topTint)
    else if (name.includes('pants') || name.includes('legs') || name.includes('bottom'))
      (next.color as THREE.Color).set(config.bottomTint)
    else if (name.includes('shoe') || name.includes('feet') || name.includes('boot'))
      (next.color as THREE.Color).set(config.shoeTint)
    mesh.material = next
  })
}

export type AvatarMeshHandle = {
  group: React.MutableRefObject<THREE.Group | null>
}

type Props = {
  config: AvatarConfig
  /** which animation to play */
  state: 'idle' | 'walk' | 'wave' | 'dance' | 'sit' | 'clap'
  innerRef: React.RefObject<THREE.Group | null>
}

function AvatarGLTF({ config, state, innerRef }: Props) {
  const url = `${CHARACTERS_BASE}/${config.characterModel}`
  const { scene, animations } = useGLTF(url)
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions, names } = useAnimations(animations, cloned)

  useMemo(() => applyTints(cloned, config), [cloned, config])

  useEffect(() => {
    if (!actions || !names.length) return
    const find = (target: string) => {
      const lower = target.toLowerCase()
      return names.find((n) => n.toLowerCase().includes(lower))
    }
    const desired =
      state === 'walk'
        ? find('walk') ?? find('run')
        : state === 'wave'
          ? find('wave')
          : state === 'dance'
            ? find('dance')
            : state === 'sit'
              ? find('sit')
              : state === 'clap'
                ? find('clap')
                : find('idle')
    if (!desired || !actions[desired]) return
    const action = actions[desired]!
    action.reset().fadeIn(0.25).play()
    return () => {
      action.fadeOut(0.25)
    }
  }, [actions, names, state])

  return (
    <group ref={innerRef}>
      <primitive object={cloned} />
    </group>
  )
}

function PrimitiveAvatar({ config, innerRef }: Props) {
  return (
    <group ref={innerRef}>
      {/* legs */}
      <mesh position={[-0.18, 0.35, 0]} castShadow>
        <boxGeometry args={[0.22, 0.7, 0.22]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>
      <mesh position={[0.18, 0.35, 0]} castShadow>
        <boxGeometry args={[0.22, 0.7, 0.22]} />
        <meshStandardMaterial color={config.bottomTint} />
      </mesh>
      {/* shoes */}
      <mesh position={[-0.18, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.32]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>
      <mesh position={[0.18, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.32]} />
        <meshStandardMaterial color={config.shoeTint} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.32]} />
        <meshStandardMaterial color={config.topTint} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.27, 18, 18]} />
        <meshStandardMaterial color={config.bodyTint} />
      </mesh>
      {/* hair cap */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.28, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color={config.hairTint} />
      </mesh>
    </group>
  )
}

class AvatarBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { errored: boolean }
> {
  state = { errored: false }
  static getDerivedStateFromError() {
    return { errored: true }
  }
  componentDidCatch() {
    /* swallow */
  }
  render() {
    if (this.state.errored) return this.props.fallback
    return this.props.children
  }
}

/**
 * Renders the avatar mesh inside `innerRef`. If the GLB is missing, falls back
 * to a tinted primitive of the same approximate size so click-to-move still works.
 */
export function AvatarMesh(props: Props) {
  return (
    <AvatarBoundary fallback={<PrimitiveAvatar {...props} />}>
      <Suspense fallback={<PrimitiveAvatar {...props} />}>
        <AvatarGLTF {...props} />
      </Suspense>
    </AvatarBoundary>
  )
}
