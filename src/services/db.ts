import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

function buildConnectionString(): string {
  if (databaseUrl && databaseUrl.length > 0) return databaseUrl
  const host = process.env.PGHOST || 'localhost'
  const port = process.env.PGPORT || '3001'
  const user = process.env.PGUSER || 'postgres'
  const password = process.env.PGPASSWORD || 'postgres'
  const db = process.env.PGDATABASE || 'yavdelemsk.db'
  return `postgresql://${user}:${password}@${host}:${port}/${db}`
}

export const pool = new Pool({ connectionString: buildConnectionString() })

export async function verifyConnection(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1;')
  } finally {
    client.release()
  }
}


