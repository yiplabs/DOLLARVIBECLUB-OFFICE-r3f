'use client'
import { useEffect, useMemo, useState } from 'react'
import { getRoom } from '@/lib/rooms/catalog'
import { THEMES } from '@/lib/rooms/themes'
import { buildWalkableMask, gridToWorld } from '@/lib/rooms/grid'
import { RoomLighting } from './RoomLighting'
import { Floor } from './Floor'
import { Walls } from './Walls'
import { Furniture } from './Furniture'
import { Signs } from './Signs'
import { PostProcessing } from './PostProcessing'
import { AmbientParticles } from './AmbientParticles'
import { Whiteboard } from './Whiteboard'
import { ProjectBoard } from './ProjectBoard'
import { StageSpotlight } from './StageSpotlight'
import { Avatar } from '@/components/avatar/Avatar'
import { Pet } from '@/components/avatar/Pet'
import { NpcAvatar } from '@/components/avatar/NpcAvatar'
import { RemoteAvatar } from '@/components/avatar/RemoteAvatar'
import { FootstepDust } from '@/components/avatar/FootstepDust'
import { NPCS } from '@/lib/rooms/npcs'
import { useSitDetection } from '@/hooks/useSitDetection'
import { useSettingsStore } from '@/store/settingsStore'
import { AvatarShadow } from '@/components/avatar/AvatarShadow'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { CameraRig } from '@/components/world/CameraRig'
import { AnimatedDoor } from '@/components/world/AnimatedDoor'
import { useClickToMove } from '@/hooks/useClickToMove'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'
import { useRoomStore, type Peer } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'

type Props = {
  slug: string
  onSelectSelf?: () => void
  onSelectPeer?: (peer: Peer) => void
}

export default function RoomScene({ slug, onSelectSelf, onSelectPeer }: Props) {
  useDeviceQuality()
  const meta = getRoom(slug)
  const theme = meta ? THEMES[meta.theme] : THEMES.lounge
  const themeKey = meta?.theme ?? 'lounge'
  const mask = useMemo(() => buildWalkableMask(theme), [theme])
  const onFloorClick = useClickToMove(mask)
  useSitDetection(theme, true)

  const peers = useRoomStore((s) => s.peers)
  const bubbles = useRoomStore((s) => s.bubbles)
  const petEnabled = useSettingsStore((s) => s.petEnabled)

  // Spawn synchronously before Avatar mounts.
  useState(() => {
    const [sx, sz] = theme.spawnPoints[0] ?? [theme.gridWidth / 2, theme.gridDepth - 1]
    useAvatarStore.getState().setPos([sx, sz])
    useAvatarStore.getState().setPath([])
    return true
  })

  // prune stale bubbles every second
  useEffect(() => {
    const id = window.setInterval(() => {
      useRoomStore.getState().pruneBubbles(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const particleBounds = useMemo(
    () => ({
      x: [0.5, theme.gridWidth - 0.5] as [number, number],
      y: [0.5, 4] as [number, number],
      z: [0.5, theme.gridDepth - 0.5] as [number, number],
    }),
    [theme],
  )

  return (
    <>
      <RoomLighting theme={theme} />
      <CameraRig offset={[14, 14, 14]} damping={3} />

      <Floor theme={theme} onFloorClick={onFloorClick} />
      <Walls theme={theme} />
      <Furniture theme={theme} />
      <Signs theme={theme} />

      <AnimatedDoor
        position={[gridToWorld(theme.gridWidth) / 2, 0, gridToWorld(theme.gridDepth)]}
      />

      <AmbientParticles
        count={themeKey === 'focus' ? 30 : 60}
        bounds={particleBounds}
        color={theme.sunColor}
      />

      {/* Per-theme decorations */}
      {themeKey === 'lounge' && (
        <ProjectBoard
          position={[7, 0]}
          wall="north"
          gridWidth={theme.gridWidth}
          gridDepth={theme.gridDepth}
        />
      )}

      {/* NPCs for the current theme */}
      {NPCS[themeKey].map((npc, i) => (
        <NpcAvatar key={`${themeKey}-npc-${i}`} {...npc} />
      ))}
      {themeKey === 'brainstorm' && (
        <Whiteboard
          position={[7, 0]}
          wall="north"
          gridWidth={theme.gridWidth}
          gridDepth={theme.gridDepth}
        />
      )}
      {themeKey === 'stage' && (
        <>
          <StageSpotlight
            position={[gridToWorld(7), 4.8, gridToWorld(2)]}
            color="#FBBF24"
          />
          <StageSpotlight
            position={[gridToWorld(5), 4.8, gridToWorld(2)]}
            color="#EC4899"
          />
          <StageSpotlight
            position={[gridToWorld(9), 4.8, gridToWorld(2)]}
            color="#3B82F6"
          />
        </>
      )}

      <Avatar onSelect={onSelectSelf} />
      <FootstepDust />
      {petEnabled && <Pet />}
      {Object.values(peers).map((peer) => (
        <RemoteAvatar
          key={peer.userId}
          peer={peer}
          onSelect={(p) => onSelectPeer?.(p)}
        />
      ))}

      <AvatarShadow />

      {bubbles.map((b) => {
        const peer = peers[b.userId]
        const myPos = useAvatarStore.getState().pos
        const pos: [number, number, number] = peer
          ? [peer.pos[0], 2.6, peer.pos[1]]
          : [myPos[0], 2.6, myPos[1]]
        return (
          <ChatBubble key={b.id} text={b.body} pos={pos} spawnedAt={b.spawnedAt} />
        )
      })}

      <PostProcessing />
    </>
  )
}
