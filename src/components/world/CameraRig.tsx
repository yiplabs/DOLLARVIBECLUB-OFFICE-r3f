'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatarStore } from '@/store/avatarStore'
import { useSettingsStore } from '@/store/settingsStore'

type Props = {
  /** Distance the camera trails behind the avatar in world units. */
  offset?: [number, number, number]
  /** How quickly the camera converges on the target (per-second smoothing). */
  damping?: number
  /** When provided, overrides the user's "camera follows avatar" setting. */
  follow?: boolean
}

/**
 * Smoothly tracks the local avatar by continuously updating the active
 * orthographic camera's position. Designed to be dropped inside <SceneRoot>
 * after the camera mounts. Reactive to the settings store so the user can
 * toggle follow mode on/off live.
 */
export function CameraRig({
  offset = [20, 20, 20],
  damping = 4,
  follow,
}: Props) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const pos = useAvatarStore((s) => s.pos)
  const settingsFollow = useSettingsStore((s) => s.cameraFollow)
  const effectiveFollow = follow ?? settingsFollow

  useFrame((_, dt) => {
    if (!effectiveFollow) return
    target.current.set(pos[0], 0, pos[1])
    desired.current.set(
      target.current.x + offset[0],
      target.current.y + offset[1],
      target.current.z + offset[2],
    )
    camera.position.lerp(desired.current, Math.min(1, dt * damping))
    camera.lookAt(target.current)
    camera.updateProjectionMatrix()
  })

  return null
}
