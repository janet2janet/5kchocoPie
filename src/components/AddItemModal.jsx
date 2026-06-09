import { useState } from 'react'
import WindowFrame from './WindowFrame'

const CATEGORY_FIELDS = {
  camera: ['Item', 'Brand/Model', 'Days', 'Cost ($)'],
  gear: ['Item', 'Type', 'Days', 'Cost ($)'],
  cast: ['Name/Role', 'Character', 'Days', 'Rate/Day ($)'],
  crew: ['Name/Role', 'Department', 'Days', 'Rate/Day ($)'],
}

export default function AddItemModal({ category, onSave, onClose, editing }) {
  const fields = CATEGORY_FIELDS[category] || ['Item', 'Detail', 'Days', 'Cost ($)']
  const [values, setValues] = useState(
    editing
      ? { name: editing.name, detail: editing.detail, days: editing.days, cost: editing.cost }
      : { name: '', detail: '', days: 1, cost: '' }
  )

  function set(key, val) {
    setValues(v => ({ ...v, [key]: val }))
  }

  function handleSave() {
    if (!values.name.trim()) return
    const cost = ['cast', 'crew'].includes(category)
      ? (Number(values.cost) || 0) * (Number(values.days) || 1)
      : Number(values.cost) || 0
    onSave({
      ...(editing ? { id: editing.id } : { id: crypto.randomUUID() }),
      name: values.name.trim(),
      detail: values.detail,
      days: values.days,
      cost,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div style={{ width: 380, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        <WindowFrame title={editing ? `EDIT ${category.toUpperCase()} ITEM` : `ADD ${category.toUpperCase()} ITEM`} icon="💾">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>{fields[0]}</span>
              <input
                type="text"
                value={values.name}
                onChange={e => set('name', e.target.value)}
                placeholder={fields[0]}
                autoFocus
                style={{ width: '100%' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>{fields[1]}</span>
              <input
                type="text"
                value={values.detail}
                onChange={e => set('detail', e.target.value)}
                placeholder={fields[1]}
                style={{ width: '100%' }}
              />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>{fields[2]}</span>
                <input
                  type="number"
                  min="1"
                  value={values.days}
                  onChange={e => set('days', e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>{fields[3]}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.cost}
                  onChange={e => set('cost', e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            {['cast', 'crew'].includes(category) && (
              <div style={{ fontSize: 15, color: '#666', textAlign: 'right' }}>
                Total: ${((Number(values.cost) || 0) * (Number(values.days) || 1)).toFixed(2)}
              </div>
            )}
            <div className="y2k-divider">~*~*~*~</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={onClose}>[ CANCEL ]</button>
              <button className="btn btn-primary" onClick={handleSave}>[ SAVE ]</button>
            </div>
          </div>
        </WindowFrame>
      </div>
    </div>
  )
}
