'use client'
import { ContactShadows } from '@react-three/drei'

export function AvatarShadow() {
  return (
    <ContactShadows
      position={[0, 0.001, 0]}
      opacity={0.45}
      scale={2}
      blur={2.4}
      far={1.5}
      resolution={256}
      color="#1a1a16"
    />
  )
}
