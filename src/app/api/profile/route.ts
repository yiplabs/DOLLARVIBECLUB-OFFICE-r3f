import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProfile, updateProfile } from '@/db/queries'
import type { AvatarConfig } from '@/lib/avatar/types'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ profile: null }, { status: 200 })
  const profile = await getProfile(user.id)
  return NextResponse.json({ profile })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    // Guest mode — accept silently so the client-side localStorage save still flows.
    return NextResponse.json({ ok: true, persisted: false })
  }

  const body = (await req.json().catch(() => ({}))) as Partial<{
    displayName: string
    workingOn: string
    avatarConfig: AvatarConfig
  }>

  const updated = await updateProfile(user.id, {
    ...(body.displayName ? { displayName: body.displayName } : {}),
    ...(body.workingOn !== undefined ? { workingOn: body.workingOn } : {}),
    ...(body.avatarConfig ? { avatarConfig: body.avatarConfig } : {}),
  })
  return NextResponse.json({ ok: true, persisted: true, profile: updated })
}
