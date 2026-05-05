export type RoomTheme =
  | 'lounge'
  | 'focus'
  | 'arena'
  | 'brainstorm'
  | 'stage'
  | 'mentor'

export type RoomMeta = {
  slug: string
  name: string
  tagline: string
  description: string
  accent: string
  theme: RoomTheme
  buildingPos: [number, number]
  buildingShape: 'small' | 'medium' | 'large' | 'tall'
}

export const ROOMS: readonly RoomMeta[] = [
  {
    slug: 'lounge',
    name: 'The Lounge',
    tagline: 'chill, social, the default vibe',
    description:
      'Where vibe coders kick back. Networking, casual chat, "look what I shipped" energy.',
    accent: '#0D9488',
    theme: 'lounge',
    buildingPos: [0, 0],
    buildingShape: 'large',
  },
  {
    slug: 'deep-focus',
    name: 'Deep Focus',
    tagline: 'quiet work, lo-fi, do not disturb',
    description:
      'Pomodoros run on the wall. Chat is muted. Headphones-on energy.',
    accent: '#064E3B',
    theme: 'focus',
    buildingPos: [-8, 4],
    buildingShape: 'medium',
  },
  {
    slug: 'the-arena',
    name: 'The Arena',
    tagline: '1v1 build-offs, live leaderboard',
    description:
      'Two builders enter, one ships first. Live timer, audience seats, leaderboard wall.',
    accent: '#FBBF24',
    theme: 'arena',
    buildingPos: [8, -4],
    buildingShape: 'tall',
  },
  {
    slug: 'brainstorm',
    name: 'Brainstorm',
    tagline: 'ideas, sticky notes, whiteboards',
    description:
      'Walls covered in sticky notes. Pin your half-baked idea, find a co-founder by lunch.',
    accent: '#EC4899',
    theme: 'brainstorm',
    buildingPos: [6, 6],
    buildingShape: 'medium',
  },
  {
    slug: 'the-stage',
    name: 'The Stage',
    tagline: 'talks, ship-or-die, hunter live',
    description:
      'Where Hunter hosts live builds. Audience seats face the mic. $1 ship-or-die nightly.',
    accent: '#FBBF24',
    theme: 'stage',
    buildingPos: [-6, -6],
    buildingShape: 'large',
  },
  {
    slug: 'mentor-row',
    name: 'Mentor Row',
    tagline: 'vibe coders helping learners',
    description:
      'Open-door offices. Each has a mentor. Walk in, ask a question, get unstuck.',
    accent: '#F59E0B',
    theme: 'mentor',
    buildingPos: [10, 4],
    buildingShape: 'medium',
  },
] as const

export function getRoom(slug: string): RoomMeta | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
