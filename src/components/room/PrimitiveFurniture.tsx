'use client'

export type FurnitureProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  tint?: string
  scale?: number
}

export function PrimitiveDesk({
  position,
  rotation = [0, 0, 0],
  tint = '#B8895A',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color={tint} roughness={0.6} />
      </mesh>
      {[
        [-0.7, 0.35, -0.3],
        [0.7, 0.35, -0.3],
        [-0.7, 0.35, 0.3],
        [0.7, 0.35, 0.3],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <meshStandardMaterial color="#2D2D2D" />
        </mesh>
      ))}
    </group>
  )
}

export function PrimitiveChair({
  position,
  rotation = [0, 0, 0],
  tint = '#2D2D2D',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color={tint} />
      </mesh>
      <mesh position={[0, 0.85, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.06]} />
        <meshStandardMaterial color={tint} />
      </mesh>
      {[
        [-0.2, 0.22, -0.2],
        [0.2, 0.22, -0.2],
        [-0.2, 0.22, 0.2],
        [0.2, 0.22, 0.2],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function PrimitiveCushionChair({
  position,
  rotation = [0, 0, 0],
  tint = '#FBBF24',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.55]} />
        <meshStandardMaterial color={tint} roughness={0.95} />
      </mesh>
    </group>
  )
}

export function PrimitiveSofa({
  position,
  rotation = [0, 0, 0],
  tint = '#6366F1',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.5, 0.9]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, -0.35]} castShadow>
        <boxGeometry args={[2.0, 0.6, 0.2]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[-1.0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.18, 0.5, 0.9]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[1.0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.18, 0.5, 0.9]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.6, 0.05]} castShadow>
        <boxGeometry args={[0.85, 0.15, 0.7]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.6, 0.05]} castShadow>
        <boxGeometry args={[0.85, 0.15, 0.7]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function PrimitiveSofaCorner({
  position,
  rotation = [0, 0, 0],
  tint = '#6366F1',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, -0.35]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.2]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      <mesh position={[-0.35, 0.75, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.9]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function PrimitivePlant({ position, scale = 1 }: FurnitureProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#3D2D24" roughness={0.9} />
      </mesh>
      {[
        [0, 0.6, 0, 0.3],
        [0.15, 0.75, 0.1, 0.22],
        [-0.15, 0.7, -0.1, 0.2],
        [0.1, 0.85, -0.1, 0.18],
        [-0.1, 0.65, 0.15, 0.2],
      ].map((p, i) => (
        <mesh
          key={i}
          position={[p[0], p[1], p[2]] as [number, number, number]}
          castShadow
        >
          <sphereGeometry args={[p[3], 8, 8]} />
          <meshStandardMaterial color="#4A8B3A" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export function PrimitiveSmallPlant({ position, scale = 1 }: FurnitureProps) {
  return (
    <group position={position} scale={scale * 0.7}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.24, 8]} />
        <meshStandardMaterial color="#3D2D24" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#4A8B3A" roughness={0.85} />
      </mesh>
    </group>
  )
}

export function PrimitiveMonitor({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.04, 8]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial color="#0A0A0A" />
      </mesh>
      <mesh position={[0, 0.4, 0.025]}>
        <planeGeometry args={[0.62, 0.37]} />
        <meshBasicMaterial color="#0D9488" />
      </mesh>
    </group>
  )
}

export function PrimitiveKeyboard({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.18]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.5} />
      </mesh>
    </group>
  )
}

export function PrimitiveLaptop({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.45, 0.03, 0.3]} />
        <meshStandardMaterial color="#3D3D3D" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.18, -0.13]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.02]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0, 0.18, -0.12]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>
    </group>
  )
}

export function PrimitiveLamp({ position, scale = 1 }: FurnitureProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 8]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#FFF6E0"
          emissive="#FFE5B0"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight
        position={[0, 1.4, 0]}
        color="#FFE5B0"
        intensity={0.8}
        distance={6}
        decay={2}
        castShadow
      />
    </group>
  )
}

export function PrimitiveBookshelf({
  position,
  rotation = [0, 0, 0],
  tint = '#8B6440',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2.0, 0.35]} />
        <meshStandardMaterial color={tint} roughness={0.7} />
      </mesh>
      {[0.4, 0.85, 1.3, 1.75].map((y, shelfIdx) =>
        Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={`${shelfIdx}-${i}`}
            position={[-0.35 + i * 0.14, y, 0.05]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.3, 0.15]} />
            <meshStandardMaterial
              color={['#0D9488', '#FBBF24', '#EC4899', '#8B5CF6', '#22C55E', '#F97316'][i]}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

export function PrimitiveCoffeeTable({
  position,
  tint = '#FAF9F5',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial color={tint} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#2D2D2D" metalness={0.5} />
      </mesh>
    </group>
  )
}

export function PrimitiveFridge({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.7, 0.7]} />
        <meshStandardMaterial color="#F0EAD8" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.85, 0.355]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
    </group>
  )
}

export function PrimitiveStove({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.7]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.4} metalness={0.5} />
      </mesh>
      {[
        [-0.2, 0.91, -0.15],
        [0.2, 0.91, -0.15],
        [-0.2, 0.91, 0.15],
        [0.2, 0.91, 0.15],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      ))}
    </group>
  )
}

/** Generic fallback for unmapped models — a small wood block. */
export function PrimitiveBlock({
  position,
  rotation = [0, 0, 0],
  tint = '#B8895A',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={tint} roughness={0.7} />
      </mesh>
    </group>
  )
}

export function PrimitiveTv({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stand */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#3D2D24" />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      {/* Screen frame */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.08]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      {/* Screen face — animated content */}
      <mesh position={[0, 1.2, 0.045]}>
        <planeGeometry args={[1.7, 0.92]} />
        <meshBasicMaterial color="#0D9488" />
      </mesh>
      {/* Channel logo */}
      <mesh position={[0.7, 0.85, 0.045]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>
    </group>
  )
}

export function PrimitiveVendingMachine({
  position,
  rotation = [0, 0, 0],
  tint = '#7A0E0E',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2.0, 0.7]} />
        <meshStandardMaterial color={tint} roughness={0.6} />
      </mesh>
      {/* Glass front */}
      <mesh position={[0, 1.2, 0.36]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshStandardMaterial
          color="#0F1714"
          opacity={0.6}
          transparent
          metalness={0.3}
        />
      </mesh>
      {/* Drink rows */}
      {[0.65, 1.0, 1.35, 1.7].map((y, row) =>
        [-0.2, 0, 0.2].map((x, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[x, y, 0.34]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
            <meshStandardMaterial
              color={['#0D9488', '#FBBF24', '#EC4899'][col % 3]}
            />
          </mesh>
        )),
      )}
      {/* Display */}
      <mesh position={[-0.3, 1.85, 0.36]}>
        <planeGeometry args={[0.18, 0.06]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  )
}

export function PrimitiveMug({
  position,
  rotation = [0, 0, 0],
  tint = '#F0EAD8',
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
        <meshStandardMaterial color={tint} roughness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.05, 0]} rotation-z={Math.PI / 2}>
        <torusGeometry args={[0.04, 0.012, 8, 12]} />
        <meshStandardMaterial color={tint} roughness={0.5} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.092, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.005, 16]} />
        <meshStandardMaterial color="#3D2D24" roughness={0.3} />
      </mesh>
      {/* Steam */}
      <mesh position={[0, 0.18, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.025, 0.005, 6, 12]} />
        <meshBasicMaterial color="#F0EAD8" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export function PrimitiveDartboard({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer ring */}
      <mesh castShadow>
        <torusGeometry args={[0.36, 0.04, 12, 32]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      {/* Board */}
      <mesh>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#FAF9F5" />
      </mesh>
      {/* Score wedges */}
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (i / 20) * Math.PI * 2
        const r = 0.32
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.005]}
          >
            <planeGeometry args={[0.05, r * 0.6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#1A1A1A' : '#FAF9F5'} />
          </mesh>
        )
      })}
      {/* Bullseye */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  )
}

export function PrimitiveFishTank({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: FurnitureProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stand */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 0.5]} />
        <meshStandardMaterial color="#3D2D24" />
      </mesh>
      {/* Tank */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.45]} />
        <meshStandardMaterial
          color="#0D9488"
          opacity={0.4}
          transparent
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
      {/* Frame edges */}
      {[
        [0, 0.6, 0.225],
        [0, 1.3, 0.225],
        [0, 0.6, -0.225],
        [0, 1.3, -0.225],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[1.12, 0.04, 0.04]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      ))}
      {/* Gravel */}
      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[1.05, 0.08, 0.42]} />
        <meshStandardMaterial color="#F5DEAD" />
      </mesh>
      {/* Plants */}
      <mesh position={[-0.3, 0.85, 0]}>
        <coneGeometry args={[0.06, 0.4, 5]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0.3, 0.85, 0]}>
        <coneGeometry args={[0.06, 0.35, 5]} />
        <meshStandardMaterial color="#4A8B3A" />
      </mesh>
      {/* Fish (orange ellipsoid) */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
      <mesh position={[0.06, 1.0, 0]}>
        <coneGeometry args={[0.03, 0.06, 4]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
    </group>
  )
}

export function PrimitiveCouch({
  position,
  rotation = [0, 0, 0],
  tint = '#D97706',
  scale = 1,
}: FurnitureProps) {
  // Wider, more "lounge"-styled sofa variant
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.55, 1.0]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.85, -0.4]} castShadow>
        <boxGeometry args={[2.4, 0.6, 0.22]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0]} castShadow>
          <boxGeometry args={[0.18, 0.5, 1.0]} />
          <meshStandardMaterial color={tint} roughness={0.85} />
        </mesh>
      ))}
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 0.05]} castShadow>
          <boxGeometry args={[0.7, 0.16, 0.7]} />
          <meshStandardMaterial color={tint} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export function PrimitiveRug({
  position,
  rotation = [0, 0, 0],
  tint = '#0D9488',
  scale = 1,
}: FurnitureProps) {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      rotation-y={rotation[1]}
      position={[position[0], 0.011, position[2]]}
      receiveShadow
      scale={scale}
    >
      <planeGeometry args={[1.6, 1.2]} />
      <meshStandardMaterial color={tint} roughness={0.85} />
    </mesh>
  )
}
