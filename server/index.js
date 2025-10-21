const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const router = express.Router();
const { verifyConnection, pool } = require('./db')

async function ensureTeamsTable() {
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

dotenv.config()

const app = express()


// Обработчик для всех OPTIONS запросов - должен быть первым
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // CORS preflight handled
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    return res.status(200).end()
  }
  next()
})

// Глобальный обработчик CORS для всех остальных запросов
app.use((req, res, next) => {
  // request received
  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  next()
})
app.use(express.json())


app.get('/', (_req, res) => {
  res.send('API server is running. Use /api/* endpoints.')
})

app.get('/api', (_req, res) => {
  res.json({ message: 'API is running', endpoints: ['/api/health', '/api/structure', '/api/test'] })
})

// Тестовый эндпоинт для проверки CORS
app.get('/api/test', (_req, res) => {
  res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() })
})

// Эндпоинт для загрузки фото (заглушка)
app.post('/api/upload', (req, res) => {
  try {
    // Временно возвращаем заглушку для фото
    const photoUrl = '/placeholder-photo.jpg'
    res.json({ success: true, photoUrl })
  } catch (error) {
    // upload error
    res.status(500).json({ success: false, message: 'Ошибка загрузки файла' })
  }
})

app.get('/api/health', async (_req, res) => {
  try {
    await verifyConnection()
    await ensureTeamsTable()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

app.get('/api/vuses', async (req, res) => {
  try {
    // vuses requested
    
    const client = await pool.connect();
    const result = await client.query('SELECT id, vus FROM vuses ORDER BY vus');
    client.release();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    // db error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// routes/mentors.js или в server.js
app.get('/api/mentors', async (req, res) => {
  let client;
  try {
    // mentors requested
    client = await pool.connect();
    // Запрос для получения всех наставников и старших наставников без сортировки/дедупликации
    const result = await client.query(`
      SELECT 
        id,
        first_name,
        last_name,
        CONCAT(first_name, ' ', last_name) as full_name,
        pos
      FROM structure
      WHERE pos IN ('наставник', 'старший наставник')
    `);
    
    // mentors count
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    // db error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (client) client.release();
  }
});

// server/routes/members.js


// POST /api/members - создание нового участника
router.post('/', async (req, res) => {
  try {
    const {
      last_name,
      first_name,
      patronymic,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      level,
      grade,
      format,
      faculty,
      specialty,
      username,
      password,
      mentor,
      team_code,
      team_name,
      role,
      privacy_policy
    } = req.body;

    // Проверка обязательных полей
    if (!last_name || !first_name || !patronymic || !birth_date || !gender || 
        !vk_link || !phone || !username || !password || !mentor || !team_code || 
        !role || privacy_policy === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Все обязательные поля должны быть заполнены' 
      });
    }

    // Проверка уникальности email (username)
    const existingMember = await pool.query(
      'SELECT id FROM members WHERE username = $1',
      [username]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Валидация team_code
    if (role === 'captain') {
      // Для капитана: код команды должен быть уникальным
      const existingCode = await pool.query(
        'SELECT id FROM members WHERE team_code = $1',
        [team_code]
      );
      if (existingCode.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Этот код команды уже используется'
        });
      }
      // Капитан должен указать название команды
      if (!team_name || team_name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Название команды обязательно для капитана'
        });
      }
    } else if (role === 'member') {
      // Для участника: код команды должен существовать у капитана
      const captainWithCode = await pool.query(
        "SELECT id FROM members WHERE team_code = $1 AND role = 'captain'",
        [team_code]
      );
      if (captainWithCode.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Неверный код команды. Обратитесь к капитану за правильным кодом'
        });
      }
    }

    // Хеширование пароля
    const password_hash = await bcrypt.hash(password, 10);

    // Вставка данных в базу (храним только password_hash)
    const query = `
      INSERT INTO members (
        last_name, first_name, patronymic, birth_date, gender, vk_link, phone,
        education, level, grade, format, faculty, specialty, username, password_hash,
        mentor, team_code, team_name, role, privacy_policy, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, COALESCE($21::timestamptz, NOW()))
      RETURNING *
    `;

    const values = [
      last_name, first_name, patronymic, birth_date, gender, vk_link, phone,
      education, level, grade, format, faculty, specialty, username, password_hash,
      mentor, team_code, team_name, role, privacy_policy, req.body?.created_at || null
    ];

    const result = await pool.query(query, values);
    const created = result.rows[0]

    // Если зарегистрирован капитан, создаем/обновляем запись в teams
    if (role === 'captain') {
      try {
        await ensureTeamsTable()
        // Upsert команды по коду
        await pool.query(
          `INSERT INTO teams (code, name, mentor)
           VALUES ($1, $2, $3)
           ON CONFLICT (code) DO UPDATE SET
             name = EXCLUDED.name,
             mentor = EXCLUDED.mentor,
             updated_at = NOW()`,
          [team_code, team_name, mentor]
        )

        // Обновляем coord и ro из таблицы structure на основании ФИО наставника
        await pool.query(
          `UPDATE teams
             SET coord = s.coord,
                 ro = s.ro
           FROM structure s
           WHERE teams.code = $1
             AND teams.mentor IS NOT NULL
             AND (s.last_name || ' ' || s.first_name = teams.mentor
               OR s.first_name || ' ' || s.last_name = teams.mentor)`,
          [team_code]
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to upsert team for captain:', e)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Участник успешно зарегистрирован',
      data: created
    });

  } catch (error) {
    // error
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании участника'
    });
  }
});

module.exports = router;

// Подключаем роутер участников
app.use('/api/members', router)

// GET /api/members - получить список участников
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        level,
        grade,
        format,
        faculty,
        specialty,
        username,
        mentor,
        team_code,
        team_name,
        role,
        created_at
      FROM members
      ORDER BY created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/members/:id - получить участника по id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT id, last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, level, grade, format, faculty, specialty, username, mentor, team_code, team_name, role, created_at FROM members WHERE id = $1`,
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: result.rows[0] })
  } catch (_e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// PUT /api/members/:id - обновить данные участника
router.put('/:id', async (req, res) => {
  const allowedFields = [
    'last_name',
    'first_name',
    'patronymic',
    'birth_date',
    'gender',
    'vk_link',
    'phone',
    'education',
    'level',
    'grade',
    'format',
    'faculty',
    'specialty',
    'username',
    'team_name'
  ]

  try {
    const { id } = req.params
    const incoming = req.body || {}

    // Собираем динамический UPDATE только по разрешённым полям
    const setClauses = []
    const values = []
    let idx = 1
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        setClauses.push(`${key} = $${idx}`)
        values.push(incoming[key])
        idx += 1
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    }

    const updateQuery = `
      UPDATE members
      SET ${setClauses.join(', ')}
      WHERE id = $${idx}
      RETURNING id, last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, level, grade, format, faculty, specialty, username, mentor, team_code, team_name, role, created_at
    `
    values.push(id)

    const result = await pool.query(updateQuery, values)
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Простая авторизация участников: POST /api/auth/member-login
app.post('/api/auth/member-login', async (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' })
    const result = await pool.query('SELECT id, password_hash FROM members WHERE username = $1', [username])
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, result.rows[0].password_hash || '')
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    // Возвращаем id участника; храните его в localStorage на фронте
    return res.json({ success: true, data: { id: result.rows[0].id } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Простая авторизация структуры: POST /api/auth/structure-login
app.post('/api/auth/structure-login', async (req, res) => {
  try {
    let { username, password } = req.body || {}
    if (typeof username === 'string') username = username.trim()
    if (typeof password === 'string') password = password.trim()
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' })

    const result = await pool.query(
      'SELECT ctid::text as ctid, password_hash FROM structure WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username]
    )
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const row = result.rows[0]
    const ok = await bcrypt.compare(password, row.password_hash || '')

    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    return res.json({ success: true, data: { ctid: row.ctid } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// POST /api/auth/check-username - проверка наличия username в members или structure
app.post('/api/auth/check-username', async (req, res) => {
  try {
    const { username } = req.body || {}
    if (!username) return res.status(400).json({ success: false, message: 'Missing username' })

    const [mem, str] = await Promise.all([
      pool.query('SELECT 1 FROM members WHERE username = $1 LIMIT 1', [username]),
      pool.query('SELECT 1 FROM structure WHERE username = $1 LIMIT 1', [username])
    ])

    let foundIn = null
    if (mem.rows.length > 0) foundIn = 'member'
    if (str.rows.length > 0) foundIn = foundIn ? 'both' : 'structure'

    return res.json({ success: true, data: { foundIn } })
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
})


app.post('/api/structure', async (req, res) => {
  try {
    // structure registration request received
    
    const {
      last_name,
      first_name,
      patronymic,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      grade,
      photo_url,
      pos,
      username,
      password,
      high_mentor,
      coord,
      ro,
      privacy_policy,
    } = req.body || {}

    // Проверяем каждое поле отдельно для лучшей диагностики
    const missingFields = []
    if (!last_name) missingFields.push('last_name')
    if (!first_name) missingFields.push('first_name')
    if (!birth_date) missingFields.push('birth_date')
    if (!gender) missingFields.push('gender')
    if (!vk_link) missingFields.push('vk_link')
    if (!phone) missingFields.push('phone')
    if (!education) missingFields.push('education')
    if (!grade) missingFields.push('grade')
    if (!pos) missingFields.push('pos')
    if (!username) missingFields.push('username')
    if (!password) missingFields.push('password')
    if (privacy_policy === undefined || privacy_policy === null) missingFields.push('privacy_policy')

    if (missingFields.length > 0) {
      // missing fields
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields', 
        missingFields: missingFields 
      })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const insertQuery = `
      INSERT INTO structure (
        last_name, first_name, patronymic, birth_date, gender, vk_link, phone, education, grade, photo_url, pos,
        username, password_hash, high_mentor, coord, ro, privacy_policy
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING id
    `
    const values = [
      last_name,
      first_name,
      patronymic || null,
      birth_date,
      gender,
      vk_link,
      phone,
      education,
      grade,
      photo_url || null,
      pos,
      username,
      password_hash,
      high_mentor || null,
      coord || null,
      ro || null,
      Boolean(privacy_policy),
    ]

    const result = await pool.query(insertQuery, values)
    return res.status(201).json({ success: true, data: { id: result.rows[0].id } })
  } catch (err) {
    // server error
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/structure - получить список зарегистрированных в структуре
app.get('/api/structure', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        created_at
      FROM structure
      ORDER BY created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (_error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/structure/by-ctid/:ctid - получить запись структуры по ctid
app.get('/api/structure/by-ctid/:ctid', async (req, res) => {
  try {
    const { ctid } = req.params
    const result = await pool.query(
      `SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        level,
        faculty,
        format,
        specialty,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        created_at
      FROM structure WHERE ctid::text = $1`,
      [ctid]
    )
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/structure/:id - получить запись структуры по id
app.get('/api/structure/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT 
        id,
        last_name,
        first_name,
        patronymic,
        birth_date,
        gender,
        vk_link,
        phone,
        education,
        grade,
        level,
        faculty,
        format,
        specialty,
        pos,
        username,
        high_mentor,
        coord,
        ro,
        created_at
      FROM structure WHERE id = $1`, [id])
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/structure/:id - обновить запись структуры
app.put('/api/structure/:id', async (req, res) => {
  try {
    const { id } = req.params
    const allowed = ['last_name','first_name','patronymic','birth_date','gender','vk_link','phone','education','grade','level','faculty','format','specialty','photo_url','pos','username','high_mentor','coord','ro']
    const incoming = req.body || {}
    const set = []
    const values = []
    let i = 1
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        set.push(`${key} = $${i}`)
        values.push(incoming[key])
        i++
      }
    }
    if (set.length === 0) return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    const q = `UPDATE structure SET ${set.join(', ')} WHERE id = $${i} RETURNING id`
    values.push(id)
    const result = await pool.query(q, values)
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// PUT /api/structure/by-ctid/:ctid - обновить запись структуры по ctid
app.put('/api/structure/by-ctid/:ctid', async (req, res) => {
  try {
    const { ctid } = req.params
    console.log('Updating structure by ctid:', ctid, 'with data:', req.body)
    const allowed = ['last_name','first_name','patronymic','birth_date','gender','vk_link','phone','education','grade','level','faculty','format','specialty','photo_url','pos','username','high_mentor','coord','ro']
    const incoming = req.body || {}
    const set = []
    const values = []
    let i = 1
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        set.push(`${key} = $${i}`)
        values.push(incoming[key])
        i++
      }
    }
    if (set.length === 0) return res.status(400).json({ success: false, message: 'No updatable fields provided' })
    const q = `UPDATE structure SET ${set.join(', ')} WHERE ctid::text = $${i} RETURNING ctid::text as ctid`
    values.push(ctid)
    console.log('Query:', q, 'Values:', values)
    const result = await pool.query(q, values)
    console.log('Update result:', result.rows)
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error updating structure by ctid:', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// API для команд
// GET /api/teams - получить все команды
app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY name')
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching teams:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/teams/:id - получить команду по ID
app.get('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM teams WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error fetching team:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/teams/by-mentor/:mentorName - получить команды по имени наставника
app.get('/api/teams/by-mentor/:mentorName', async (req, res) => {
  try {
    const { mentorName } = req.params
    const decodedMentorName = decodeURIComponent(mentorName)
    
    // Ищем команды где mentor совпадает с именем (с учетом возможных вариантов ФИО)
    const result = await pool.query(`
      SELECT * FROM teams 
      WHERE mentor ILIKE $1 OR mentor ILIKE $2
      ORDER BY name
    `, [`%${decodedMentorName}%`, `%${decodedMentorName.split(' ').reverse().join(' ')}%`])
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching teams by mentor:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// GET /api/members/by-team-code/:teamCode - получить участников команды по коду команды
app.get('/api/members/by-team-code/:teamCode', async (req, res) => {
  try {
    const { teamCode } = req.params
    const decodedTeamCode = decodeURIComponent(teamCode)
    
    const result = await pool.query(`
      SELECT id, last_name, first_name, patronymic, team_code
      FROM members 
      WHERE team_code = $1
      ORDER BY last_name, first_name
    `, [decodedTeamCode])
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error fetching team members:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  // server started
})


