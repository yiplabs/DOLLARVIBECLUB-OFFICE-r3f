import { eq } from 'drizzle-orm'
import { db } from './index'
import { profiles, rooms, type Profile } from './schema'
import type { AvatarConfig } from '@/lib/avatar/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!db) return null
  const [row] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1)
  return row ?? null
}

export async function updateProfile(
  userId: string,
  patch: Partial<{
    displayName: string
    workingOn: string
    avatarConfig: AvatarConfig
    status: string
  }>,
) {
  if (!db) return null
  const [row] = await db
    .update(profiles)
    .set(patch)
    .where(eq(profiles.id, userId))
    .returning()
  return row
}

export async function listRooms() {
  if (!db) return []
  return db.select().from(rooms)
}

export async function getRoomBySlug(slug: string) {
  if (!db) return null
  const [row] = await db.select().from(rooms).where(eq(rooms.slug, slug)).limit(1)
  return row ?? null
}
