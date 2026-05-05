'use client'
import { useEffect, useMemo } from 'react'
import { Environment } from '@react-three/drei'
import { getRoom } from '@/lib/rooms/catalog'
import { THEMES } from '@/lib/rooms/themes'
import { buildWalkableMask } from '@/lib/rooms/grid'
import { RoomLighting } from './RoomLighting'
import { Floor } from './Floor'
import { Walls } from './Walls'
import { Furniture } from './Furniture'
import { Signs } from './Signs'
import { PostProcessing } from './PostProcessing'
import { Avatar } from '@/components/avatar/Avatar'
import { RemoteAvatar } from '@/components/avatar/RemoteAvatar'
import { AvatarShadow } from '@/components/avatar/AvatarShadow'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { useClickToMove } from '@/hooks/useClickToMove'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'
import { useRoomStore } from '@/store/roomStore'
import { useAvatarStore } from '@/store/avatarStore'

type Props = { slug: string }

export default function RoomScene({ slug }: Props) {
  useDeviceQuality()
  const meta = getRoom(slug)
  const theme = meta ? THEMES[meta.theme] : THEMES.lounge
  const mask = useMemo(() => buildWalkableMask(theme), [theme])
  const onFloorClick = useClickToMove(mask)

  const peers = useRoomStore((s) => s.peers)
  const bubbles = useRoomStore((s) => s.bubbles)

  // prune stale bubbles every second
  useEffect(() => {
    const id = window.setInterval(() => {
      useRoomStore.getState().pruneBubbles(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  // Spawn the local avatar at the room's first spawn point on mount.
  useEffect(() => {
    const [sx, sz] = theme.spawnPoints[0] ?? [theme.gridWidth / 2, theme.gridDepth - 1]
    useAvatarStore.getState().setPos([sx, sz])
    useAvatarStore.getState().setPath([])
  }, [theme])

  return (
    <>
      <RoomLighting theme={theme} />
      <Environment preset="apartment" />

      <Floor theme={theme} onFloorClick={onFloorClick} />
      <Walls theme={theme} />
      <Furniture theme={theme} />
      <Signs theme={theme} />

      <Avatar />
      {Object.values(peers).map((peer) => (
        <RemoteAvatar key={peer.userId} peer={peer} />
      ))}

      <AvatarShadow />

      {bubbles.map((b) => {
        const peer = peers[b.userId]
        const myPos = useAvatarStore.getState().pos
        const pos: [number, number, number] = peer
          ? [peer.pos[0], 2.6, peer.pos[1]]
          : [myPos[0], 2.6, myPos[1]]
        return <ChatBubble key={b.id} text={b.body} pos={pos} spawnedAt={b.spawnedAt} />
      })}

      <PostProcessing />
    </>
  )
}
