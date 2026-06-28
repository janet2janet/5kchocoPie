import { useEffect } from 'react'
import styles from './SparkleTrail.module.css'

const SHAPES = ['✦', '★', '✿', '♦', '✵', '·', '✸', '❋']
const COLORS = ['#ff99cc', '#ffee44', '#00ffff', '#ffffff', '#ff44aa', '#cc88ff', '#88ffcc', '#ffaa00']

export default function SparkleTrail() {
  useEffect(() => {
    let lastX = 0, lastY = 0

    const spawn = (x, y) => {
      const el = document.createElement('span')
      el.className = styles.sparkle
      el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
      el.style.left = x + 'px'
      el.style.top = y + 'px'
      el.style.fontSize = (10 + Math.random() * 14) + 'px'
      el.style.setProperty('--dx', ((Math.random() - 0.5) * 50) + 'px')
      el.style.setProperty('--dy', (-(15 + Math.random() * 45)) + 'px')
      el.style.setProperty('--rot', (Math.random() * 360) + 'deg')
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 750)
    }

    const onMove = (e) => {
      const dist = Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY)
      if (dist < 10) return
      lastX = e.clientX
      lastY = e.clientY
      const count = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawn(e.clientX, e.clientY), i * 40)
      }
    }

    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return null
}
