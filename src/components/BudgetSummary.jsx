const CATS = ['camera', 'gear', 'cast', 'crew']
const LABELS = { camera: '📷 CAMERA', gear: '🎒 GEAR', cast: '🎭 CAST', crew: '🎬 CREW' }

export default function BudgetSummary({ budget = {} }) {
  const catTotals = CATS.map(cat => ({
    cat,
    label: LABELS[cat],
    total: (budget[cat] || []).reduce((s, i) => s + (Number(i.cost) || 0), 0),
  }))
  const grand = catTotals.reduce((s, c) => s + c.total, 0)

  return (
    <div className="budget-bar">
      {catTotals.map(({ cat, label, total }) => (
        <div key={cat} className="category-total">
          <span className="label">{label}</span>
          <span className="amount">${total.toFixed(2)}</span>
        </div>
      ))}
      <div style={{ marginLeft: 'auto' }} className="category-total grand-total">
        <span className="label">★ GRAND TOTAL</span>
        <span className="amount">${grand.toFixed(2)}</span>
      </div>
    </div>
  )
}
