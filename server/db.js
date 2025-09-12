const dotenv = require('dotenv')
const { Pool } = require('pg')

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

function buildConnectionString() {
  if (databaseUrl && databaseUrl.length > 0) return databaseUrl
  const host = process.env.PGHOST || 'localhost'
  const port = process.env.PGPORT || '3001'
  const user = process.env.PGUSER || 'postgres'
  const password = process.env.PGPASSWORD || 'postgres'
  const db = process.env.PGDATABASE || 'yavdelemsk.db'
  return `postgresql://${user}:${password}@${host}:${port}/${db}`
}

// Assume cloud providers (DATABASE_URL present) need SSL; allow self-signed
const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: databaseUrl ? { rejectUnauthorized: false } : undefined,
})

async function verifyConnection() {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1;')
  } finally {
    client.release()
  }
}

module.exports = { pool, verifyConnection }


