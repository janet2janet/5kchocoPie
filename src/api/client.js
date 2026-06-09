const KEY = '5kchocoPie-projects'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

function save(projects) {
  localStorage.setItem(KEY, JSON.stringify(projects))
}

export async function getProjects() {
  return load()
}

export async function createProject(data) {
  const projects = load()
  const project = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  save([...projects, project])
  return project
}

export async function updateProject(id, data) {
  const projects = load()
  const updated = projects.map(p => p.id === id ? { ...p, ...data } : p)
  save(updated)
  return updated.find(p => p.id === id)
}

export async function deleteProject(id) {
  save(load().filter(p => p.id !== id))
}
