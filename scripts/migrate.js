const { pool } = require('../server/db')

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
      education VARCHAR(255) NOT NULL,
      grade VARCHAR(64) NOT NULL, 
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

async function createMembersTable() {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      last_name VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      patronymic VARCHAR(255),
      birth_date DATE NOT NULL,
      gender CHAR(1) NOT NULL,
      vk_link TEXT NOT NULL,
      phone TEXT NOT NULL,
      education VARCHAR(255),
      level VARCHAR(64),
      grade VARCHAR(64),
      format VARCHAR(64),
      faculty VARCHAR(255),
      specialty VARCHAR(255),
      username VARCHAR(320) NOT NULL,
      password_hash TEXT NOT NULL,
      mentor VARCHAR(255) NOT NULL,
      team_code VARCHAR(64) NOT NULL,
      team_name VARCHAR(255),
      role VARCHAR(16) NOT NULL CHECK (role IN ('member','captain')),
      privacy_policy BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_members_username_unique ON members (username);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_members_team_code_captain_unique ON members (team_code) WHERE role = 'captain';
  `
  await pool.query(createQuery)
}

async function alterMembersTableForPasswordHash() {
  // Добавляем недостающую колонку password_hash, если ее нет (без NOT NULL, чтобы не падало на существующих строках)
  const alterQuery = `
    ALTER TABLE members
    ADD COLUMN IF NOT EXISTS password_hash TEXT;
  `
  await pool.query(alterQuery)
}

async function main() {
  try {
    await createStructureTable()
    await createMembersTable()
    await alterMembersTableForPasswordHash()
    // migration completed
  } catch (err) {
    // migration failed
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

main()


