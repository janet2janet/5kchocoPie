import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import SFGuideHome from './pages/SFGuideHome'
import FilmLocations from './pages/FilmLocations'
import LocalShops from './pages/LocalShops'
import TripPlanner from './pages/TripPlanner'
import TripNotesPanel from './components/TripNotesPanel'
import SFGuideLayout from './layouts/SFGuideLayout'
import { TripProvider } from './contexts/TripContext'

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route element={<SFGuideLayout />}>
            <Route path="/sf-guide" element={<SFGuideHome />} />
            <Route path="/sf-guide/locations" element={<FilmLocations />} />
            <Route path="/sf-guide/shops" element={<LocalShops />} />
            <Route path="/sf-guide/planner" element={<TripPlanner />} />
          </Route>
        </Routes>
        <TripNotesPanel />
      </BrowserRouter>
    </TripProvider>
  )
}
