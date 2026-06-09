import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useTrip } from '../contexts/TripContext'
import styles from './TripPlanner.module.css'

const SPLATTER_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'%3E%3Cg opacity='0.22'%3E%3Cellipse fill='%23ff9ab8' cx='-10' cy='90' rx='260' ry='65' transform='rotate(-18 -10 90)'/%3E%3Cellipse fill='%23ff9ab8' cx='1060' cy='40' rx='220' ry='55' transform='rotate(14 1060 40)'/%3E%3Cellipse fill='%23ffc5d5' cx='480' cy='810' rx='240' ry='60' transform='rotate(-8 480 810)'/%3E%3Cellipse fill='%23ff9ab8' cx='1200' cy='500' rx='180' ry='45' transform='rotate(25 1200 500)'/%3E%3C/g%3E%3C/svg%3E")`

export default function TripPlanner() {
  const { stops, notes, setNotes, removeStop, moveStop, distances, distLoading } = useTrip()
  const [MapComp, setMapComp] = useState(null)

  useEffect(() => {
    import('../components/TripRouteMap.jsx').then(m => setMapComp(() => m.default))
  }, [])

  const totalMiles = distances.reduce((sum, d) => sum + parseFloat(d?.miles || 0), 0).toFixed(1)
  const totalMins = distances.reduce((sum, d) => sum + (d?.mins || 0), 0)
  const totalHours = Math.floor(totalMins / 60)
  const remMins = totalMins % 60
  const totalStr = distances.length > 0
    ? `${totalMiles} mi · ${totalHours > 0 ? `${totalHours}h ` : ''}${remMins}min drive`
    : null

  const openInGoogleMaps = () => {
    const valid = stops.filter(s => s.lat && s.lng)
    if (valid.length === 0) return
    const parts = valid.map(s => `${s.lat},${s.lng}`).join('/')
    window.open(`https://www.google.com/maps/dir/${parts}?travelmode=driving`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className="neon-pink-text">TRIP PLANNER</span>
        </h1>
        <p className={styles.subtitle}>
          {totalStr
            ? `${stops.length} stops · ${totalStr}`
            : 'Build your SF Film Tour itinerary · Print GPS-style route sheet'}
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>

          {/* Itinerary */}
          <div className="window">
            <div className="window-titlebar">
              <span className="window-title">MY ITINERARY ({stops.length} stops)</span>
              <div className="window-controls">
                <button className="window-btn">_</button>
                <button className="window-btn">□</button>
              </div>
            </div>
            <div className="window-content">
              {stops.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🗺</div>
                  <p>Your trip is empty!</p>
                  <p>Browse the <Link to="/sf-guide/locations" className={styles.link}>Film Locations</Link> or <Link to="/sf-guide/shops" className={styles.link}>Local Spots</Link> pages and click <strong>"+ Add to Trip"</strong> to build your itinerary.</p>
                </div>
              ) : (
                <div className={styles.stopList}>
                  {stops.map((stop, i) => (
                    <Fragment key={stop.id}>
                      <div className={styles.stop}>
                        <div className={styles.stopLeft}>
                          <span className={styles.stopNum}>{i + 1}</span>
                          <div>
                            <div className={styles.stopName}>{stop.name}</div>
                            <div className={styles.stopAddress}>{stop.address}</div>
                            {stop.neighborhood && <div className={styles.stopNeighborhood}>{stop.neighborhood}</div>}
                          </div>
                        </div>
                        <div className={styles.stopRight}>
                          <button className="btn" onClick={() => moveStop(i, -1)} disabled={i === 0} title="Move up">▲</button>
                          <button className="btn" onClick={() => moveStop(i, 1)} disabled={i === stops.length - 1} title="Move down">▼</button>
                          <button className="btn btn-danger" onClick={() => removeStop(stop.id)} title="Remove">✕</button>
                        </div>
                      </div>
                      {i < stops.length - 1 && (
                        <div className={styles.distConnector}>
                          {distLoading
                            ? <span className={styles.distLoading}>·· calculating ··</span>
                            : distances[i]
                              ? <span className={styles.distVal}>▼ {distances[i].miles} mi · {distances[i].mins} min</span>
                              : <span className={styles.distVal}>▼</span>}
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
            {stops.length > 0 && (
              <div className="statusbar">
                <span>{stops.length} stop{stops.length !== 1 ? 's' : ''}</span>
                {totalStr && <span>{totalStr}</span>}
                <span>▲▼ to reorder</span>
              </div>
            )}
          </div>

          {/* Route Map */}
          {stops.length > 0 && (
            <div className={styles.mapWindow + ' window'}>
              <div className="window-titlebar">
                <span className="window-title">🗺 ROUTE MAP — OpenStreetMap</span>
                <div className="window-controls">
                  <button className="window-btn">_</button>
                  <button className="window-btn">□</button>
                </div>
              </div>
              <div className={styles.mapContainer}>
                {MapComp
                  ? <MapComp stops={stops} />
                  : <div className={styles.mapLoading}>Loading map...</div>}
              </div>
              <div className="statusbar">
                <span>{stops.filter(s => s.lat && s.lng).length} plotted</span>
                {totalStr && <span>{totalStr}</span>}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="window">
            <div className="window-titlebar">
              <span className="window-title">TRIP NOTES</span>
            </div>
            <div className="window-content">
              <textarea
                className={styles.notesArea}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about your trip, opening hours, things to bring..."
                rows={5}
              />
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className="window">
            <div className="window-titlebar">
              <span className="window-title">PRINT & EXPORT</span>
            </div>
            <div className="window-content">
              <div className={styles.printPreview}>
                <div className={styles.previewDoc}>
                  <div className={styles.previewHeader}>🎬 SF FILM GUIDE</div>
                  <div className={styles.previewTitle}>MY TRIP ITINERARY</div>
                  <div className={styles.previewDate}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className={styles.previewDivider}>{'═'.repeat(28)}</div>
                  {stops.slice(0, 3).map((s, i) => (
                    <div key={s.id} className={styles.previewStop}>
                      <strong>STOP {i + 1}:</strong> {s.name}<br />
                      <span className={styles.previewAddr}>{s.address}</span>
                      {i < Math.min(stops.length, 3) - 1 && (
                        <div className={styles.previewArrow}>
                          ▼{distances[i] ? ` ${distances[i].miles}mi` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                  {stops.length > 3 && <div className={styles.previewMore}>...+{stops.length - 3} more stops</div>}
                  {stops.length === 0 && <div className={styles.previewEmpty}>[Add stops to preview]</div>}
                  {totalStr && <div className={styles.previewTotal}>{totalStr}</div>}
                  <div className={styles.previewDivider} style={{ marginTop: 6 }}>{'─'.repeat(28)}</div>
                  <div className={styles.previewFooter}>SF Film Guide · sffilmguide.local</div>
                </div>
              </div>

              <div className={styles.printActions}>
                <PrintRouteButton stops={stops} notes={notes} distances={distances} />
              </div>

              <button
                className={styles.mapsBtn}
                onClick={openInGoogleMaps}
                disabled={stops.filter(s => s.lat && s.lng).length === 0}
              >
                🗺 OPEN IN GOOGLE MAPS
              </button>

              <div className={styles.printTip}>
                Print at 100% scale for best results. Google Maps opens your full driving route instantly!
              </div>
            </div>
          </div>

          <div className="window" style={{ marginTop: 16 }}>
            <div className="window-titlebar">
              <span className="window-title">ADD MORE SPOTS</span>
            </div>
            <div className="window-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/sf-guide/locations" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                🗺 Browse Film Locations
              </Link>
              <Link to="/sf-guide/shops" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                🎞 Browse Local Spots
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrintRouteButton({ stops, notes, distances }) {
  const handlePrint = () => {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const totalMiles = distances.reduce((sum, d) => sum + parseFloat(d?.miles || 0), 0).toFixed(1)
    const totalMins = distances.reduce((sum, d) => sum + (d?.mins || 0), 0)
    const totalHours = Math.floor(totalMins / 60)
    const remMins = totalMins % 60
    const totalStr = distances.length > 0
      ? `${totalMiles} mi · ${totalHours > 0 ? `${totalHours}h ` : ''}${remMins}min total drive time`
      : ''

    const stopsHtml = stops.map((s, i) => `
      <div class="stop">
        <div class="stop-header">
          <span class="stop-num">STOP ${i + 1}</span>
          <span class="stop-name">${s.name}</span>
        </div>
        <div class="stop-address">${s.address}</div>
        ${s.neighborhood ? `<div class="stop-neighborhood">${s.neighborhood}</div>` : ''}
      </div>
      ${i < stops.length - 1 ? `<div class="dist-row">▼ ${distances[i] ? `${distances[i].miles} mi &middot; ${distances[i].mins} min` : '·'}</div>` : ''}
    `).join('')

    const notesHtml = notes ? `
      <div class="notes-section">
        <div class="notes-label">:: NOTES ::</div>
        <div class="notes-text">${notes.replace(/\n/g, '<br/>')}</div>
      </div>
    ` : ''

    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>SF Film Guide — My Trip</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      background-color:#4a0015;
      background-image:${SPLATTER_SVG};
      background-size:100% 100%;
      color:#fce0e8;
      font-family:'VT323',monospace;
      max-width:740px;
      margin:0 auto;
      padding:36px 44px 44px;
      min-height:100vh;
    }
    .logo{font-family:'Press Start 2P',monospace;font-size:12px;color:#ff1466;text-shadow:0 0 10px #ff1466,0 0 20px rgba(255,20,102,.4);letter-spacing:2px;margin-bottom:8px}
    .title{font-family:'Press Start 2P',monospace;font-size:9px;color:#fff;letter-spacing:2px;border-bottom:2px solid #ff1466;padding-bottom:7px;margin-bottom:7px;text-shadow:1px 1px 0 #1a000a}
    .date{font-size:20px;color:#d05078;margin-bottom:2px}
    .total{font-family:'Press Start 2P',monospace;font-size:6px;color:#ff1466;letter-spacing:1px;margin-bottom:4px;text-shadow:0 0 6px rgba(255,20,102,.4)}
    .divider{font-size:13px;color:#8b1535;margin:10px 0 16px;letter-spacing:1px}
    .stop{margin-bottom:8px;padding-left:10px;border-left:2px solid #8b1535}
    .stop-header{display:flex;align-items:center;gap:10px;margin-bottom:3px}
    .stop-num{font-family:'Press Start 2P',monospace;font-size:7px;color:#fff;background:#ff1466;padding:3px 6px;border:1px solid #ff4488;flex-shrink:0;text-shadow:1px 1px 0 #1a000a}
    .stop-name{font-size:24px;color:#fff;text-shadow:1px 1px 0 #1a000a;line-height:1}
    .stop-address{font-family:Verdana,Tahoma,sans-serif;font-size:10px;color:#d05078;margin-left:2px}
    .stop-neighborhood{font-family:'Press Start 2P',monospace;font-size:5px;color:#b83558;margin-left:2px;margin-top:2px}
    .dist-row{font-size:20px;color:#ff1466;text-shadow:0 0 6px rgba(255,20,102,.5);margin:5px 0 5px 12px}
    .notes-section{border-top:1px dashed #8b1535;padding-top:16px;margin:20px 0}
    .notes-label{font-family:'Press Start 2P',monospace;font-size:7px;color:#ff1466;margin-bottom:8px;letter-spacing:2px;text-shadow:0 0 6px rgba(255,20,102,.4)}
    .notes-text{font-size:20px;color:#fce0e8;line-height:1.5;white-space:pre-wrap}
    .footer{text-align:center;border-top:1px solid #8b1535;padding-top:12px;margin-top:24px}
    .footer-main{font-size:18px;color:#b83558}
    .footer-small{font-family:Verdana,Tahoma,sans-serif;font-size:9px;color:#d05078;font-style:italic;margin-top:4px}
    @media print{
      body{background-color:#fff;background-image:none;color:#000;padding:12px 20px}
      .logo{color:#8b1535;text-shadow:none}
      .title{color:#000;text-shadow:none;border-color:#8b1535}
      .date{color:#555}.total{color:#8b1535}.divider{color:#8b1535}
      .stop{border-color:#8b1535}.stop-name{color:#000;text-shadow:none}
      .stop-address{color:#444}.stop-neighborhood{color:#8b1535}
      .dist-row{color:#8b1535;text-shadow:none}
      .notes-label{color:#8b1535;text-shadow:none}.notes-text{color:#000}
      .footer-main{color:#555}.footer-small{color:#888}
    }
  </style>
</head>
<body>
  <div class="logo">🎬 SF FILM GUIDE</div>
  <div class="title">MY TRIP ITINERARY</div>
  <div class="date">Printed: ${date}</div>
  ${totalStr ? `<div class="total">${totalStr}</div>` : ''}
  <div class="divider">${'═'.repeat(52)}</div>
  ${stopsHtml}
  ${notesHtml}
  <div class="footer">
    <div class="footer-main">SF Film Guide &middot; sffilmguide.local &middot; ${stops.length} stop${stops.length !== 1 ? 's' : ''}</div>
    <div class="footer-small">Keep this printout with you during your tour!</div>
  </div>
  <script>window.onload=()=>window.print()<\/script>
</body></html>`)
    win.document.close()
  }

  return (
    <button
      className={styles.printBtn}
      onClick={handlePrint}
      disabled={stops.length === 0}
    >
      🖨 PRINT GPS ROUTE
    </button>
  )
}
