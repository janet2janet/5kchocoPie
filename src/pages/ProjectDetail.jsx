import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProjects, updateProject } from '../api/client'
import { useTrip } from '../contexts/TripContext'
import WindowFrame from '../components/WindowFrame'
import BudgetTable from '../components/BudgetTable'
import BudgetSummary from '../components/BudgetSummary'
import styles from './ProjectDetail.module.css'

const CATS = ['camera', 'gear', 'cast', 'crew']
const CAT_LABELS = { camera: 'CAMERA', gear: 'GEAR', cast: 'CAST', crew: 'CREW' }
const CAT_COLS = {
  camera: ['Item', 'Brand / Model', 'Days', 'Cost'],
  gear:   ['Item', 'Type', 'Days', 'Cost'],
  cast:   ['Name / Role', 'Character', 'Days', 'Total Cost'],
  crew:   ['Name / Role', 'Department', 'Days', 'Total Cost'],
}
const SPLATTER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'%3E%3Cg opacity='0.22'%3E%3Cellipse fill='%23ff9ab8' cx='-10' cy='90' rx='260' ry='65' transform='rotate(-18 -10 90)'/%3E%3Cellipse fill='%23ff9ab8' cx='1060' cy='40' rx='220' ry='55' transform='rotate(14 1060 40)'/%3E%3Cellipse fill='%23ffc5d5' cx='480' cy='810' rx='240' ry='60' transform='rotate(-8 480 810)'/%3E%3C/g%3E%3C/svg%3E")`

function printProject(project, stops, distances) {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const budget = project.budget || {}

  const grandTotal = CATS.reduce((sum, cat) => {
    return sum + (budget[cat] || []).reduce((s, i) => s + (Number(i.cost) || 0), 0)
  }, 0)

  const summaryHtml = CATS.map(cat => {
    const total = (budget[cat] || []).reduce((s, i) => s + (Number(i.cost) || 0), 0)
    return `<div class="summary-item"><div class="summary-label">${CAT_LABELS[cat]}</div><div class="summary-amount">$${total.toFixed(2)}</div></div>`
  }).join('') + `<div class="summary-item grand"><div class="summary-label">★ GRAND TOTAL</div><div class="summary-amount grand-amt">$${grandTotal.toFixed(2)}</div></div>`

  const tablesHtml = CATS.map(cat => {
    const items = budget[cat] || []
    if (items.length === 0) return ''
    const cols = CAT_COLS[cat]
    const subtotal = items.reduce((s, i) => s + (Number(i.cost) || 0), 0)
    const rows = items.map(item => `
      <tr>
        <td>${item.name || ''}</td>
        <td>${item.detail || ''}</td>
        <td style="text-align:center">${item.days || ''}</td>
        <td style="text-align:right">$${Number(item.cost || 0).toFixed(2)}</td>
      </tr>`).join('')
    return `
      <div class="cat-section">
        <div class="cat-header">${CAT_LABELS[cat]}</div>
        <table>
          <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td colspan="3" style="text-align:right">SUBTOTAL</td><td style="text-align:right">$${subtotal.toFixed(2)}</td></tr></tfoot>
        </table>
      </div>`
  }).join('')

  const locationsHtml = stops.length > 0 ? `
    <div class="section-header">FILMING LOCATIONS</div>
    <div class="divider">${'═'.repeat(52)}</div>
    ${stops.map((s, i) => `
      <div class="stop">
        <div class="stop-header">
          <span class="stop-num">STOP ${i + 1}</span>
          <span class="stop-name">${s.name}</span>
        </div>
        <div class="stop-address">${s.address}${s.neighborhood ? ` · ${s.neighborhood}` : ''}</div>
      </div>
      ${i < stops.length - 1 ? `<div class="dist-row">▼ ${distances[i] ? `${distances[i].miles} mi · ${distances[i].mins} min` : '·'}</div>` : ''}
    `).join('')}
  ` : ''

  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${project.title} — Budget</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background-color:#4a0015;background-image:${SPLATTER};background-size:100% 100%;color:#fce0e8;font-family:'VT323',monospace;max-width:780px;margin:0 auto;padding:36px 44px 44px;min-height:100vh}
    .logo{font-family:'Press Start 2P',monospace;font-size:10px;color:#ff1466;text-shadow:0 0 10px #ff1466;letter-spacing:2px;margin-bottom:6px}
    .project-title{font-family:'Press Start 2P',monospace;font-size:13px;color:#fff;text-shadow:2px 2px 0 #1a000a,0 0 16px rgba(255,20,102,.4);letter-spacing:1px;margin-bottom:6px}
    .date{font-size:18px;color:#d05078;margin-bottom:4px}
    .desc{font-family:Verdana,Tahoma,sans-serif;font-size:11px;color:#d05078;line-height:1.6;margin-bottom:14px}
    .divider{font-size:13px;color:#8b1535;margin:10px 0;letter-spacing:1px}
    .summary{display:flex;flex-wrap:wrap;gap:12px;background:rgba(74,0,21,.6);border:1px solid #8b1535;padding:10px 14px;margin:14px 0}
    .summary-item{display:flex;flex-direction:column;align-items:center;gap:3px}
    .summary-label{font-family:'Press Start 2P',monospace;font-size:6px;color:#b83558;letter-spacing:1px}
    .summary-amount{font-family:'VT323',monospace;font-size:22px;color:#ff9ab8;text-shadow:0 0 6px rgba(255,20,102,.3)}
    .grand .summary-label{color:#ff1466}
    .grand-amt{color:#fff;font-size:26px;text-shadow:0 0 10px rgba(255,20,102,.5)}
    .cat-section{margin:18px 0}
    .cat-header{font-family:'Press Start 2P',monospace;font-size:8px;color:#ff1466;letter-spacing:2px;border-bottom:1px solid #8b1535;padding-bottom:5px;margin-bottom:8px;text-shadow:0 0 6px rgba(255,20,102,.3)}
    .section-header{font-family:'Press Start 2P',monospace;font-size:8px;color:#ff1466;letter-spacing:2px;margin-top:22px;margin-bottom:4px;text-shadow:0 0 6px rgba(255,20,102,.3)}
    table{width:100%;border-collapse:collapse;background:rgba(74,0,21,.5);font-size:16px}
    th{font-family:'Press Start 2P',monospace;font-size:6px;background:rgba(74,0,21,.9);color:#fce0e8;padding:5px 8px;text-align:left;border:1px solid #8b1535}
    td{padding:4px 8px;border:1px solid #3a0010;color:#fce0e8;vertical-align:middle}
    tr:nth-child(even) td{background:rgba(139,21,53,.2)}
    tfoot td{font-family:'Press Start 2P',monospace;font-size:7px;color:#ff1466;background:rgba(74,0,21,.8);border-top:1px solid #ff1466}
    .stop{margin-bottom:8px;padding-left:10px;border-left:2px solid #8b1535}
    .stop-header{display:flex;align-items:center;gap:10px;margin-bottom:3px}
    .stop-num{font-family:'Press Start 2P',monospace;font-size:7px;color:#fff;background:#ff1466;padding:3px 6px;flex-shrink:0}
    .stop-name{font-size:22px;color:#fff;text-shadow:1px 1px 0 #1a000a}
    .stop-address{font-family:Verdana,Tahoma,sans-serif;font-size:10px;color:#d05078;margin-left:2px}
    .dist-row{font-size:18px;color:#ff1466;text-shadow:0 0 6px rgba(255,20,102,.4);margin:4px 0 4px 12px}
    .footer{text-align:center;border-top:1px solid #8b1535;padding-top:12px;margin-top:24px;font-size:16px;color:#b83558}
    @media print{
      body{background-color:#fff;background-image:none;color:#000;padding:12px 20px}
      .logo,.cat-header,.section-header{color:#8b1535;text-shadow:none}
      .project-title{color:#000;text-shadow:none}
      .date,.desc{color:#444}
      .divider{color:#8b1535}
      .summary{background:#f5e0e8;border-color:#8b1535}
      .summary-amount,.grand-amt{color:#8b1535;text-shadow:none}
      .summary-label{color:#8b1535}
      table{background:#fff}
      th{background:#8b1535;color:#fff}
      td{color:#000;border-color:#ddd}
      tr:nth-child(even) td{background:#f5e0e8}
      tfoot td{background:#e8d0d8;color:#8b1535;border-color:#8b1535}
      .stop{border-color:#8b1535}
      .stop-name{color:#000;text-shadow:none}
      .stop-address{color:#444}
      .dist-row{color:#8b1535;text-shadow:none}
      .footer{color:#555;border-color:#8b1535}
    }
  </style>
</head>
<body>
  <div class="logo">🎬 5kChocoPie Film Planner</div>
  <div class="project-title">${project.title}</div>
  <div class="date">${date}</div>
  ${project.description ? `<div class="desc">${project.description}</div>` : ''}
  <div class="divider">${'═'.repeat(52)}</div>
  <div class="summary">${summaryHtml}</div>
  <div class="divider">${'─'.repeat(52)}</div>
  ${tablesHtml}
  ${locationsHtml}
  <div class="footer">5kChocoPie · ${project.title} · $${grandTotal.toFixed(2)} total budget</div>
  <script>window.onload=()=>window.print()<\/script>
</body></html>`)
  win.document.close()
}

const TABS = ['overview', 'camera', 'gear', 'cast', 'crew']
const TAB_LABELS = { overview: '📋 OVERVIEW', camera: '📷 CAMERA', gear: '🎒 GEAR', cast: '🎭 CAST', crew: '🎬 CREW' }

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { stops, distances } = useTrip()
  const [project, setProject] = useState(null)
  const [tab, setTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [editTitle, setEditTitle] = useState(false)
  const [titleVal, setTitleVal] = useState('')
  const [descVal, setDescVal] = useState('')

  useEffect(() => {
    getProjects().then(projects => {
      const p = projects.find(x => x.id === id)
      if (!p) { navigate('/'); return }
      setProject(p)
      setTitleVal(p.title)
      setDescVal(p.description || '')
    })
  }, [id, navigate])

  const save = useCallback(async (updated) => {
    setSaving(true)
    const saved = await updateProject(id, updated)
    setProject(saved)
    setSaving(false)
  }, [id])

  function handleCategoryChange(category, items) {
    const updated = { ...project, budget: { ...project.budget, [category]: items } }
    setProject(updated)
    save(updated)
  }

  async function saveTitle() {
    const updated = { ...project, title: titleVal.trim() || project.title, description: descVal }
    await save(updated)
    setEditTitle(false)
  }

  if (!project) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <span className="neon-text blink" style={{ fontFamily: "'Press Start 2P'", fontSize: 14 }}>LOADING...</span>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => navigate('/')}>← BACK TO PROJECTS</button>
        <button
          className="btn btn-primary"
          onClick={() => printProject(project, stops, distances)}
          style={{ marginLeft: 'auto' }}
        >
          🖨 PRINT / SAVE PDF
        </button>
      </div>

      <BudgetSummary budget={project.budget} />

      <div style={{ marginTop: 16 }}>
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {tab === 'overview' && (
            <WindowFrame
              title={project.title}
              icon="🎬"
              statusText={saving ? '💾 Saving...' : '✓ Saved'}
            >
              {editTitle ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>TITLE</span>
                    <input
                      type="text"
                      value={titleVal}
                      onChange={e => setTitleVal(e.target.value)}
                      style={{ width: '100%' }}
                      autoFocus
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>DESCRIPTION</span>
                    <textarea
                      value={descVal}
                      onChange={e => setDescVal(e.target.value)}
                      rows={4}
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => setEditTitle(false)}>[ CANCEL ]</button>
                    <button className="btn btn-primary" onClick={saveTitle}>[ SAVE ]</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h2 style={{ fontFamily: "'Press Start 2P'", fontSize: 13, color: '#003399' }}>{project.title}</h2>
                    <button className="btn" style={{ fontSize: 14 }} onClick={() => setEditTitle(true)}>EDIT</button>
                  </div>
                  <div className="y2k-divider">~*~*~*~*~*~</div>
                  <p style={{ marginTop: 10, fontSize: 18, color: '#333', lineHeight: 1.5 }}>
                    {project.description || <em style={{ color: '#999' }}>No description yet.</em>}
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: '#666', marginBottom: 8 }}>BUDGET OVERVIEW</div>
                    <BudgetSummary budget={project.budget} />
                  </div>
                </div>
              )}
            </WindowFrame>
          )}

          {tab !== 'overview' && (
            <WindowFrame
              title={`${TAB_LABELS[tab]} BUDGET`}
              icon={TAB_LABELS[tab].split(' ')[0]}
              statusText={saving ? '💾 Saving...' : '✓ Auto-saved'}
            >
              <BudgetTable
                category={tab}
                items={project.budget?.[tab] || []}
                onChange={items => handleCategoryChange(tab, items)}
              />
            </WindowFrame>
          )}
        </div>
      </div>
    </main>
  )
}
