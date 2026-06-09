import { useNavigate } from 'react-router-dom'
import { deleteProject } from '../api/client'
import styles from './ProjectCard.module.css'

function totalBudget(budget = {}) {
  return Object.values(budget).reduce((sum, items) => {
    return sum + (items || []).reduce((s, item) => s + (Number(item.cost) || 0), 0)
  }, 0)
}

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const total = totalBudget(project.budget)

  async function handleDelete(e) {
    e.stopPropagation()
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    await deleteProject(project.id)
    onDelete(project.id)
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/project/${project.id}`)}>
      <div className={styles.titlebar}>
        <span className={styles.icon}>🎬</span>
        <span className={styles.title}>{project.title}</span>
        <button className={styles.deleteBtn} onClick={handleDelete} title="Delete project">✕</button>
      </div>
      <div className={styles.body}>
        {project.description && (
          <p className={styles.desc}>{project.description}</p>
        )}
        <div className={styles.divider}>~*~*~*~*~*~</div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>TOTAL BUDGET</span>
          <span className={styles.budgetAmount}>${total.toFixed(2)}</span>
        </div>
        <div className={styles.categories}>
          {['camera', 'gear', 'cast', 'crew'].map(cat => {
            const catTotal = (project.budget?.[cat] || []).reduce((s, i) => s + (Number(i.cost) || 0), 0)
            return (
              <span key={cat} className={styles.catChip}>
                {cat}: ${catTotal.toFixed(0)}
              </span>
            )
          })}
        </div>
      </div>
      <div className={styles.footer}>
        &gt;&gt; CLICK TO OPEN &lt;&lt;
      </div>
    </div>
  )
}
