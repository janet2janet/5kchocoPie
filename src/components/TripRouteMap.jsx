import { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function TripRouteMap({ stops }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      center: [37.77, -122.43],
      zoom: 12,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      layersRef.current = []
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    layersRef.current.forEach(l => { try { map.removeLayer(l) } catch {} })
    layersRef.current = []

    const valid = stops.filter(s => s.lat && s.lng)
    if (valid.length === 0) return

    const latlngs = valid.map(s => [s.lat, s.lng])

    if (valid.length > 1) {
      const line = L.polyline(latlngs, {
        color: '#ff1466',
        weight: 3,
        opacity: 0.85,
        dashArray: '8,10',
      }).addTo(map)
      layersRef.current.push(line)
    }

    valid.forEach((stop, i) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;background:#4a0015;border:2px solid #ff1466;color:#fff;font-family:monospace;font-size:10px;font-weight:bold;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px rgba(255,20,102,0.6)">${i + 1}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -16],
      })
      const marker = L.marker([stop.lat, stop.lng], { icon })
        .bindPopup(`<b style="font-family:monospace;font-size:12px">${stop.name}</b><br/><small style="color:#666">${stop.address}</small>`)
        .addTo(map)
      layersRef.current.push(marker)
    })

    if (valid.length === 1) {
      map.setView(latlngs[0], 15)
    } else {
      map.fitBounds(latlngs, { padding: [40, 40] })
    }
  }, [stops])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
