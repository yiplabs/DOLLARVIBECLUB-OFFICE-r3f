'use client'
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useQualityStore } from '@/store/qualityStore'

/**
 * NOTE: <ToneMapping> MUST be the LAST child in <EffectComposer> (postprocessing v3.x).
 * <Canvas> must be configured with `gl={{ antialias: false }}` — the composer
 * handles MSAA via multisampling.
 */
export function PostProcessing() {
  const { postFx, dof, bloom } = useQualityStore()
  if (!postFx) return null

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      {dof ? (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.04}
          bokehScale={3}
          height={480}
        />
      ) : (
        <></>
      )}
      {bloom ? (
        <Bloom
          luminanceThreshold={1.05}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.4}
        />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.15} darkness={0.6} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
