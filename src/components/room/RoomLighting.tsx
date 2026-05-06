'use client'
import type { RoomTheme } from '@/lib/rooms/themes'
import { useQualityStore } from '@/store/qualityStore'
import { useSettingsStore, getTimeOfDayPreset } from '@/store/settingsStore'

/**
 * Mixes the room's intrinsic theme lighting with the global time-of-day preset.
 * 70% theme + 30% TOD by default — keeps Deep Focus moody at noon and Stage
 * dramatic at dawn while still letting the slider visibly change the room.
 */
export function RoomLighting({ theme }: { theme: RoomTheme }) {
  const shadows = useQualityStore((s) => s.shadows)
  const timeOfDay = useSettingsStore((s) => s.timeOfDay)
  const tod = getTimeOfDayPreset(timeOfDay)

  // Blend theme color with TOD color (simple linear hex mix not feasible without a parser,
  // so we just bias intensity + use TOD color for fill, theme for key).
  const ambientIntensity = theme.ambientIntensity * 0.55 + tod.ambientIntensity * 0.45
  const sunIntensity = theme.sunIntensity * 0.55 + tod.sunIntensity * 0.45

  return (
    <>
      <color attach="background" args={[theme.fogColor]} />
      <fogExp2 attach="fog" args={[theme.fogColor, 0.02]} />

      <ambientLight color={theme.ambientColor} intensity={ambientIntensity} />
      <hemisphereLight args={[tod.ambient, '#3D2D24', 0.35]} />

      <directionalLight
        color={theme.sunColor}
        intensity={sunIntensity}
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

      {/* Soft fill light from the opposite side, biased by TOD warmth */}
      <directionalLight
        color={tod.sun}
        intensity={sunIntensity * 0.35}
        position={[-theme.sunPosition[0], theme.sunPosition[1] * 0.6, -theme.sunPosition[2]]}
      />
    </>
  )
}
