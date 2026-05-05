export type Facing = 'north' | 'south' | 'east' | 'west'

export function computeFacing(dx: number, dz: number): Facing {
  if (Math.abs(dx) >= Math.abs(dz)) return dx >= 0 ? 'east' : 'west'
  return dz >= 0 ? 'south' : 'north'
}

export function facingToRotationY(f: Facing): number {
  switch (f) {
    case 'north':
      return Math.PI
    case 'south':
      return 0
    case 'east':
      return -Math.PI / 2
    case 'west':
      return Math.PI / 2
  }
}
