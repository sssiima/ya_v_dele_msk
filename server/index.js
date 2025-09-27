const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const { verifyConnection, pool } = require('./db')

dotenv.config()

const app = express()


// Обработчик для всех OPTIONS запросов - должен быть первым
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(`OPTIONS request to: ${req.url}`)
    console.log('Headers:', req.headers)
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
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`)
  
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
    console.error('Upload error:', error)
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
    console.log('GET /api/vuses requested');
    
    const client = await pool.connect();
    const result = await client.query('SELECT id, vus FROM vuses ORDER BY vus');
    client.release();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
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
    console.log('🔍 GET /api/mentors requested');
    
    client = await pool.connect();
    
    // Запрос для получения наставников
    const result = await client.query(`
      SELECT 
        id,
        first_name,
        last_name,
        CONCAT(first_name, ' ', last_name) as full_name,
        pos
      FROM structure 
      WHERE pos IN ('наставник', 'старший наставник')
      ORDER BY first_name, last_name
    `);
    
    console.log(`✅ Found ${result.rows.length} mentors`);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (client) client.release();
  }
});


app.post('/api/structure', async (req, res) => {
  try {
    console.log('Received structure registration request:', JSON.stringify(req.body, null, 2))
    
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
      console.log('Missing required fields:', missingFields)
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
    console.error('POST /api/structure error', err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


