'use client'
import type { AvatarConfig } from '@/lib/avatar/types'

/**
 * Flip to true once you've dropped Kenney Mini Characters .glb files into
 * /public/models/characters/. While false, this component never fetches —
 * the AvatarBoundary in avatarLoader.tsx falls through to <PrimitiveAvatar>.
 */
export const KENNEY_AVAILABLE = false

type Props = {
  config: AvatarConfig
  position?: [number, number, number]
  isWalking?: boolean
  showName?: boolean
}

export function AvatarGLTF(_props: Props) {
  if (!KENNEY_AVAILABLE) return null

  // When you flip KENNEY_AVAILABLE to true, fill in this body to use:
  //   const { scene, animations } = useGLTF(`/models/characters/${config.characterModel}`)
  //   const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene])
  //   const { actions } = useAnimations(animations, cloned)
  // and tint via name-includes('hair'|'body'|'shirt'|'pants'|'shoe') on each mesh.
  // See the master prompt PART 14 for the full pattern.
  return null
}
