import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLE_META } from '../context/AuthContext'

const ROLES = [
  { key:'admin',     icon:'🔴', label:'Administrator',     sub:'All modules · System-wide control',         modules:'Colleges, Students, Faculty, Accounts, All Ops' },
  { key:'student',   icon:'🟣', label:'Student',           sub:'College identity · Academics · Social',      modules:'Feed, Chat, Hostel, Mess, Transport, Study' },
  { key:'faculty',   icon:'🟢', label:'Faculty',           sub:'Teaching · Research · Timetable',           modules:'Courses, Attendance, Students, Salary' },
  { key:'accounts',  icon:'🟡', label:'Accounts Officer',  sub:'Fees · Salary · Invoicing',                 modules:'Fee Collection, Payroll, Reports, Invoices' },
  { key:'security',  icon:'🔴', label:'Security Officer',  sub:'Parking · Gate · Violations',               modules:'Parking Grid, Gate Log, Vehicles, Violations' },
  { key:'transport', icon:'🔵', label:'Transport Officer', sub:'Buses · Routes · GPS · Drivers',            modules:'Live Tracking, Routes, Bookings, Attendance' },
  { key:'medical',   icon:'🩷', label:'Medical Officer',   sub:'Visits · Records · Inventory',              modules:'Patient Visits, Health Records, Medicines' },
  { key:'parent',    icon:'🟠', label:'Parent / Guardian', sub:"Child's progress · Fees · Messages",        modules:'Overview, Academics, Fee Portal, Messages' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [hover, setHover]   = useState(null)
  const [clicked, setClicked] = useState(null)

  const go = (key) => {
    setClicked(key); login(key)
    setTimeout(() => navigate('/dashboard'), 350)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#02040a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'36px 20px', fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden' }}>

      {/* Ambient orbs */}
      {[['#5b6ef5','top:-300px;left:-200px'],['#ff6b35','bottom:-200px;right:-150px'],['#00c896','top:40%;left:60%']].map(([c,pos],i)=>(
        <div key={i} style={{ position:'fixed', width:'600px', height:'600px', borderRadius:'50%', background:`radial-gradient(circle,${c}09 0%,transparent 70%)`, pointerEvents:'none', ...Object.fromEntries(pos.split(';').map(p=>p.split(':'))) }} />
      ))}

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'44px', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.3em', color:'rgba(255,255,255,0.2)', textTransform:'uppercase', marginBottom:'18px', display:'flex', alignItems:'center', gap:'14px', justifyContent:'center' }}>
          <span style={{ height:'1px', width:'60px', background:'rgba(255,255,255,0.1)', display:'inline-block' }}/>
          SRM INSTITUTE · KATTANKULATHUR
          <span style={{ height:'1px', width:'60px', background:'rgba(255,255,255,0.1)', display:'inline-block' }}/>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(44px,6vw,80px)', fontWeight:800, color:'#fff', lineHeight:0.95, marginBottom:'14px', letterSpacing:'-2px' }}>
          Campus<br/>
          <span style={{ WebkitTextFillColor:'transparent', WebkitTextStroke:'1.5px rgba(255,255,255,0.25)' }}>Intelligence</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.28)', fontSize:'13.5px', letterSpacing:'0.04em' }}>
          Enterprise Resource Planning v2.0 · Select your role
        </p>
      </div>

      {/* Role grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', width:'100%', maxWidth:'960px', position:'relative', zIndex:1 }}>
        {ROLES.map((r, i) => {
          const meta   = ROLE_META[r.key]
          const isHov  = hover === r.key
          const isClic = clicked === r.key
          return (
            <div key={r.key}
              onClick={() => go(r.key)}
              onMouseEnter={() => setHover(r.key)}
              onMouseLeave={() => setHover(null)}
              style={{
                background: isHov ? meta.bg : 'rgba(255,255,255,0.025)',
                border:`1px solid ${isHov||isClic ? meta.color+'55' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:'18px', padding:'22px 18px 18px', cursor:'pointer',
                transition:'all 0.25s cubic-bezier(.4,0,.2,1)',
                transform: isHov ? 'translateY(-5px)' : isClic ? 'scale(0.96)' : 'none',
                boxShadow: isHov ? `0 24px 60px ${meta.color}20` : 'none',
                opacity: clicked && !isClic ? 0.35 : 1,
                animation:`fadeUp 0.4s ${i*0.04}s ease both`,
              }}
            >
              <div style={{ fontSize:'26px', marginBottom:'10px' }}>{r.icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'13.5px', fontWeight:700, color: isHov ? meta.color : '#fff', marginBottom:'5px', transition:'color .2s' }}>{r.label}</div>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', lineHeight:1.5, marginBottom:'12px' }}>{r.sub}</div>
              <div style={{ fontSize:'10px', color: isHov ? meta.color+'cc' : 'rgba(255,255,255,0.15)', borderTop:`1px solid rgba(255,255,255,0.06)`, paddingTop:'10px', lineHeight:1.6, transition:'color .2s' }}>
                {r.modules}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ marginTop:'32px', fontSize:'11px', color:'rgba(255,255,255,0.15)', letterSpacing:'0.04em', position:'relative', zIndex:1 }}>
        Demo mode · Click any role to enter · No credentials required
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
