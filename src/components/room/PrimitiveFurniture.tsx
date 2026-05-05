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
