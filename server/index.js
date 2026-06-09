import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data', 'projects.json')

const app = express()
app.use(cors())
app.use(express.json())

function readProjects() {
  if (!existsSync(DATA_FILE)) return []
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}

function writeProjects(projects) {
  writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2))
}

app.get('/api/projects', (req, res) => {
  res.json(readProjects())
})

app.post('/api/projects', (req, res) => {
  const projects = readProjects()
  const project = { id: randomUUID(), ...req.body, createdAt: new Date().toISOString() }
  projects.push(project)
  writeProjects(projects)
  res.status(201).json(project)
})

app.put('/api/projects/:id', (req, res) => {
  const projects = readProjects()
  const idx = projects.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  projects[idx] = { ...projects[idx], ...req.body, id: req.params.id }
  writeProjects(projects)
  res.json(projects[idx])
})

app.delete('/api/projects/:id', (req, res) => {
  const projects = readProjects()
  const filtered = projects.filter(p => p.id !== req.params.id)
  if (filtered.length === projects.length) return res.status(404).json({ error: 'Not found' })
  writeProjects(filtered)
  res.status(204).end()
})

app.listen(3001, () => console.log('5kChocoPie server running on http://localhost:3001'))
