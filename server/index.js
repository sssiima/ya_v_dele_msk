const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const router = express.Router();
const { verifyConnection, pool } = require('./db')

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
    
    // Запрос для получения наставников без дублей по ФИ (distinct по имени/фамилии)
    const result = await client.query(`
      SELECT DISTINCT ON (first_name, last_name)
        id,
        first_name,
        last_name,
        CONCAT(first_name, ' ', last_name) as full_name,
        pos
      FROM structure
      WHERE pos IN ('наставник', 'старший наставник')
      ORDER BY first_name, last_name, id
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
        mentor, team_code, team_name, role, privacy_policy
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const values = [
      last_name, first_name, patronymic, birth_date, gender, vk_link, phone,
      education, level, grade, format, faculty, specialty, username, password_hash,
      mentor, team_code, team_name, role, privacy_policy
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Участник успешно зарегистрирован',
      data: result.rows[0]
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

const port = process.env.PORT || 3001
app.listen(port, () => {
  // server started
})


