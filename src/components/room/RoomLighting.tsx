'use client'
import type { RoomTheme } from '@/lib/rooms/themes'
import { useQualityStore } from '@/store/qualityStore'

export function RoomLighting({ theme }: { theme: RoomTheme }) {
  const shadows = useQualityStore((s) => s.shadows)
  return (
    <>
      <color attach="background" args={[theme.fogColor]} />
      <fogExp2 attach="fog" args={[theme.fogColor, 0.02]} />
      <ambientLight color={theme.ambientColor} intensity={theme.ambientIntensity} />
      <hemisphereLight
        args={[theme.ambientColor, '#3D2D24', 0.35]}
      />
      <directionalLight
        color={theme.sunColor}
        intensity={theme.sunIntensity}
        position={theme.sunPosition}
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />
    </>
  )
}
