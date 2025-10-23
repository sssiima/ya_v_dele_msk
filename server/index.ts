import express from 'express'
import dotenv from 'dotenv'
import { verifyConnection } from '../src/services/db'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await verifyConnection()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running`)
})


