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
 *
 * Returning conditional children as fragments inside EffectComposer breaks the
 * pass collection — instead we build an explicit array of effect elements.
 */
export function PostProcessing() {
  const { postFx, dof, bloom } = useQualityStore()
  if (!postFx) return null

  const effects = []
  if (dof) {
    effects.push(
      <DepthOfField
        key="dof"
        focusDistance={0.02}
        focalLength={0.04}
        bokehScale={3}
        height={480}
      />,
    )
  }
  if (bloom) {
    effects.push(
      <Bloom
        key="bloom"
        luminanceThreshold={1.05}
        luminanceSmoothing={0.9}
        height={300}
        intensity={0.4}
      />,
    )
  }
  effects.push(<Vignette key="vignette" eskil={false} offset={0.15} darkness={0.6} />)
  effects.push(<ToneMapping key="tonemap" mode={ToneMappingMode.ACES_FILMIC} />)

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      {effects}
    </EffectComposer>
  )
}
