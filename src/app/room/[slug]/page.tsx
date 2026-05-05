import { notFound } from 'next/navigation'
import { getRoom } from '@/lib/rooms/catalog'
import RoomPageClient from '@/components/room/RoomPageClient'

type Params = Promise<{ slug: string }>

export default async function RoomPage({ params }: { params: Params }) {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) notFound()
  return <RoomPageClient slug={slug} />
}

export function generateStaticParams() {
  return [
    { slug: 'lounge' },
    { slug: 'deep-focus' },
    { slug: 'the-arena' },
    { slug: 'brainstorm' },
    { slug: 'the-stage' },
    { slug: 'mentor-row' },
  ]
}
