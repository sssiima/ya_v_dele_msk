# Teams Migration Script

This script automatically creates and manages teams in the database when captains register.

## What it does

1. **Creates teams table** - Sets up the teams table with proper indexes
2. **Syncs existing captains** - Creates teams from existing captain registrations
3. **Updates with structure data** - Links teams to coordinators and district managers
4. **Removes duplicates** - Cleans up any duplicate team entries
5. **Creates automatic trigger** - Sets up database trigger for future captain registrations

## Usage

### Run the migration:
```bash
# JavaScript version
npm run migrate:teams

# TypeScript version (if you prefer)
npm run migrate:teams:ts
```

### Manual database commands (if needed):
```sql
-- Create teams from existing captains
INSERT INTO teams (code, name, mentor) 
SELECT team_code, team_name, mentor 
FROM members 
WHERE role = 'captain';

-- Update teams with coordinator and RO info
UPDATE teams
SET coord = s.coord,
    ro = s.ro
FROM structure s
WHERE teams.mentor IS NOT NULL
  AND (s.last_name || ' ' || s.first_name = teams.mentor
       OR s.first_name || ' ' || s.last_name = teams.mentor);

-- Remove duplicates
DELETE FROM teams 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM teams 
  GROUP BY code
);
```

## Automatic Team Creation

After running this migration, teams will be automatically created when:
- A new captain registers (INSERT into members with role='captain')
- An existing member is updated to captain role
- Team information is updated

The database trigger `trigger_sync_team_from_captain` handles this automatically.

## Database Schema

The teams table structure:
```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255),
  mentor VARCHAR(255),
  coord VARCHAR(255),
  ro VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Notes

- The script is idempotent - you can run it multiple times safely
- It preserves existing team data
- The trigger only activates for captain role changes
- Teams are linked to structure hierarchy automatically
