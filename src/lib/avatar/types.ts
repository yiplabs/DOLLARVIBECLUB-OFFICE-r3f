export type AvatarConfig = {
  /** Picks the Kenney Mini Characters GLB, e.g. "character-male-a.glb". */
  characterModel: string
  bodyTint: string
  hairTint: string
  topTint: string
  bottomTint: string
  shoeTint: string
  displayName: string
}

export const CHARACTER_MODELS = [
  { id: 'character-male-a.glb', label: 'Male A' },
  { id: 'character-male-b.glb', label: 'Male B' },
  { id: 'character-male-c.glb', label: 'Male C' },
  { id: 'character-female-a.glb', label: 'Female A' },
  { id: 'character-female-b.glb', label: 'Female B' },
  { id: 'character-female-c.glb', label: 'Female C' },
] as const

export const BODY_TINTS = [
  '#F0D5B0',
  '#E8B89B',
  '#D4A37D',
  '#C9966D',
  '#A87650',
  '#7A4F32',
  '#5A3A24',
  '#3D2818',
] as const

export const HAIR_TINTS = [
  '#1A1A1A',
  '#3D2818',
  '#7A4F32',
  '#A87650',
  '#FBBF24',
  '#FF6B35',
  '#EC4899',
  '#8B5CF6',
  '#0D9488',
  '#F0EAD8',
] as const

export const TOP_TINTS = [
  '#0D9488',
  '#0AB99D',
  '#FBBF24',
  '#EC4899',
  '#8B5CF6',
  '#3B82F6',
  '#22C55E',
  '#F97316',
  '#1A1A1A',
  '#F0EAD8',
  '#064E3B',
  '#7A0E0E',
] as const

export const BOTTOM_TINTS = [
  '#1A1A1A',
  '#0F1714',
  '#2D2D2D',
  '#3D2818',
  '#3B82F6',
  '#7A4F32',
  '#5A3A24',
  '#1E3A5F',
] as const

export const SHOE_TINTS = [
  '#1A1A1A',
  '#FFFFFF',
  '#FBBF24',
  '#22C55E',
  '#EC4899',
  '#3B82F6',
  '#F97316',
  '#7A4F32',
] as const
