import { useState } from 'react'
import { localShops } from '../data/localShops'
import { useTrip } from '../contexts/TripContext'
import styles from './LocalShops.module.css'

const TYPES = ['All', 'Film Archive', 'Video Store', 'Bookstore', 'Cinema', 'Camera & Film Supplies', 'Camera Shop', 'Archive / Library', 'Cafe']
const TYPE_COLORS = {
  'Film Archive': '#660000',
  'Video Store': '#004400',
  'Bookstore': '#4a2600',
  'Cinema': '#003399',
  'Camera & Film Supplies': '#3d0066',
  'Camera Shop': '#3d0066',
  'Archive / Library': '#555500',
  'Cafe': '#664400',
}

export default function LocalShops() {
  const [activeType, setActiveType] = useState('All')
  const [search, setSearch] = useState('')
  const { addStop, stops } = useTrip()

  const presentTypes = ['All', ...new Set(localShops.map(s => s.type))]

  const filtered = localShops.filter(shop => {
    const matchType = activeType === 'All' || shop.type === activeType
    const matchSearch =
      !search ||
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      shop.blurb.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const isAdded = (id) => stops.some(s => s.id === id)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className="neon-text">LOCAL SPOTS</span>
        </h1>
        <p className={styles.subtitle}>
          SF Film Shops · Video Stores · Bookstores · Cinemas · Cafes
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {presentTypes.map(t => (
            <button
              key={t}
              className={styles.tab + (activeType === t ? ' ' + styles.tabActive : '')}
              onClick={() => setActiveType(t)}
              style={activeType === t && TYPE_COLORS[t] ? { background: TYPE_COLORS[t] } : {}}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
        </div>
      </div>

      <div className={styles.resultsBar}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {activeType !== 'All' && ` · ${activeType}`}
      </div>

      <div className={styles.grid}>
        {filtered.map(shop => (
          <ShopCard
            key={shop.id}
            shop={shop}
            added={isAdded(shop.id)}
            onAddTrip={() => addStop({ id: shop.id, name: shop.name, address: shop.address, neighborhood: shop.neighborhood, lat: shop.lat, lng: shop.lng })}
          />
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No spots match your search.</div>
        )}
      </div>
    </div>
  )
}

function ShopCard({ shop, added, onAddTrip }) {
  const color = TYPE_COLORS[shop.type] || '#333'
  const isClosed = shop.status.toLowerCase().includes('closed')

  return (
    <div className={styles.card + ' window'}>
      <div className="window-titlebar" style={{ background: `linear-gradient(to right, ${color}, ${color}99)` }}>
        <span className="window-title">{shop.name}</span>
        <div className="window-controls">
          <button className="window-btn">_</button>
          <button className="window-btn">□</button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.typeBadge} style={{ background: color }}>{shop.type}</span>
          <span className={styles.statusBadge + (isClosed ? ' ' + styles.statusClosed : ' ' + styles.statusOpen)}>
            {shop.status}
          </span>
          <span className={styles.years}>{shop.years}</span>
        </div>

        <div className={styles.neighborhood}>{shop.neighborhood}</div>
        <div className={styles.address}>{shop.address}</div>

        <div className={styles.photoRow}>
          <img src={shop.photo} alt={shop.name} className={styles.photo} loading="lazy" />
        </div>

        <p className={styles.blurb}>{shop.blurb}</p>

        <div className={styles.actions}>
          <a
            href={`https://www.google.com/maps?layer=c&cbll=${shop.lat},${shop.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            🌐 Street View
          </a>
          {shop.website && (
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              🔗 Website
            </a>
          )}
          {shop.wikipedia && (
            <a
              href={shop.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              📖 Wikipedia
            </a>
          )}
          <button
            className={'btn' + (added ? ' ' + styles.addedBtn : ' btn-primary')}
            onClick={onAddTrip}
            disabled={added}
          >
            {added ? '✓ In Trip' : '+ Add to Trip'}
          </button>
        </div>
      </div>
    </div>
  )
}
