import {
  type AvatarConfig,
  BODY_TINTS,
  BOTTOM_TINTS,
  CHARACTER_MODELS,
  HAIR_STYLES,
  HAIR_TINTS,
  SHOE_TINTS,
  TOP_TINTS,
} from './types'

export type AvatarPreset = {
  id: string
  name: string
  emoji: string
  config: AvatarConfig
}

export const AVATAR_PRESETS: readonly AvatarPreset[] = [
  {
    id: 'vibe-coder',
    name: 'Vibe Coder',
    emoji: '💻',
    config: {
      characterModel: 'character-male-a.glb',
      bodyTint: '#E8B89B',
      hairTint: '#1A1A1A',
      topTint: '#0D9488',
      bottomTint: '#1A1A1A',
      shoeTint: '#FBBF24',
      displayName: 'vibe coder',
    },
  },
  {
    id: 'ship-queen',
    name: 'Ship Queen',
    emoji: '👑',
    config: {
      characterModel: 'character-female-a.glb',
      bodyTint: '#D4A37D',
      hairTint: '#FBBF24',
      topTint: '#EC4899',
      bottomTint: '#0F1714',
      shoeTint: '#FFFFFF',
      displayName: 'ship queen',
    },
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    emoji: '🎧',
    config: {
      characterModel: 'character-male-b.glb',
      bodyTint: '#A87650',
      hairTint: '#2D2D2D',
      topTint: '#064E3B',
      bottomTint: '#2D2D2D',
      shoeTint: '#1A1A1A',
      displayName: 'focused',
    },
  },
  {
    id: 'founder',
    name: 'Founder',
    emoji: '🚀',
    config: {
      characterModel: 'character-female-b.glb',
      bodyTint: '#F0D5B0',
      hairTint: '#8B4513',
      topTint: '#1A1A1A',
      bottomTint: '#0F1714',
      shoeTint: '#1A1A1A',
      displayName: 'founder',
    },
  },
  {
    id: 'intern',
    name: 'First Day',
    emoji: '🌱',
    config: {
      characterModel: 'character-male-c.glb',
      bodyTint: '#D2A076',
      hairTint: '#1A1A1A',
      topTint: '#FBBF24',
      bottomTint: '#0D9488',
      shoeTint: '#22C55E',
      displayName: 'newbie',
    },
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    emoji: '🦉',
    config: {
      characterModel: 'character-female-c.glb',
      bodyTint: '#C9966D',
      hairTint: '#1A1A1A',
      topTint: '#8B5CF6',
      bottomTint: '#1A1A1A',
      shoeTint: '#1A1A1A',
      displayName: 'night owl',
    },
  },
  {
    id: 'staff-eng',
    name: 'Staff Eng',
    emoji: '🧠',
    config: {
      characterModel: 'character-male-b.glb',
      bodyTint: '#7A4F32',
      hairTint: '#3D2818',
      hairStyle: 'short',
      topTint: '#0F1714',
      bottomTint: '#2D2D2D',
      shoeTint: '#1A1A1A',
      displayName: 'staff eng',
      accessory: 'glasses',
      accessoryTint: '#1A1A1A',
    },
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    config: {
      characterModel: 'character-female-b.glb',
      bodyTint: '#F0D5B0',
      hairTint: '#EC4899',
      hairStyle: 'bun',
      topTint: '#FBBF24',
      bottomTint: '#3B82F6',
      shoeTint: '#FFFFFF',
      displayName: 'designer',
    },
  },
  {
    id: 'punk',
    name: 'Punk',
    emoji: '🤘',
    config: {
      characterModel: 'character-male-c.glb',
      bodyTint: '#D4A37D',
      hairTint: '#FBBF24',
      hairStyle: 'mohawk',
      topTint: '#1A1A1A',
      bottomTint: '#0F1714',
      shoeTint: '#7A0E0E',
      displayName: 'punk',
      accessory: 'glasses',
      accessoryTint: '#7A0E0E',
    },
  },
  {
    id: 'librarian',
    name: 'Librarian',
    emoji: '📚',
    config: {
      characterModel: 'character-female-a.glb',
      bodyTint: '#E8B89B',
      hairTint: '#7A4F32',
      hairStyle: 'long',
      topTint: '#064E3B',
      bottomTint: '#3D2818',
      shoeTint: '#3D2818',
      displayName: 'librarian',
      accessory: 'glasses',
      accessoryTint: '#3D2818',
    },
  },
] as const

export const DEFAULT_AVATAR: AvatarConfig = AVATAR_PRESETS[0].config

export function randomizeAvatar(displayName = 'vibe coder'): AvatarConfig {
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
  return {
    characterModel: pick(CHARACTER_MODELS).id,
    bodyTint: pick(BODY_TINTS),
    hairTint: pick(HAIR_TINTS),
    hairStyle: pick(HAIR_STYLES).kind,
    topTint: pick(TOP_TINTS),
    bottomTint: pick(BOTTOM_TINTS),
    shoeTint: pick(SHOE_TINTS),
    displayName,
  }
}
