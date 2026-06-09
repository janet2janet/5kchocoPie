import { useState } from 'react'
import AddItemModal from './AddItemModal'

const CATEGORY_COLS = {
  camera: ['Item', 'Brand/Model', 'Days', 'Cost'],
  gear: ['Item', 'Type', 'Days', 'Cost'],
  cast: ['Name/Role', 'Character', 'Days', 'Total Cost'],
  crew: ['Name/Role', 'Department', 'Days', 'Total Cost'],
}

export default function BudgetTable({ category, items = [], onChange }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const cols = CATEGORY_COLS[category] || ['Item', 'Detail', 'Days', 'Cost']
  const total = items.reduce((s, i) => s + (Number(i.cost) || 0), 0)

  function handleSave(item) {
    if (editing) {
      onChange(items.map(i => i.id === item.id ? item : i))
    } else {
      onChange([...items, item])
    }
    setEditing(null)
  }

  function handleDelete(id) {
    onChange(items.filter(i => i.id !== id))
  }

  function openEdit(item) {
    setEditing(item)
    setShowModal(true)
  }

  return (
    <div>
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}>
          [ + ADD {category.toUpperCase()} ]
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: 18 }}>
          ~*~ no items yet — click ADD to get started ~*~
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {cols.map(c => <th key={c}>{c}</th>)}
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.detail}</td>
                <td style={{ textAlign: 'center' }}>{item.days}</td>
                <td style={{ textAlign: 'right' }}>${Number(item.cost).toFixed(2)}</td>
                <td style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                  <button className="btn" style={{ fontSize: 14, padding: '2px 8px' }} onClick={() => openEdit(item)}>
                    EDIT
                  </button>
                  <button className="btn btn-danger" style={{ fontSize: 14, padding: '2px 8px' }} onClick={() => handleDelete(item.id)}>
                    DEL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ fontFamily: "'Press Start 2P'", fontSize: 9, textAlign: 'right', background: '#eef', color: '#003' }}>
                SUBTOTAL
              </td>
              <td style={{ fontFamily: "'Press Start 2P'", fontSize: 10, textAlign: 'right', background: '#eef', color: '#003399' }}>
                ${total.toFixed(2)}
              </td>
              <td style={{ background: '#eef' }}></td>
            </tr>
          </tfoot>
        </table>
      )}

      {showModal && (
        <AddItemModal
          category={category}
          editing={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
