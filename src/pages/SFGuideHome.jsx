import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './SFGuideHome.module.css'

const LOGO = [
  { char: 'S', color: '#ff1466' },
  { char: 'F', color: '#ff66aa' },
  { char: ' ', color: 'transparent' },
  { char: 'F', color: '#cc33ff' },
  { char: 'i', color: '#ff1466' },
  { char: 'l', color: '#ffaa00' },
  { char: 'm', color: '#ff66aa' },
  { char: ' ', color: 'transparent' },
  { char: 'G', color: '#ff1466' },
  { char: 'u', color: '#cc33ff' },
  { char: 'i', color: '#ff66aa' },
  { char: 'd', color: '#ffaa00' },
  { char: 'e', color: '#ff1466' },
]

const RESULTS = [
  {
    to: '/sf-guide/locations',
    title: 'Film Locations — Celluloid SF Map',
    url: '5kchocopie.com/sf-guide/locations',
    desc: '15 iconic filming locations across San Francisco with history, film blurbs, photos & street view. From Hitchcock\'s Vertigo to The Matrix Reloaded — find exactly where it was filmed.',
  },
  {
    to: '/sf-guide/shops',
    title: 'Local Spots — Shops, Cinemas & Archives',
    url: '5kchocopie.com/sf-guide/shops',
    desc: 'Film archives, video stores, independent bookshops, camera stores & community cinemas — open today and beloved historical spots that shaped SF\'s film culture.',
  },
  {
    to: '/sf-guide/planner',
    title: 'Trip Planner — GPS Printout Mode',
    url: '5kchocopie.com/sf-guide/planner',
    desc: 'Build your personal SF film itinerary and print a retro Y2K-style GPS route sheet to take on the road. Save stops from the map and plan your cinematic tour of the city.',
  },
  {
    to: '/',
    title: '5kChocoPie — Short Film Production Planner',
    url: '5kchocopie.com',
    desc: 'Your Y2K-themed short film production planning tool. Manage budgets, track gear, cast & crew — all in one sparkly place.',
  },
]

export default function SFGuideHome() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowNotif(true), 800)
    return () => clearTimeout(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/sf-guide/locations')
  }

  const handleLucky = () => {
    const pages = ['/sf-guide/locations', '/sf-guide/shops', '/sf-guide/planner']
    navigate(pages[Math.floor(Math.random() * pages.length)])
  }

  return (
    <div className={styles.page}>
      <div className={styles.center}>

        <h1 className={styles.logo}>
          {LOGO.map((l, i) => (
            <span key={i} style={{ color: l.color }}>{l.char}</span>
          ))}
        </h1>

        <nav className={styles.tabs}>
          <Link to="/sf-guide/locations" className={styles.tab}>Locations</Link>
          <Link to="/sf-guide/shops"     className={styles.tab}>Local Spots</Link>
          <Link to="/sf-guide/planner"   className={styles.tab}>Trip Planner</Link>
          <Link to="/"                   className={styles.tab}>↩ Home</Link>
        </nav>

        <form className={styles.searchArea} onSubmit={handleSearch}>
          <div className={styles.searchRow}>
            <input
              className={styles.searchBox}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
            <div className={styles.sideLinks}>
              <Link to="/sf-guide/locations">· Film Locations</Link>
              <Link to="/sf-guide/shops">· Local Spots</Link>
              <Link to="/sf-guide/planner">· Trip Planner</Link>
            </div>
          </div>
          <div className={styles.btnRow}>
            <button type="submit" className={styles.btn}>Search SF Guide</button>
            <button type="button" className={styles.btn} onClick={handleLucky}>I'm Feeling Lucky ✦</button>
          </div>
        </form>

        {showNotif && (
          <div className={styles.notif}>
            <div className={styles.notifTitlebar}>
              <span className={styles.notifTitle}>SF Film Guide</span>
              <button className={styles.notifClose} onClick={() => setShowNotif(false)}>✕</button>
            </div>
            <div className={styles.notifBody}>
              <div className={styles.notifIcon}>ℹ️</div>
              <div className={styles.notifText}>
                <p>
                  San Francisco has been one of Hollywood's most beloved locations since the silent era.
                  From Hitchcock's fog-drenched obsessions to Coppola's paranoid masterpieces to the Marvel
                  universe, the city has played itself — and countless other roles — in hundreds of films.
                </p>
                <p>
                  This guide is inspired by <em>Celluloid San Francisco</em> by Burskirk and Shank.
                  Use the map to find locations, discover local film spots, and plan your own cinematic tour.
                </p>
                <p className={styles.notifTip}>
                  TIP: Use the floating <strong>Trip Notes</strong> panel (bottom-right) to save stops and print a retro GPS itinerary!
                </p>
              </div>
            </div>
            <div className={styles.notifFooter}>
              <button className={styles.notifOk} onClick={() => setShowNotif(false)}>OK</button>
            </div>
          </div>
        )}

        <div className={styles.resultsHeader}>
          Results <b>1–4</b> of <b>4</b> for <em>sf film guide</em>
        </div>

        <div className={styles.results}>
          {RESULTS.map(r => (
            <Link key={r.to} to={r.to} className={styles.result}>
              <div className={styles.resultTitle}>{r.title}</div>
              <div className={styles.resultUrl}>{r.url}</div>
              <div className={styles.resultDesc}>{r.desc}</div>
            </Link>
          ))}
        </div>

      </div>

      <footer className={styles.footer}>
        <Link to="/sf-guide/locations">Film Locations</Link>
        {' · '}
        <Link to="/sf-guide/shops">Local Spots</Link>
        {' · '}
        <Link to="/sf-guide/planner">Trip Planner</Link>
        {' · '}
        <Link to="/">5kChocoPie Home</Link>
      </footer>

    </div>
  )
}
