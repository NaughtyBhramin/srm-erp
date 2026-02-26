import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Car, Users, GraduationCap, BarChart3,
  LogOut, Bell, MapPin, FileText, AlertTriangle,
  ParkingSquare, Bike, Flame, BookOpen, Bus, Video,
  Calculator, Megaphone, ChevronDown, ChevronRight,
  Settings, Search, X, Menu
} from 'lucide-react'

const NAV = [
  { label: 'CORE', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  ]},
  { label: 'CAMPUS LIFE', items: [
    { to: '/social', icon: Flame, label: 'Social Feed', badge: '3' },
    { to: '/study', icon: BookOpen, label: 'Study Hub' },
    { to: '/transport', icon: Bus, label: 'Transport' },
    { to: '/rooms', icon: Video, label: 'Meeting Rooms' },
  ]},
  { label: 'PARKING', items: [
    { to: '/parking', icon: ParkingSquare, label: 'Overview' },
    { to: '/parking/vehicles', icon: Car, label: 'Vehicles' },
    { to: '/parking/zones', icon: MapPin, label: 'Zones' },
    { to: '/parking/permits', icon: FileText, label: 'Permits' },
    { to: '/parking/violations', icon: AlertTriangle, label: 'Violations' },
  ]},
  { label: 'ACADEMIC', items: [
    { to: '/students', icon: GraduationCap, label: 'Students' },
    { to: '/accounts', icon: Calculator, label: 'Accounts' },
  ]},
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [expanded, setExpanded] = useState(true)
  const [notifications] = useState(3)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const pageTitle = NAV.flatMap(g => g.items).find(i => location.pathname.startsWith(i.to) && i.to !== '/dashboard')?.label
    || (location.pathname === '/dashboard' ? 'Dashboard' : '')

  return (
    <div className="app-shell">
      {/* Ambient glows */}
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />

      {/* Sidebar */}
      <aside className={`sidebar ${expanded ? 'expanded' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">S</div>
          {expanded && (
            <div className="logo-text">
              <div className="logo-title">SRM ERP</div>
              <div className="logo-sub">SRMIST · 2025</div>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: 'auto', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
          >
            {expanded ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>

        {/* Nav */}
        <div className="nav-section">
          {NAV.map(group => (
            <div key={group.label} style={{ marginBottom: '4px' }}>
              {expanded && <div className="nav-label">{group.label}</div>}
              {group.items.map(({ to, icon: Icon, label, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/dashboard'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={!expanded ? label : undefined}
                >
                  <Icon size={17} className="nav-icon" />
                  {expanded && <span style={{ flex: 1 }}>{label}</span>}
                  {expanded && badge && <span className="nav-badge">{badge}</span>}
                </NavLink>
              ))}
              {!expanded && <div style={{ height: '4px' }} />}
            </div>
          ))}
        </div>

        {/* User */}
        <div className="nav-user">
          <div className="user-avatar">{user?.full_name?.[0] || 'U'}</div>
          {expanded && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name || 'User'}</div>
              <div className="user-role" style={{ textTransform: 'capitalize' }}>{user?.role || 'member'}</div>
            </div>
          )}
          {expanded && (
            <button onClick={() => { logout(); navigate('/login') }}
              style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <LogOut size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="topbar-title heading">{pageTitle || 'SRM ERP'}</span>
            <span className="live-dot">LIVE</span>
          </div>
          <div className="topbar-right">
            <div className="mono" style={{ fontSize: '13px', color: 'var(--text-3)' }}>
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
              <Bell size={16} />
              {notifications > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%', border: '2px solid var(--bg-base)' }} />
              )}
            </button>
            <div className="badge badge-green">● Online</div>
          </div>
        </div>

        {/* Page content */}
        <div className="page-body fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
