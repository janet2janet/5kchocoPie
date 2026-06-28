import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

const CLICKABLE = 'a, button, select, label, [role="button"], [onclick], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]'

export default function CustomCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId
    const onMove = (e) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        el.style.left = e.clientX + 'px'
        el.style.top = e.clientY + 'px'
        el.style.opacity = '1'
      })
    }

    const onOver = (e) => {
      el.classList.toggle(styles.blue, !!e.target.closest(CLICKABLE))
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={styles.cursor}
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hello-kitty-cursor.png)` }}
    />
  )
}
