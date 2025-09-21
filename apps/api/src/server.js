import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8080
const ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(cors({ origin: ORIGIN, credentials: true }))
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }))

app.listen(PORT, () => console.log(`API listening on :${PORT}`))