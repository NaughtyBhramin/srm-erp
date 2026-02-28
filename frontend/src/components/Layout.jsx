import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, ROLE_META } from '../context/AuthContext'

const NAV_CONFIG = {
  admin: [
    { section:'OVERVIEW',  items:[{ path:'/dashboard', icon:'◈', label:'Dashboard' },{ path:'/analytics', icon:'◉', label:'Analytics' }]},
    { section:'CAMPUS',    items:[{ path:'/colleges', icon:'⬡', label:'Colleges' },{ path:'/students', icon:'◆', label:'Students' },{ path:'/faculty-mgmt', icon:'◇', label:'Faculty' }]},
    { section:'OPERATIONS',items:[{ path:'/accounts', icon:'◉', label:'Accounts' },{ path:'/hostel', icon:'⬟', label:'Hostels' },{ path:'/parking', icon:'◈', label:'Parking', badge:'3' },{ path:'/transport', icon:'⬡', label:'Transport' },{ path:'/medical', icon:'✦', label:'Medical' }]},
    { section:'COMMUNITY', items:[{ path:'/social', icon:'◆', label:'Social Feed' },{ path:'/chat', icon:'◇', label:'Chat', badge:'7' }]},
  ],
  student: [
    { section:'MY CAMPUS',  items:[{ path:'/dashboard', icon:'◈', label:'Home' },{ path:'/social', icon:'◆', label:'College Feed', badge:'4' },{ path:'/chat', icon:'◇', label:'Messages', badge:'2' }]},
    { section:'ACADEMICS',  items:[{ path:'/study', icon:'⬡', label:'Study Hub' },{ path:'/attendance', icon:'◉', label:'Attendance' },{ path:'/fees', icon:'◈', label:'Fees & Dues' }]},
    { section:'CAMPUS LIFE',items:[{ path:'/hostel', icon:'⬟', label:'My Room' },{ path:'/mess', icon:'✦', label:'Mess Menu' },{ path:'/transport', icon:'◆', label:'My Bus' },{ path:'/medical', icon:'◇', label:'Medical' },{ path:'/parking', icon:'◉', label:'Parking' }]},
  ],
  faculty: [
    { section:'TEACHING',  items:[{ path:'/dashboard', icon:'◈', label:'Dashboard' },{ path:'/courses', icon:'◆', label:'My Courses' },{ path:'/timetable', icon:'⬡', label:'Timetable' },{ path:'/attendance', icon:'◉', label:'Mark Attendance' }]},
    { section:'STUDENTS',  items:[{ path:'/my-students', icon:'◇', label:'My Students' },{ path:'/study', icon:'⬟', label:'Upload Materials' }]},
    { section:'PERSONAL',  items:[{ path:'/salary', icon:'◈', label:'Salary' },{ path:'/social', icon:'◆', label:'College Feed' },{ path:'/chat', icon:'◇', label:'Messages' },{ path:'/parking', icon:'✦', label:'Parking' }]},
  ],
  accounts: [
    { section:'FINANCE',   items:[{ path:'/dashboard', icon:'◈', label:'Overview' },{ path:'/fees', icon:'◆', label:'Fee Collection', badge:'12' },{ path:'/salary', icon:'◇', label:'Salary Payroll' },{ path:'/invoicing', icon:'⬡', label:'Invoicing' }]},
    { section:'REPORTS',   items:[{ path:'/reports', icon:'◉', label:'Reports' },{ path:'/analytics', icon:'⬟', label:'Analytics' }]},
  ],
  security: [
    { section:'OPERATIONS',items:[{ path:'/dashboard', icon:'◈', label:'Gate Overview' },{ path:'/parking', icon:'◆', label:'Parking Grid' },{ path:'/vehicles', icon:'⬡', label:'Vehicles' },{ path:'/violations', icon:'◉', label:'Violations', badge:'5' }]},
    { section:'LOG',       items:[{ path:'/gate-log', icon:'◇', label:'Gate Log' }]},
  ],
  transport: [
    { section:'LIVE',      items:[{ path:'/dashboard', icon:'◈', label:'Live Overview' },{ path:'/buses', icon:'◆', label:'Bus Tracking' },{ path:'/routes', icon:'⬡', label:'Routes' }]},
    { section:'MANAGE',    items:[{ path:'/bookings', icon:'◇', label:'Bookings' },{ path:'/attendance', icon:'◉', label:'Bus Attendance' },{ path:'/drivers', icon:'⬟', label:'Drivers' }]},
  ],
  medical: [
    { section:'CLINIC',    items:[{ path:'/dashboard', icon:'◈', label:'Today\'s Overview' },{ path:'/visits', icon:'◆', label:'Patient Visits' },{ path:'/records', icon:'⬡', label:'Health Records' }]},
    { section:'INVENTORY', items:[{ path:'/inventory', icon:'◇', label:'Medicines', badge:'3' },{ path:'/appointments', icon:'◉', label:'Appointments' }]},
  ],
  parent: [
    { section:'MY CHILD',  items:[{ path:'/dashboard', icon:'◈', label:'Overview' },{ path:'/child-academics', icon:'◆', label:'Academics' },{ path:'/fees', icon:'◇', label:'Fee Portal' },{ path:'/messages', icon:'⬡', label:'Messages', badge:'1' }]},
    { section:'CAMPUS',    items:[{ path:'/child-transport', icon:'◉', label:'Transport' },{ path:'/child-medical', icon:'⬟', label:'Health' }]},
  ],
}

export default function Layout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})), 1000)
    return () => clearInterval(t)
  }, [])

  if (!user) { navigate('/'); return null }

  const meta = ROLE_META[user.role]
  const navSections = NAV_CONFIG[user.role] || []
  const initials = user.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

  // Set CSS accent var
  document.documentElement.style.setProperty('--accent', meta.color)
  document.documentElement.style.setProperty('--accent-soft', meta.bg)

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${collapsed?'collapsed':''}`}>
        {/* Logo */}
        <div className="sb-logo-area">
          <div className="sb-logo-mark" style={{ background:`linear-gradient(135deg,${meta.color},${meta.color}88)` }}>S</div>
          {!collapsed && <div className="sb-logo-text">
            <div className="sb-logo-name">SRM ERP</div>
            <div className="sb-logo-sub">SRMIST · Campus Intelligence</div>
          </div>}
          <button onClick={()=>setCollapsed(!collapsed)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--t3)', fontSize:'16px', flexShrink:0 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Role chip */}
        <div className="sb-role-chip">
          <div className="sb-role-dot" />
          {!collapsed && <span className="sb-role-label">{meta.label?.toUpperCase()}</span>}
        </div>

        {/* College strip (if has college) */}
        {user.college && !collapsed && (
          <div className="college-strip" style={{ borderColor: user.collegeColor+'33' }}>
            <div className="college-dot" style={{ background: user.collegeColor }} />
            <div>
              <div className="college-name-sm" style={{ color: user.collegeColor }}>{user.collegeCode} · {user.college}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sb-nav">
          {navSections.map(sec => (
            <div key={sec.section} className="nav-section">
              {!collapsed && <span className="nav-section-label">{sec.section}</span>}
              {sec.items.map(item => (
                <div key={item.path}
                  className={`nav-item ${location.pathname===item.path?'active':''}`}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                  {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sb-user">
          <div className="user-av" style={{ background:`linear-gradient(135deg,${meta.color},${meta.color}88)` }}>{initials}</div>
          {!collapsed && <div style={{overflow:'hidden'}}>
            <div className="user-name">{user.name}</div>
            <div className="user-meta">{user.dept || user.role}</div>
          </div>}
          {!collapsed && <button className="logout-btn" onClick={()=>{logout();navigate('/')}} title="Logout">⇤</button>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <div className="live-dot">LIVE</div>
            <span className="topbar-clock">{time}</span>
            <div className="topbar-icon-btn" title="Notifications">
              🔔<span className="notif-pip"/>
            </div>
            <div className="topbar-icon-btn" title="Search">🔍</div>
          </div>
        </header>

        {/* Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
