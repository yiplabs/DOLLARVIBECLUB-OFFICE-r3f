import type { SupabaseClient } from '@supabase/supabase-js'

export function joinRoomChannel(
  supabase: SupabaseClient,
  roomSlug: string,
  userId: string,
) {
  return supabase.channel(`room:${roomSlug}`, {
    config: {
      broadcast: { self: false, ack: false },
      presence: { key: userId },
    },
  })
}
