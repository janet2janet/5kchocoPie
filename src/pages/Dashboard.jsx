import { useState, useEffect } from 'react'
import { getProjects, createProject } from '../api/client'
import ProjectCard from '../components/ProjectCard'
import WindowFrame from '../components/WindowFrame'
import styles from './Dashboard.module.css'
import LavaLamp from '../components/LavaLamp'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    getProjects().then(p => { setProjects(p); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!newTitle.trim()) return
    const project = await createProject({
      title: newTitle.trim(),
      description: newDesc.trim(),
      budget: { camera: [], gear: [], cast: [], crew: [] },
    })
    setProjects(p => [...p, project])
    setNewTitle('')
    setNewDesc('')
    setShowNew(false)
  }

  return (
    <>
    <LavaLamp />
    <main className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
      <div className={styles.header}>
        <div className="neon-text" style={{ fontFamily: "'Press Start 2P'", fontSize: 14 }}>
          ★ MY FILM PROJECTS ★
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          [ + NEW PROJECT ]
        </button>
      </div>

      <div className="y2k-divider">~*~*~*~*~*~*~*~*~*~*~*~*~</div>

      {loading && (
        <div className={styles.loading}>
          <span className="neon-text">LOADING</span>
          <span className="blink neon-text">...</span>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className={styles.empty}>
          <WindowFrame title="NO PROJECTS YET" icon="📁">
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
              <div className="neon-pink-text" style={{ fontFamily: "'Press Start 2P'", fontSize: 10, lineHeight: 1.8 }}>
                start ur first<br/>film project!
              </div>
              <div className="y2k-divider" style={{ margin: '12px 0' }}>~*~*~*~</div>
              <button className="btn btn-primary" onClick={() => setShowNew(true)}>
                [ CREATE PROJECT ]
              </button>
            </div>
          </WindowFrame>
        </div>
      )}

      <div className={styles.grid}>
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} onDelete={id => setProjects(ps => ps.filter(x => x.id !== id))} />
        ))}
      </div>

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div style={{ width: 400, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
            <WindowFrame title="NEW FILM PROJECT" icon="🎬">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>PROJECT TITLE *</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="My Awesome Short Film"
                    autoFocus
                    style={{ width: '100%' }}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>DESCRIPTION</span>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="What's this film about?"
                    rows={3}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </label>
                <div className="y2k-divider">~*~*~*~</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn" onClick={() => setShowNew(false)}>[ CANCEL ]</button>
                  <button className="btn btn-primary" onClick={handleCreate}>[ CREATE ]</button>
                </div>
              </div>
            </WindowFrame>
          </div>
        </div>
      )}
    </main>
    </>
  )
}
