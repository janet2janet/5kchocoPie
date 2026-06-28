import { useRef, useState, useEffect } from 'react'
import { useTrip } from '../contexts/TripContext'
import styles from './TripNotesPanel.module.css'

export default function TripNotesPanel() {
  const { stops, notes, setNotes, removeStop, moveStop, distances } = useTrip()
  const [minimized, setMinimized] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [pos, setPos] = useState({ x: null, y: 120 })
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (pos.x === null) {
      setPos({ x: window.innerWidth - 320, y: 120 })
    }
  }, [pos.x])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    const onMove = (ev) => {
      setPos({
        x: Math.max(0, Math.min(ev.clientX - dragOffset.current.x, window.innerWidth - 300)),
        y: Math.max(0, Math.min(ev.clientY - dragOffset.current.y, window.innerHeight - 60)),
      })
    }
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    e.preventDefault()
  }

  if (pos.x === null) return null

  return (
    <>
      <div
        className={styles.panel}
        style={{ left: pos.x, top: pos.y }}
      >
        <div
          className={styles.titlebar}
          onPointerDown={onPointerDown}
        >
          <span className={styles.title}>🎬 My Trip Notes</span>
          <div className={styles.controls}>
            <button className={styles.btn} onClick={() => setMinimized(m => !m)} title="Minimize">_</button>
          </div>
        </div>

        {!minimized && (
          <div className={styles.body}>
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Stops ({stops.length})</div>
              {stops.length === 0 && (
                <div className={styles.empty}>No stops yet — click<br/>"Add to Trip" on any location!</div>
              )}
              {stops.map((stop, i) => (
                <div key={stop.id} className={styles.stop}>
                  <span className={styles.stopNum}>{i + 1}</span>
                  <span className={styles.stopName}>{stop.name}</span>
                  <div className={styles.stopActions}>
                    <button className={styles.microBtn} onClick={() => moveStop(i, -1)} disabled={i === 0}>▲</button>
                    <button className={styles.microBtn} onClick={() => moveStop(i, 1)} disabled={i === stops.length - 1}>▼</button>
                    <button className={styles.microBtn} onClick={() => removeStop(stop.id)} title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Notes</div>
              <textarea
                className={styles.notes}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="type your plans here..."
                rows={4}
              />
            </div>

            <button
              className={styles.printBtn}
              onClick={() => setPrintOpen(true)}
              disabled={stops.length === 0}
            >
              🖨 Print Route (GPS Style)
            </button>
          </div>
        )}
      </div>

      {printOpen && (
        <PrintModal stops={stops} notes={notes} distances={distances} onClose={() => setPrintOpen(false)} />
      )}
    </>
  )
}

function PrintModal({ stops, notes, distances = [], onClose }) {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const handlePrint = () => window.print()

  return (
    <div className={styles.printBackdrop}>
      <div className={styles.printModal}>
        <div className={styles.printControls + ' no-print'}>
          <button className={styles.printBtn} onClick={handlePrint}>🖨 PRINT</button>
          <button className={styles.closeBtn} onClick={onClose}>✕ CLOSE</button>
        </div>

        <div className={styles.printDoc} id="print-doc">
          <div className={styles.printHeader}>
            <div className={styles.printLogo}>🎬 SF FILM GUIDE</div>
            <div className={styles.printTitle}>MY TRIP ITINERARY</div>
            <div className={styles.printDate}>Printed: {date}</div>
            <div className={styles.printDivider}>{'═'.repeat(52)}</div>
          </div>

          <div className={styles.printStops}>
            {stops.map((stop, i) => (
              <div key={stop.id} className={styles.printStop}>
                <div className={styles.printStopHeader}>
                  <span className={styles.printStopNum}>STOP {i + 1}</span>
                  <span className={styles.printStopName}>{stop.name}</span>
                </div>
                <div className={styles.printStopAddress}>{stop.address}</div>
                {stop.neighborhood && (
                  <div className={styles.printStopNeighborhood}>{stop.neighborhood}</div>
                )}
                {i < stops.length - 1 && (
                  <div className={styles.printArrow}>
                    ▼ {distances[i] ? `${distances[i].miles} mi · ${distances[i].mins} min` : 'Continue to next stop'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {notes && (
            <div className={styles.printNotes}>
              <div className={styles.printNotesLabel}>NOTES:</div>
              <div className={styles.printNotesText}>{notes}</div>
            </div>
          )}

          <div className={styles.printFooter}>
            <div className={styles.printFooterLine}>{'─'.repeat(52)}</div>
            <div>SF Film Guide · sffilmguide.local · {stops.length} stop{stops.length !== 1 ? 's' : ''}</div>
            <div className={styles.printFooterSmall}>Keep this printout with you during your tour!</div>
          </div>
        </div>
      </div>
    </div>
  )
}
