'use client'
import type { ComponentType } from 'react'
import type { FurniturePlacement, RoomTheme } from '@/lib/rooms/themes'
import { gridToWorld } from '@/lib/rooms/grid'
import {
  type FurnitureProps,
  PrimitiveBlock,
  PrimitiveBookshelf,
  PrimitiveChair,
  PrimitiveCoffeeTable,
  PrimitiveCushionChair,
  PrimitiveDesk,
  PrimitiveFridge,
  PrimitiveKeyboard,
  PrimitiveLamp,
  PrimitiveLaptop,
  PrimitiveMonitor,
  PrimitivePlant,
  PrimitiveSmallPlant,
  PrimitiveSofa,
  PrimitiveSofaCorner,
  PrimitiveStove,
} from './PrimitiveFurniture'

const FURNITURE_MAP: Record<string, ComponentType<FurnitureProps>> = {
  desk: PrimitiveDesk,
  deskCorner: PrimitiveDesk,
  chairDesk: PrimitiveChair,
  chairCushion: PrimitiveCushionChair,
  loungeSofa: PrimitiveSofa,
  loungeSofaCorner: PrimitiveSofaCorner,
  pottedPlant: PrimitivePlant,
  plantSmall: PrimitiveSmallPlant,
  computerScreen: PrimitiveMonitor,
  computerKeyboard: PrimitiveKeyboard,
  laptop: PrimitiveLaptop,
  lampSquareTable: PrimitiveLamp,
  bookcaseClosed: PrimitiveBookshelf,
  bookcaseOpen: PrimitiveBookshelf,
  coffeeTable: PrimitiveCoffeeTable,
  kitchenFridge: PrimitiveFridge,
  kitchenStove: PrimitiveStove,
}

function placementToWorld(p: FurniturePlacement): [number, number, number] {
  return [gridToWorld(p.position[0]), 0, gridToWorld(p.position[1])]
}

function placementYaw(p: FurniturePlacement): [number, number, number] {
  return [0, ((p.rotation ?? 0) * Math.PI) / 180, 0]
}

export function Furniture({ theme }: { theme: RoomTheme }) {
  return (
    <group>
      {theme.furniture.map((p, i) => {
        const Comp = FURNITURE_MAP[p.model] ?? PrimitiveBlock
        return (
          <Comp
            key={`${p.model}-${i}`}
            position={placementToWorld(p)}
            rotation={placementYaw(p)}
            tint={p.tint}
            scale={p.scale ?? 1}
          />
        )
      })}
    </group>
  )
}
