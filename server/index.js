const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const { verifyConnection, pool } = require('../src/services/db')

dotenv.config()

const app = express()
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
// Explicit preflight handler to avoid 405 from any upstream/proxies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  return next()
})
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API server is running. Use /api/* endpoints.')
})

app.get('/api/health', async (_req, res) => {
  try {
    await verifyConnection()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

app.post('/api/structure', async (req, res) => {
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

    if (!last_name || !first_name || !birth_date || !gender || !vk_link || !phone || !education || !grade || !pos || !username || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
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


