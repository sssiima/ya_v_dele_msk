const { pool } = require('../server/db')

async function createTeamsTable() {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      code VARCHAR(64) NOT NULL UNIQUE,
      name VARCHAR(255),
      mentor VARCHAR(255),
      coord VARCHAR(255),
      ro VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_teams_code ON teams (code);
    CREATE INDEX IF NOT EXISTS idx_teams_mentor ON teams (mentor);
  `
  await pool.query(createQuery)
}

async function syncTeamsFromCaptains() {
  console.log('Syncing teams from captains...')
  
  // Insert teams from captains
  const insertQuery = `
    INSERT INTO teams (code, name, mentor) 
    SELECT team_code, team_name, mentor 
    FROM members 
    WHERE role = 'captain'
    ON CONFLICT (code) DO NOTHING;
  `
  await pool.query(insertQuery)
  console.log('Teams inserted from captains')
}

async function updateTeamsWithStructure() {
  console.log('Updating teams with coordinator and RO information...')
  
  // Update teams with coord and ro from structure
  const updateQuery = `
    UPDATE teams
    SET coord = s.coord,
        ro = s.ro
    FROM structure s
    WHERE teams.mentor IS NOT NULL
      AND (s.last_name || ' ' || s.first_name = teams.mentor
           OR s.first_name || ' ' || s.last_name = teams.mentor);
  `
  await pool.query(updateQuery)
  console.log('Teams updated with structure information')
}

async function removeDuplicateTeams() {
  console.log('Removing duplicate teams...')
  
  // Remove duplicates, keeping the first one
  const deleteQuery = `
    DELETE FROM teams 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM teams 
      GROUP BY code
    );
  `
  await pool.query(deleteQuery)
  console.log('Duplicate teams removed')
}

async function createTeamSyncTrigger() {
  console.log('Creating trigger for automatic team sync...')
  
  // Create function to sync teams when captain is inserted/updated
  const functionQuery = `
    CREATE OR REPLACE FUNCTION sync_team_from_captain()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Only process captain role changes
      IF NEW.role = 'captain' THEN
        -- Insert or update team
        INSERT INTO teams (code, name, mentor)
        VALUES (NEW.team_code, NEW.team_name, NEW.mentor)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          mentor = EXCLUDED.mentor,
          updated_at = NOW();
        
        -- Update with structure information
        UPDATE teams
        SET coord = s.coord,
            ro = s.ro
        FROM structure s
        WHERE teams.code = NEW.team_code
          AND teams.mentor IS NOT NULL
          AND (s.last_name || ' ' || s.first_name = teams.mentor
               OR s.first_name || ' ' || s.last_name = teams.mentor);
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `
  await pool.query(functionQuery)
  
  // Create trigger
  const triggerQuery = `
    DROP TRIGGER IF EXISTS trigger_sync_team_from_captain ON members;
    CREATE TRIGGER trigger_sync_team_from_captain
      AFTER INSERT OR UPDATE ON members
      FOR EACH ROW
      EXECUTE FUNCTION sync_team_from_captain();
  `
  await pool.query(triggerQuery)
  console.log('Team sync trigger created')
}

async function main() {
  try {
    console.log('Starting teams migration...')
    
    await createTeamsTable()
    console.log('Teams table created/verified')
    
    await syncTeamsFromCaptains()
    await updateTeamsWithStructure()
    await removeDuplicateTeams()
    
    await createTeamSyncTrigger()
    
    console.log('Teams migration completed successfully')
  } catch (err) {
    console.error('Teams migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

main()
