import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function makeIcon(num, active) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${active ? '#ff00ff' : '#003399'};
      border:2px solid ${active ? '#00ffff' : '#0099ff'};
      color:#fff;font-family:VT323,monospace;font-size:14px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 ${active ? 10 : 4}px ${active ? '#ff00ff' : '#0099ff'};
      cursor:pointer;
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function SFMap({ locations, selected, onSelect }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, {
      center: [37.785, -122.425],
      zoom: 13,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}
    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeIcon(loc.id, selected?.id === loc.id),
      })
        .addTo(map)
        .bindPopup(`<div style="font-family:VT323,monospace;font-size:16px;min-width:160px">
          <strong style="color:#003399">#${loc.id} ${loc.name}</strong><br/>
          <span style="font-size:13px">${loc.address}</span><br/>
          <em style="font-size:13px;color:#666">${loc.films.join(', ')}</em>
        </div>`)
      marker.on('click', () => onSelect(loc))
      markersRef.current[loc.id] = marker
    })
  }, [locations, selected, onSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected) return
    map.flyTo([selected.lat, selected.lng], 16, { duration: 1 })
  }, [selected])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
