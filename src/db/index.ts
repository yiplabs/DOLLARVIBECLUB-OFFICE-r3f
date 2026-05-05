import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

// Singleton connection — postgres-js handles pooling.
const queryClient = connectionString
  ? postgres(connectionString, { prepare: false })
  : null

export const db = queryClient
  ? drizzle(queryClient, { schema })
  : (null as unknown as ReturnType<typeof drizzle>)

export const isDbConfigured = () => Boolean(queryClient)
