import { createContext, useContext, useState, useEffect } from 'react'

const TripContext = createContext()

export function TripProvider({ children }) {
  const [stops, setStops] = useState([])
  const [notes, setNotes] = useState('')
  const [distances, setDistances] = useState([])
  const [distLoading, setDistLoading] = useState(false)

  // Fetch driving distances from OSRM (free, no API key)
  // distances[i] = { miles, mins } between stops[i] and stops[i+1]
  useEffect(() => {
    const valid = stops.filter(s => s.lat && s.lng)
    if (valid.length < 2) { setDistances([]); return }
    const ctrl = new AbortController()
    setDistLoading(true)
    const coords = valid.map(s => `${s.lng},${s.lat}`).join(';')
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&steps=false`,
      { signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(data => {
        if (data.routes?.[0]?.legs) {
          setDistances(data.routes[0].legs.map(leg => ({
            miles: (leg.distance * 0.000621371).toFixed(1),
            mins: Math.round(leg.duration / 60),
          })))
        } else {
          setDistances([])
        }
      })
      .catch(e => { if (e.name !== 'AbortError') setDistances([]) })
      .finally(() => setDistLoading(false))
    return () => ctrl.abort()
  }, [stops])

  const addStop = (stop) => {
    setStops(prev => prev.find(s => s.id === stop.id) ? prev : [...prev, stop])
  }
  const removeStop = (id) => setStops(prev => prev.filter(s => s.id !== id))
  const moveStop = (index, dir) => {
    setStops(prev => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <TripContext.Provider value={{ stops, notes, setNotes, addStop, removeStop, moveStop, distances, distLoading }}>
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => useContext(TripContext)
