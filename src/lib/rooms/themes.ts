import type { RoomTheme as RoomThemeKey } from './catalog'

export type FurniturePlacement = {
  /** .glb basename (without extension), e.g. "desk" */
  model: string
  position: [number, number]
  rotation?: 0 | 90 | 180 | 270
  tint?: string
  scale?: number
}

export type WallSegment = {
  from: [number, number]
  to: [number, number]
  height?: number
  /** A doorway/window cut along this segment, expressed as a fraction (0..1) of the segment length */
  opening?: { kind: 'door' | 'window'; at: number; width: number }
}

export type WallSign = {
  wall: 'north' | 'south' | 'east' | 'west'
  position: number
  text: string
  size?: number
  color?: string
  font?: 'caveat' | 'sora' | 'epilogue'
}

export type StickyCluster = {
  wall: 'north' | 'south' | 'east' | 'west'
  count: number
  colors: string[]
}

export type RugZone = {
  position: [number, number]
  size: [number, number]
  color: string
  shape?: 'rect' | 'round'
}

export type RoomTheme = {
  ambientColor: string
  ambientIntensity: number
  sunColor: string
  sunIntensity: number
  sunPosition: [number, number, number]
  fogColor: string
  fogNear: number
  fogFar: number
  floorBaseColor: string
  wallColor: string
  rugs: RugZone[]
  furniture: FurniturePlacement[]
  walls: WallSegment[]
  signs: WallSign[]
  stickies?: StickyCluster[]
  /** raised "stage" platforms */
  platforms?: { position: [number, number]; size: [number, number]; color: string; height?: number }[]
  spawnPoints: [number, number][]
  gridWidth: number
  gridDepth: number
}

// ─── helpers for desk pods ────────────────────────────────────
const deskPod = (gx: number, gz: number, rotation: 0 | 90 | 180 | 270 = 0): FurniturePlacement[] => [
  { model: 'desk', position: [gx, gz], rotation },
  { model: 'chairDesk', position: [gx, gz + 1], rotation },
  { model: 'computerScreen', position: [gx, gz], rotation, scale: 0.9 },
  { model: 'computerKeyboard', position: [gx, gz], rotation, scale: 0.9 },
]

// ─── LOUNGE ────────────────────────────────────────────────────
const LOUNGE: RoomTheme = {
  ambientColor: '#FFF6E0',
  ambientIntensity: 0.6,
  sunColor: '#FFE5B0',
  sunIntensity: 1.2,
  sunPosition: [10, 15, 5],
  fogColor: '#F0EAD8',
  fogNear: 30,
  fogFar: 80,
  floorBaseColor: '#E8E2D0',
  wallColor: '#F0EAD8',
  rugs: [
    { position: [7, 7], size: [6, 6], color: '#0D9488', shape: 'rect' },
    { position: [3, 4], size: [3, 2], color: '#FBBF24', shape: 'rect' },
  ],
  furniture: [
    // Lounge sofa zone (left)
    { model: 'loungeSofa', position: [3, 3], rotation: 90, tint: '#6366F1' },
    { model: 'loungeSofaCorner', position: [2, 3], rotation: 90, tint: '#6366F1' },
    { model: 'chairCushion', position: [4, 5], rotation: 0, tint: '#FBBF24' },
    { model: 'coffeeTable', position: [3, 5] },
    { model: 'lampSquareTable', position: [3, 5], scale: 0.6 },
    // Center 2x2 desk grid
    ...deskPod(6, 6),
    ...deskPod(8, 6),
    ...deskPod(6, 9),
    ...deskPod(8, 9),
    { model: 'laptop', position: [7, 6], scale: 0.9 },
    { model: 'pottedPlant', position: [7, 7] }, // divider planter
    // Coffee bar on right wall
    { model: 'kitchenFridge', position: [12, 3] },
    { model: 'kitchenStove', position: [12, 5] },
    // Bookcase against back wall
    { model: 'bookcaseClosed', position: [11, 12] },
    // Plants scattered
    { model: 'pottedPlant', position: [1, 1] },
    { model: 'pottedPlant', position: [12, 12] },
    { model: 'plantSmall', position: [5, 1] },
    { model: 'plantSmall', position: [10, 1] },
    { model: 'pottedPlant', position: [1, 12] },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] }, // north
    { from: [13, 0], to: [13, 13] }, // east, with windows
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } }, // south doorway
    { from: [0, 0], to: [0, 13] }, // west
  ],
  signs: [
    { wall: 'north', position: 0.5, text: 'DVC LOUNGE', size: 0.5, color: '#0D9488', font: 'caveat' },
  ],
  spawnPoints: [[7, 13], [6, 12], [8, 12]],
  gridWidth: 14,
  gridDepth: 14,
}

// ─── DEEP FOCUS ────────────────────────────────────────────────
const FOCUS: RoomTheme = {
  ambientColor: '#2D3D3D',
  ambientIntensity: 0.3,
  sunColor: '#B8C4D0',
  sunIntensity: 0.6,
  sunPosition: [5, 12, 5],
  fogColor: '#1A2422',
  fogNear: 20,
  fogFar: 60,
  floorBaseColor: '#3D352D',
  wallColor: '#2A2620',
  rugs: [{ position: [6, 6], size: [4, 6], color: '#3B82F6', shape: 'rect' }],
  furniture: [
    // 6 isolated focus pods around perimeter
    ...deskPod(2, 2, 90),
    ...deskPod(2, 6, 90),
    ...deskPod(2, 10, 90),
    ...deskPod(11, 2, 270),
    ...deskPod(11, 6, 270),
    ...deskPod(11, 10, 270),
    { model: 'plantSmall', position: [1, 1] },
    { model: 'plantSmall', position: [12, 12] },
    { model: 'lampSquareTable', position: [2, 2], scale: 0.5 },
    { model: 'lampSquareTable', position: [11, 6], scale: 0.5 },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] },
    { from: [13, 0], to: [13, 13] },
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } },
    { from: [0, 0], to: [0, 13] },
  ],
  signs: [
    { wall: 'north', position: 0.5, text: 'DEEP WORK', size: 0.5, color: '#3B82F6', font: 'caveat' },
    { wall: 'east', position: 0.5, text: 'SHHH', size: 0.4, color: '#94A3B8', font: 'caveat' },
  ],
  spawnPoints: [[7, 13]],
  gridWidth: 14,
  gridDepth: 14,
}

// ─── THE ARENA ─────────────────────────────────────────────────
const ARENA: RoomTheme = {
  ambientColor: '#1A1A16',
  ambientIntensity: 0.4,
  sunColor: '#FBBF24',
  sunIntensity: 0.8,
  sunPosition: [0, 15, 0],
  fogColor: '#0F0F0A',
  fogNear: 15,
  fogFar: 40,
  floorBaseColor: '#2D2D2D',
  wallColor: '#1A1A16',
  rugs: [
    { position: [5, 7], size: [3, 4], color: '#FBBF24', shape: 'rect' },
    { position: [9, 7], size: [3, 4], color: '#FBBF24', shape: 'rect' },
  ],
  furniture: [
    { model: 'desk', position: [5, 7], rotation: 90 },
    { model: 'chairDesk', position: [4, 7], rotation: 90 },
    { model: 'computerScreen', position: [5, 7], rotation: 90 },
    { model: 'desk', position: [9, 7], rotation: 270 },
    { model: 'chairDesk', position: [10, 7], rotation: 270 },
    { model: 'computerScreen', position: [9, 7], rotation: 270 },
    // Audience U-shape
    { model: 'chairCushion', position: [3, 3] },
    { model: 'chairCushion', position: [5, 3] },
    { model: 'chairCushion', position: [7, 3] },
    { model: 'chairCushion', position: [9, 3] },
    { model: 'chairCushion', position: [11, 3] },
    { model: 'chairCushion', position: [3, 11] },
    { model: 'chairCushion', position: [5, 11] },
    { model: 'chairCushion', position: [9, 11] },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] },
    { from: [13, 0], to: [13, 13] },
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } },
    { from: [0, 0], to: [0, 13] },
  ],
  signs: [
    { wall: 'north', position: 0.5, text: '1V1 BUILD-OFF', size: 0.6, color: '#FBBF24', font: 'epilogue' },
    { wall: 'east', position: 0.5, text: 'WINNER GETS THE COIN', size: 0.4, color: '#FBBF24', font: 'caveat' },
  ],
  spawnPoints: [[7, 13]],
  gridWidth: 14,
  gridDepth: 14,
}

// ─── BRAINSTORM ────────────────────────────────────────────────
const BRAINSTORM: RoomTheme = {
  ambientColor: '#FFE5F2',
  ambientIntensity: 0.7,
  sunColor: '#F0EAD8',
  sunIntensity: 1.0,
  sunPosition: [8, 14, 8],
  fogColor: '#FFEAF3',
  fogNear: 25,
  fogFar: 70,
  floorBaseColor: '#F5DEAD',
  wallColor: '#F5E6D8',
  rugs: [
    { position: [6, 6], size: [5, 5], color: '#EC4899', shape: 'round' },
    { position: [10, 10], size: [3, 3], color: '#FBBF24', shape: 'rect' },
  ],
  furniture: [
    { model: 'coffeeTable', position: [6, 6], scale: 1.4 },
    { model: 'chairCushion', position: [4, 6], rotation: 90, tint: '#EC4899' },
    { model: 'chairCushion', position: [8, 6], rotation: 270, tint: '#FBBF24' },
    { model: 'chairCushion', position: [6, 4], rotation: 180, tint: '#3B82F6' },
    { model: 'chairCushion', position: [6, 8], rotation: 0, tint: '#22C55E' },
    { model: 'bookcaseOpen', position: [11, 1] },
    { model: 'pottedPlant', position: [1, 1] },
    { model: 'pottedPlant', position: [12, 1] },
    { model: 'pottedPlant', position: [1, 12] },
    { model: 'pottedPlant', position: [12, 12] },
    { model: 'plantSmall', position: [1, 6] },
    { model: 'plantSmall', position: [12, 6] },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] },
    { from: [13, 0], to: [13, 13] },
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } },
    { from: [0, 0], to: [0, 13] },
  ],
  signs: [
    { wall: 'north', position: 0.5, text: 'IDEAS WELCOME', size: 0.55, color: '#EC4899', font: 'caveat' },
    { wall: 'west', position: 0.5, text: 'HALF-BAKED OK', size: 0.4, color: '#FBBF24', font: 'caveat' },
  ],
  stickies: [
    { wall: 'north', count: 18, colors: ['#FBBF24', '#EC4899', '#3B82F6', '#22C55E'] },
    { wall: 'east', count: 14, colors: ['#FBBF24', '#EC4899', '#FFFFFF', '#22C55E'] },
    { wall: 'west', count: 12, colors: ['#FBBF24', '#EC4899', '#3B82F6'] },
  ],
  spawnPoints: [[7, 13]],
  gridWidth: 14,
  gridDepth: 14,
}

// ─── THE STAGE ─────────────────────────────────────────────────
const STAGE: RoomTheme = {
  ambientColor: '#1A1A16',
  ambientIntensity: 0.4,
  sunColor: '#FBBF24',
  sunIntensity: 1.5,
  sunPosition: [0, 12, 3],
  fogColor: '#0A0A06',
  fogNear: 20,
  fogFar: 50,
  floorBaseColor: '#1A1A16',
  wallColor: '#0F0F0A',
  rugs: [],
  platforms: [{ position: [7, 2], size: [4, 3], color: '#FBBF24', height: 0.3 }],
  furniture: [
    { model: 'lampSquareTable', position: [7, 2], scale: 0.7 }, // mic stand placeholder on stage
    // 4 rows of audience chairs facing stage (16 chairs)
    { model: 'chairCushion', position: [3, 6] },
    { model: 'chairCushion', position: [5, 6] },
    { model: 'chairCushion', position: [7, 6] },
    { model: 'chairCushion', position: [9, 6] },
    { model: 'chairCushion', position: [11, 6] },
    { model: 'chairCushion', position: [3, 8] },
    { model: 'chairCushion', position: [5, 8] },
    { model: 'chairCushion', position: [7, 8] },
    { model: 'chairCushion', position: [9, 8] },
    { model: 'chairCushion', position: [11, 8] },
    { model: 'chairCushion', position: [3, 10] },
    { model: 'chairCushion', position: [5, 10] },
    { model: 'chairCushion', position: [7, 10] },
    { model: 'chairCushion', position: [9, 10] },
    { model: 'chairCushion', position: [11, 10] },
    { model: 'pottedPlant', position: [1, 1] },
    { model: 'pottedPlant', position: [12, 1] },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] },
    { from: [13, 0], to: [13, 13] },
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } },
    { from: [0, 0], to: [0, 13] },
  ],
  signs: [
    { wall: 'north', position: 0.5, text: 'TONIGHT: $1 SHIP-OR-DIE', size: 0.65, color: '#FBBF24', font: 'epilogue' },
    { wall: 'east', position: 0.5, text: '@TOMMYYIPXYZ', size: 0.45, color: '#FBBF24', font: 'caveat' },
  ],
  spawnPoints: [[7, 13]],
  gridWidth: 14,
  gridDepth: 14,
}

// ─── MENTOR ROW ────────────────────────────────────────────────
const MENTOR: RoomTheme = {
  ambientColor: '#FFEFC9',
  ambientIntensity: 0.7,
  sunColor: '#FBBF24',
  sunIntensity: 1.0,
  sunPosition: [10, 14, 5],
  fogColor: '#FFEFD5',
  fogNear: 25,
  fogFar: 65,
  floorBaseColor: '#F5DEAD',
  wallColor: '#F0EAD8',
  rugs: [{ position: [7, 9], size: [10, 2], color: '#F97316', shape: 'rect' }],
  furniture: [
    // 5 mini-offices along north wall: each has desk + chair + monitor
    ...deskPod(2, 2),
    ...deskPod(4, 2),
    ...deskPod(6, 2),
    ...deskPod(8, 2),
    ...deskPod(10, 2),
    { model: 'plantSmall', position: [1, 1] },
    { model: 'plantSmall', position: [12, 1] },
    { model: 'pottedPlant', position: [1, 12] },
    { model: 'pottedPlant', position: [12, 12] },
    { model: 'chairCushion', position: [3, 9], rotation: 0 },
    { model: 'chairCushion', position: [10, 9], rotation: 0 },
  ],
  walls: [
    { from: [0, 0], to: [13, 0] },
    { from: [13, 0], to: [13, 13] },
    { from: [0, 13], to: [13, 13], opening: { kind: 'door', at: 0.5, width: 0.18 } },
    { from: [0, 0], to: [0, 13] },
    // Internal partitions for mini-offices (waist-high; height 0.5)
    { from: [3, 0], to: [3, 4], height: 0.5 },
    { from: [5, 0], to: [5, 4], height: 0.5 },
    { from: [7, 0], to: [7, 4], height: 0.5 },
    { from: [9, 0], to: [9, 4], height: 0.5 },
    { from: [11, 0], to: [11, 4], height: 0.5 },
  ],
  signs: [
    { wall: 'north', position: 0.5, text: 'OPEN DOOR HOURS', size: 0.55, color: '#F59E0B', font: 'caveat' },
    { wall: 'east', position: 0.5, text: 'ASK ANYTHING', size: 0.4, color: '#F59E0B', font: 'caveat' },
  ],
  spawnPoints: [[7, 13]],
  gridWidth: 14,
  gridDepth: 14,
}

export const THEMES: Record<RoomThemeKey, RoomTheme> = {
  lounge: LOUNGE,
  focus: FOCUS,
  arena: ARENA,
  brainstorm: BRAINSTORM,
  stage: STAGE,
  mentor: MENTOR,
}
