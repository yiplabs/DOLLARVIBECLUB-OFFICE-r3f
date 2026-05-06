'use client'
import { useEffect, useRef } from 'react'
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

const SHAKE_BY_EMOTE: Record<string, number> = {
  dance: 0.18,
  clap: 0.06,
  wave: 0.03,
  sit: 0,
  idle: 0,
}

/**
 * Smoothly tracks the local avatar by continuously updating the active
 * orthographic camera's position. Subscribes to emote changes and applies
 * a brief shake intensity that decays over ~600ms.
 */
export function CameraRig({
  offset = [20, 20, 20],
  damping = 4,
  follow,
}: Props) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const shakeAmp = useRef(0)
  const pos = useAvatarStore((s) => s.pos)
  const settingsFollow = useSettingsStore((s) => s.cameraFollow)
  const effectiveFollow = follow ?? settingsFollow

  useEffect(() => {
    return useAvatarStore.subscribe((state, prev) => {
      if (state.emote !== prev.emote && state.emote !== 'idle') {
        const intensity = SHAKE_BY_EMOTE[state.emote] ?? 0
        shakeAmp.current = Math.max(shakeAmp.current, intensity)
      }
    })
  }, [])

  useFrame((state, dt) => {
    if (!effectiveFollow) {
      // Even when not following, decay shake so the camera settles.
      shakeAmp.current = Math.max(0, shakeAmp.current - dt * 0.6)
      return
    }
    target.current.set(pos[0], 0, pos[1])
    desired.current.set(
      target.current.x + offset[0],
      target.current.y + offset[1],
      target.current.z + offset[2],
    )

    // Apply trailing shake as a small noise offset that decays.
    if (shakeAmp.current > 0) {
      const t = state.clock.elapsedTime
      const shake = shakeAmp.current
      desired.current.x += Math.sin(t * 47) * shake
      desired.current.y += Math.sin(t * 53) * shake * 0.5
      desired.current.z += Math.cos(t * 41) * shake
      shakeAmp.current = Math.max(0, shakeAmp.current - dt * 0.6)
    }

    camera.position.lerp(desired.current, Math.min(1, dt * damping))
    camera.lookAt(target.current)
    camera.updateProjectionMatrix()
  })

  return null
}
