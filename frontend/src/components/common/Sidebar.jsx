import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Icon({ path, className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  home: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
  file: 'M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  patients: 'M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 20c.5-3.5 3-6 7-6s6.5 2.5 7 6M15 14c3 .2 5 2.4 5.5 6',
  doctors: 'M6 4v6a6 6 0 0 0 12 0V4M6 4H4M6 4h2M18 4h2M18 4h-2M9 20h6M12 16v4',
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-primary/10 text-primary' : 'text-body hover:bg-surface hover:text-ink'
        }`
      }
    >
      <Icon path={ICONS[icon]} />
      {label}
    </NavLink>
  )
}

const NAV_BY_ROLE = {
 patient: [
  { to: '/patient/dashboard', icon: 'home', label: 'Dashboard' },
  { to: '/patient/doctors', icon: 'search', label: 'Find a Doctor' },
  { to: '/patient/appointments', icon: 'calendar', label: 'Appointments' },
  { to: '/patient/records', icon: 'file', label: 'Medical Records' },
  { to: '/patient/prescriptions', icon: 'pill', label: 'Prescriptions' },
  { to: '/patient/history', icon: 'clock', label: 'Medical History' },
  { to: '/patient/profile', icon: 'user', label: 'Profile' },
],
  doctor: [
    { to: '/doctor/dashboard', icon: 'home', label: 'Dashboard' },
    { to: '/doctor/patients', icon: 'patients', label: 'My Patients' },
    { to: '/doctor/schedule', icon: 'calendar', label: 'Schedule' },
    { to: '/doctor/profile', icon: 'user', label: 'Profile' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
    { to: '/admin/doctors', icon: 'doctors', label: 'Manage Doctors' },
    { to: '/admin/patients', icon: 'patients', label: 'Manage Patients' },
    { to: '/admin/appointments', icon: 'calendar', label: 'Appointments' },
  ],
}

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = NAV_BY_ROLE[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col justify-between bg-white border-r border-border h-screen sticky top-0 px-4 py-6">
      <div>
        <span onClick={() => navigate('/')} className="font-display text-xl text-ink cursor-pointer px-2 block mb-8">
          Medi<span className="text-primary italic">Track</span>
        </span>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
            <p className="text-xs text-body capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3.5 py-2 text-sm font-medium text-body hover:text-primary hover:bg-surface rounded-lg transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar