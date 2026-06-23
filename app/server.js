const express = require('express')
const path = require('path')

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const users = [
  {
    id: 1,
    email: 'qa@stream.local',
    password: 'Qwerty123!',
    name: 'QA Engineer'
  }
]

const catalog = [
  {
    id: 'stream-101',
    title: 'Ocean Depths VR',
    category: 'Documentary',
    status: 'online',
    quality: '4K',
    viewers: 1240
  },
  {
    id: 'stream-102',
    title: 'Mars Station 360',
    category: 'Science',
    status: 'online',
    quality: '8K',
    viewers: 845
  },
  {
    id: 'stream-103',
    title: 'City Live',
    category: 'Travel',
    status: 'maintenance',
    quality: '4K',
    viewers: 0
  }
]

const favorites = new Set()

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'streamqa-demo', timestamp: new Date().toISOString() })
})

app.post('/api/login', async (req, res) => {
  await delay(150)
  const { email, password } = req.body || {}
  const user = users.find((item) => item.email === email && item.password === password)

  if (!email || !password) {
    return res
      .status(400)
      .json({ code: 'VALIDATION_ERROR', message: 'Email and password are required' })
  }

  if (!user) {
    return res
      .status(401)
      .json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' })
  }

  return res.json({
    token: 'demo-token-qa',
    user: { id: user.id, email: user.email, name: user.name }
  })
})

app.get('/api/catalog', async (req, res) => {
  await delay(100)
  const query = String(req.query.q || '')
    .toLowerCase()
    .trim()
  const status = String(req.query.status || '')
    .toLowerCase()
    .trim()

  let result = catalog

  if (query) {
    result = result.filter((item) => item.title.toLowerCase().includes(query))
  }

  if (status) {
    result = result.filter((item) => item.status === status)
  }

  res.json({ items: result, total: result.length })
})

app.get('/api/streams/:id', (req, res) => {
  const stream = catalog.find((item) => item.id === req.params.id)

  if (!stream) {
    return res.status(404).json({ code: 'STREAM_NOT_FOUND', message: 'Stream not found' })
  }

  return res.json(stream)
})

app.post('/api/favorites', (req, res) => {
  const { streamId } = req.body || {}
  const stream = catalog.find((item) => item.id === streamId)

  if (!streamId) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'streamId is required' })
  }

  if (!stream) {
    return res.status(404).json({ code: 'STREAM_NOT_FOUND', message: 'Stream not found' })
  }

  favorites.add(streamId)
  return res.status(201).json({ streamId, favorite: true })
})

app.delete('/api/favorites/:streamId', (req, res) => {
  favorites.delete(req.params.streamId)
  return res.status(204).send()
})

app.get('/api/favorites', (req, res) => {
  const items = catalog.filter((item) => favorites.has(item.id))
  return res.json({ items, total: items.length })
})

app.post('/api/test/reset', (req, res) => {
  favorites.clear()
  return res.status(204).send()
})

app.use('/api', (req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Endpoint not found' })
})

app.listen(port, () => {
  console.log(`StreamQA demo is running on http://localhost:${port}`)
})
