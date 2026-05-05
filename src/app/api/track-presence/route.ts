import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db, isDbConfigured } from '@/db'
import { roomPresence, rooms } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

/**
 * 10s heartbeat — clients POST { roomSlug, posX, posZ, facing }.
 * Persists last-known position so we can show "where you were last seen".
 */
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: false }, { status: 200 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 200 })

  const body = (await req.json().catch(() => null)) as null | {
    roomSlug: string
    posX: number
    posZ: number
    facing?: string
  }
  if (!body) return NextResponse.json({ ok: false }, { status: 400 })

  const [room] = await db.select().from(rooms).where(eq(rooms.slug, body.roomSlug)).limit(1)
  if (!room) return NextResponse.json({ ok: false }, { status: 404 })

  await db
    .insert(roomPresence)
    .values({
      roomId: room.id,
      userId: user.id,
      posX: Math.round(body.posX),
      posZ: Math.round(body.posZ),
      facing: body.facing ?? 'south',
    })
    .onConflictDoUpdate({
      target: [roomPresence.roomId, roomPresence.userId],
      set: {
        posX: Math.round(body.posX),
        posZ: Math.round(body.posZ),
        facing: body.facing ?? 'south',
        lastSeen: sql`now()`,
      },
    })

  return NextResponse.json({ ok: true })
}
