import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const SF_LINKS = [
  { to: '/sf-guide',           label: '✿ SF GUIDE', cls: styles.green  },
  { to: '/sf-guide/locations', label: '★ MAP',      cls: styles.blue   },
  { to: '/sf-guide/shops',     label: '♥ SHOPS',    cls: styles.gold   },
  { to: '/sf-guide/planner',   label: '✦ PLANNER',  cls: styles.purple },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const onSF = pathname.startsWith('/sf-guide')

  return (
    <nav className={styles.nav + (onSF ? ' ' + styles.navSF : '')}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.star}>★彡</span>
          <span className={styles.title}>5kChocoPie</span>
          <span className={styles.star}>彡★</span>
        </Link>

        <div className={styles.tagline}>
          {onSF ? '~*~ sf film guide ~*~' : '~*~ ur fav short film planner ~*~'}
          <span className="blink" style={{ color: onSF ? 'var(--sg-accent)' : 'var(--neon-pink)', marginLeft: 6 }}>▌</span>
        </div>

        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${styles.pink} ${!onSF ? styles.navLinkActive : ''}`}
          >
            ★ HOME
          </Link>

          <div className={styles.sfGroup}>
            {SF_LINKS.map(({ to, label, cls }) => (
              <Link
                key={to}
                to={to}
                className={`${styles.navLink} ${cls} ${pathname === to ? styles.navLinkActive : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
