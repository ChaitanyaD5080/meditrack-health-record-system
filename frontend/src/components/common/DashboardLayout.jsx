import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'

function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-border sticky top-0 z-10">
          <span onClick={() => navigate('/')} className="font-display text-lg text-ink cursor-pointer">
            Medi<span className="text-primary italic">Track</span>
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="text-xs font-medium text-body hover:text-primary">
              Log out
            </button>
          </div>
        </div>

        <main className="px-5 sm:px-8 py-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout