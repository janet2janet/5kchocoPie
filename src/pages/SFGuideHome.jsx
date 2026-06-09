import { Link } from 'react-router-dom'
import styles from './SFGuideHome.module.css'

const CARDS = [
  {
    to: '/sf-guide/locations',
    icon: '🗺',
    title: 'FILM LOCATIONS',
    sub: 'Celluloid SF Map',
    desc: '15 iconic filming locations across San Francisco with history, film blurbs, photos & street view.',
    color: '#003399',
  },
  {
    to: '/sf-guide/shops',
    icon: '🎞',
    title: 'LOCAL SPOTS',
    sub: 'Shops, Cinemas & Cafes',
    desc: 'Film archives, video stores, bookshops, cameras & community cafes — open and historical.',
    color: '#006600',
  },
  {
    to: '/sf-guide/planner',
    icon: '🖨',
    title: 'TRIP PLANNER',
    sub: 'GPS Printout Mode',
    desc: 'Build your personal itinerary and print a retro 2000s-style GPS route sheet to take on the road.',
    color: '#660066',
  },
]

export default function SFGuideHome() {
  return (
    <div className={styles.page}>
      <div className={styles.filmstrip}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.filmCell} />
        ))}
      </div>

      <div className={styles.hero}>
        <div className={styles.heroTag}>✦ EST. 1908 ✦</div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroSF}>SAN FRANCISCO</span>
          <br />
          <span className={styles.heroFilm}>FILM GUIDE</span>
        </h1>
        <p className={styles.heroSub}>
          Your complete resource for SF's filmmaking history, locations, and community.
        </p>
        <div className={styles.heroDivider}>
          ★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★
        </div>
      </div>

      <div className={styles.intro}>
        <div className="window" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="window-titlebar">
            <span className="window-title">ABOUT THIS GUIDE</span>
            <div className="window-controls">
              <button className="window-btn">_</button>
              <button className="window-btn">□</button>
              <button className="window-btn close">✕</button>
            </div>
          </div>
          <div className="window-content" style={{ color: '#000', lineHeight: 1.6, fontSize: 17 }}>
            <p>
              San Francisco has been one of Hollywood's most beloved locations since the silent era.
              From Hitchcock's fog-drenched obsessions to Coppola's paranoid masterpieces to the Marvel
              universe, the city has played itself — and countless other roles — in hundreds of films.
            </p>
            <br />
            <p>
              This guide is inspired by the book <em>Celluloid San Francisco</em> by Burskirk and Shank,
              which mapped the city's filming history neighborhood by neighborhood. Use the interactive
              map to find locations, discover local film culture spots, and plan your own personal
              cinematic tour of the city.
            </p>
            <div className="y2k-divider">★ ★ ★</div>
            <p style={{ fontSize: 15, color: '#555' }}>
              TIP: Use the floating <strong>Trip Notes</strong> panel (bottom-right) to save stops and
              print a retro GPS itinerary to take with you!
            </p>
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {CARDS.map(card => (
          <Link key={card.to} to={card.to} className={styles.card} style={{ '--card-color': card.color }}>
            <div className={styles.cardTitlebar} style={{ background: `linear-gradient(to right, ${card.color}, ${card.color}bb)` }}>
              <span className={styles.cardTitle}>{card.title}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <div className={styles.cardSub}>{card.sub}</div>
              <p className={styles.cardDesc}>{card.desc}</p>
              <div className={styles.cardBtn}>ENTER ▶</div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.filmstrip} style={{ marginTop: 40 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.filmCell} />
        ))}
      </div>

      <div className={styles.footer}>
        <span className="blink" style={{ color: 'var(--neon-pink)' }}>★</span>
        {' '}SF FILM GUIDE · A 5kChocoPie Resource{' '}
        <span className="blink" style={{ color: 'var(--neon-pink)' }}>★</span>
      </div>
    </div>
  )
}
