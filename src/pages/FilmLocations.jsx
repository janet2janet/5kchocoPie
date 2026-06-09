import { useState, useRef, useEffect, forwardRef } from 'react'
import { sfFilmLocations } from '../data/sfFilmLocations'
import { useTrip } from '../contexts/TripContext'
import styles from './FilmLocations.module.css'

export default function FilmLocations() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const { addStop, stops } = useTrip()
  const cardRefs = useRef({})

  const filtered = sfFilmLocations.filter(
    loc =>
      !filter ||
      loc.name.toLowerCase().includes(filter.toLowerCase()) ||
      loc.neighborhood.toLowerCase().includes(filter.toLowerCase()) ||
      loc.films.some(f => f.toLowerCase().includes(filter.toLowerCase()))
  )

  const handleSelect = (loc) => {
    setSelected(loc)
    cardRefs.current[loc.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const isAdded = (id) => stops.some(s => s.id === `loc-${id}`)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>
            <span className="neon-text">SF FILM LOCATIONS</span>
          </h1>
          <p className={styles.subtitle}>
            Based on <em>Celluloid: San Francisco</em> by Burskirk & Shank · {sfFilmLocations.length} locations mapped
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: location list */}
        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search locations, films, neighborhoods..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className={styles.searchInput}
            />
            {filter && (
              <button className={styles.clearBtn} onClick={() => setFilter('')}>✕</button>
            )}
          </div>
          <div className={styles.locationCount}>
            {filtered.length} location{filtered.length !== 1 ? 's' : ''}
          </div>

          <div className={styles.cardList}>
            {filtered.map(loc => (
              <LocationCard
                key={loc.id}
                loc={loc}
                active={selected?.id === loc.id}
                added={isAdded(loc.id)}
                onSelect={handleSelect}
                onAddTrip={() => addStop({ id: `loc-${loc.id}`, name: loc.name, address: loc.address, neighborhood: loc.neighborhood, lat: loc.lat, lng: loc.lng })}
                ref={el => cardRefs.current[loc.id] = el}
              />
            ))}
          </div>
        </div>

        {/* Right: map */}
        <div className={styles.mapArea}>
          <div className={styles.mapWindow + ' window'}>
            <div className="window-titlebar">
              <span className="window-title">🗺 SF INTERACTIVE MAP — OpenStreetMap</span>
              <div className="window-controls">
                <button className="window-btn">_</button>
                <button className="window-btn">□</button>
              </div>
            </div>
            <div className={styles.mapContainer}>
              <MapLoader locations={filtered} selected={selected} onSelect={handleSelect} />
            </div>
            <div className="statusbar">
              <span>{selected ? `Selected: #${selected.id} ${selected.name}` : 'Click a marker or card to explore'}</span>
              <span>{filtered.length} pins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MapLoader({ locations, selected, onSelect }) {
  const [MapComp, setMapComp] = useState(null)
  useEffect(() => {
    import('../components/SFMap.jsx').then(m => setMapComp(() => m.default))
  }, [])
  if (!MapComp) return <div className={styles.mapLoading}>Loading map...</div>
  return <MapComp locations={locations} selected={selected} onSelect={onSelect} />
}

const LocationCard = forwardRef(function LocationCard({ loc, active, added, onSelect, onAddTrip }, ref) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      ref={ref}
      className={styles.card + (active ? ' ' + styles.cardActive : '')}
      onClick={() => onSelect(loc)}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardNum}>{loc.id}</span>
        <div className={styles.cardHeaderText}>
          <div className={styles.cardName}>{loc.name}</div>
          <div className={styles.cardAddress}>{loc.address}</div>
          <div className={styles.cardNeighborhood}>{loc.neighborhood}</div>
        </div>
      </div>

      <div className={styles.filmBadges}>
        {loc.films.map(f => (
          <span key={f} className={styles.filmBadge}>{f}</span>
        ))}
      </div>

      {expanded && (
        <div className={styles.expanded}>
          <img src={loc.photo} alt={loc.name} className={styles.photo} loading="lazy" />

          <div className={styles.blurbSection}>
            <div className={styles.blurbLabel}>🎬 IN THE FILMS</div>
            <p className={styles.blurb}>{loc.filmBlurb}</p>
          </div>

          <div className={styles.blurbSection}>
            <div className={styles.blurbLabel}>📜 HISTORY</div>
            <p className={styles.blurb}>{loc.historyBlurb}</p>
          </div>

          <div className={styles.cardActions}>
            <a
              href={`https://www.google.com/maps?layer=c&cbll=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              onClick={e => e.stopPropagation()}
            >
              🌐 Street View
            </a>
            {loc.website && (
              <a
                href={loc.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                onClick={e => e.stopPropagation()}
              >
                🔗 Website
              </a>
            )}
            {loc.wikipedia && (
              <a
                href={loc.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                onClick={e => e.stopPropagation()}
              >
                📖 Wikipedia
              </a>
            )}
            <button
              className={'btn' + (added ? ' ' + styles.addedBtn : ' btn-primary')}
              onClick={(e) => { e.stopPropagation(); onAddTrip() }}
              disabled={added}
            >
              {added ? '✓ In Trip' : '+ Add to Trip'}
            </button>
          </div>
        </div>
      )}

      <button
        className={styles.expandBtn}
        onClick={(e) => { e.stopPropagation(); setExpanded(x => !x) }}
      >
        {expanded ? '▲ Less' : '▼ More info'}
      </button>
    </div>
  )
})
