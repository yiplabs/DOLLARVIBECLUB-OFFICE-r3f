import {
  pgSchema,
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'

// Reference Supabase's auth.users without managing it (Supabase owns this schema).
const authSchema = pgSchema('auth')
export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  handle: text('handle').notNull().unique(),
  displayName: text('display_name').notNull(),
  workingOn: text('working_on'),
  status: text('status').notNull().default('online'),
  // jsonb shape: AvatarConfig from src/lib/avatar/types.ts
  avatarConfig: jsonb('avatar_config'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  theme: text('theme').notNull(),
  capacity: integer('capacity').notNull().default(50),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const roomPresence = pgTable(
  'room_presence',
  {
    roomId: uuid('room_id')
      .notNull()
      .references(() => rooms.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    posX: integer('pos_x').notNull().default(0),
    posZ: integer('pos_z').notNull().default(0),
    facing: text('facing').notNull().default('south'),
    lastSeen: timestamp('last_seen').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.userId] })],
)

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  pitch: text('pitch').notNull(),
  stack: text('stack').array(),
  lookingFor: text('looking_for'),
  isOpen: boolean('is_open').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Room = typeof rooms.$inferSelect
export type RoomPresence = typeof roomPresence.$inferSelect
export type Project = typeof projects.$inferSelect
