import { pool } from '../src/services/db'

async function ensureDatabase() {
  // Database must already exist for a pooled connection string.
  // Optionally, instruct users to create DB manually if connection fails.
}

async function createStructureTable() {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS structure (
      id SERIAL PRIMARY KEY,
      last_name VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      patronymic VARCHAR(255),
      birth_date DATE NOT NULL,
      gender CHAR(1) NOT NULL,
      vk_link TEXT NOT NULL,
      phone TEXT NOT NULL,
      grade VARCHAR(64) NOT NULL, 
      education VARCHAR(255) NOT NULL,
      photo_url TEXT,
      pos VARCHAR(64) NOT NULL,
      username VARCHAR(320) NOT NULL,
      password_hash TEXT NOT NULL,
      high_mentor VARCHAR(255),
      coord VARCHAR(255),
      ro VARCHAR(255),
      privacy_policy BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_structure_username ON structure (username);
  `
  await pool.query(createQuery)
}

async function main() {
  try {
    await ensureDatabase()
    await createStructureTable()
    console.log('Migration completed successfully')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

void main()


