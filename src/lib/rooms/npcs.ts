import type { RoomTheme as RoomThemeKey } from './catalog'
import type { NpcDefinition } from '@/components/avatar/NpcAvatar'

const greeter: NpcDefinition = {
  config: {
    characterModel: 'character-female-a.glb',
    bodyTint: '#E8B89B',
    hairTint: '#FBBF24',
    topTint: '#0D9488',
    bottomTint: '#1A1A1A',
    shoeTint: '#FBBF24',
    displayName: 'rita · greeter',
    accessory: 'glasses',
    accessoryTint: '#FBBF24',
  },
  position: [7, 11],
  lines: [
    'hey, welcome in.',
    "first time? press '?' for the cheat sheet.",
    'click any tile to walk over.',
    "try /dance — i won't judge.",
    'six rooms total. lounge is just the start.',
    'press G for settings — try the night palette.',
  ],
  bubbleBg: '#FBBF24',
}

const focusMonitor: NpcDefinition = {
  config: {
    characterModel: 'character-male-b.glb',
    bodyTint: '#A87650',
    hairTint: '#1A1A1A',
    topTint: '#064E3B',
    bottomTint: '#1A1A1A',
    shoeTint: '#1A1A1A',
    displayName: 'micah · librarian',
    accessory: 'headphones',
    accessoryTint: '#1A1A1A',
  },
  position: [7, 11],
  lines: [
    'shhh — we ship here.',
    "no chat in the focus zone. type / shows you the timer though.",
    'try a 25m pomodoro from the bottom-left.',
    "headphones on. the pomodoro will tap you out.",
  ],
  bubbleBg: '#3B82F6',
  bubbleColor: '#FFFFFF',
  idle: 'still',
}

const arenaRef: NpcDefinition = {
  config: {
    characterModel: 'character-male-c.glb',
    bodyTint: '#D2A076',
    hairTint: '#1A1A1A',
    topTint: '#FBBF24',
    bottomTint: '#1A1A1A',
    shoeTint: '#FFFFFF',
    displayName: 'rex · the ref',
    accessory: 'glasses',
    accessoryTint: '#1A1A1A',
  },
  position: [7, 11],
  lines: [
    'two builders. one ships first. that simple.',
    'next match: 20:00 utc. seats fill fast.',
    'cheering counts as participation.',
    "don't use any AI we don't have. that's it for rules.",
  ],
  bubbleBg: '#FBBF24',
  idle: 'fidget',
}

const brainstormer: NpcDefinition = {
  config: {
    characterModel: 'character-female-c.glb',
    bodyTint: '#C9966D',
    hairTint: '#EC4899',
    topTint: '#EC4899',
    bottomTint: '#0F1714',
    shoeTint: '#FBBF24',
    displayName: 'nia · idea wrangler',
    accessory: 'crown',
    accessoryTint: '#FBBF24',
  },
  position: [7, 11],
  lines: [
    'half-baked is the goal. fully-baked is suspicious.',
    'pin a sticky on any wall. rotate it for chaos.',
    'cofounder by lunch is canon here.',
    'write the bad version first. iterate from there.',
  ],
  bubbleBg: '#EC4899',
  bubbleColor: '#FFFFFF',
}

const stageHost: NpcDefinition = {
  config: {
    characterModel: 'character-male-a.glb',
    bodyTint: '#E8B89B',
    hairTint: '#1A1A1A',
    topTint: '#1A1A1A',
    bottomTint: '#0F1714',
    shoeTint: '#FBBF24',
    displayName: 'hunter · host',
    accessory: 'headphones',
    accessoryTint: '#FBBF24',
  },
  position: [7, 11],
  lines: [
    'tonight: $1 ship-or-die. you can lurk or join.',
    'hot mic is on. mind your hot takes.',
    'we go live every friday. set a calendar reminder.',
    'check the spotlights — three colors mean a guest is up next.',
  ],
  bubbleBg: '#FBBF24',
  idle: 'fidget',
}

const mentor: NpcDefinition = {
  config: {
    characterModel: 'character-female-b.glb',
    bodyTint: '#F0D5B0',
    hairTint: '#7A4F32',
    topTint: '#F97316',
    bottomTint: '#3D2818',
    shoeTint: '#1A1A1A',
    displayName: 'sage · mentor',
    accessory: 'glasses',
    accessoryTint: '#3D2818',
  },
  position: [7, 11],
  lines: [
    'open door, open question. ask anything.',
    "stuck on a bug? walk in. five minutes is plenty.",
    'we route to specialists if your question is deep.',
    'office hours queue is just walking up here. no booking.',
  ],
  bubbleBg: '#F97316',
  bubbleColor: '#FFFFFF',
}

export const NPCS: Record<RoomThemeKey, NpcDefinition[]> = {
  lounge: [greeter],
  focus: [focusMonitor],
  arena: [arenaRef],
  brainstorm: [brainstormer],
  stage: [stageHost],
  mentor: [mentor],
}
