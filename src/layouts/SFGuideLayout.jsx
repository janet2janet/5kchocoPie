import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export default function SFGuideLayout() {
  useEffect(() => {
    document.body.classList.add('sfguide')
    return () => document.body.classList.remove('sfguide')
  }, [])
  return <Outlet />
}
