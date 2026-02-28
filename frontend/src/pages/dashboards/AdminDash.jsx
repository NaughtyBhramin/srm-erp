import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLLEGES = [
  { name:'Vivekananda College', code:'VC', color:'#ff6b35', students:3840, capacity:4000, faculty:92, hostellers:1200, fees_collected:94, fees_total:110 },
  { name:'Kalam College',       code:'KC', color:'#5b6ef5', students:3512, capacity:3800, faculty:87, hostellers:1050, fees_collected:89, fees_total:105 },
  { name:'Tagore College',      code:'TC', color:'#00c896', students:3200, capacity:3500, faculty:78, hostellers:980, fees_collected:81, fees_total:98 },
  { name:'Bose College',        code:'BC', color:'#e8b400', students:2890, capacity:3200, faculty:72, hostellers:860, fees_collected:74, fees_total:92 },
]
const KPIS = [
  { icon:'🎓', v:'14,820', l:'UG Students', d:'+124 this sem' },
  { icon:'🏛', v:'4',      l:'Colleges',    d:'Vivekananda, Kalam, Tagore, Bose' },
  { icon:'👨‍🏫', v:'892',    l:'Faculty',     d:'+12 new' },
  { icon:'🏨', v:'4,090',  l:'Hostellers',  d:'88% occupancy' },
  { icon:'🚌', v:'5',      l:'Bus Routes',  d:'3 on-time · 2 delayed' },
  { icon:'🏥', v:'23',     l:'Visits Today',d:'3 emergency' },
  { icon:'🅿', v:'1,030',  l:'Parking',     d:'67% occupied' },
  { icon:'💰', v:'₹128Cr', l:'Revenue YTD', d:'94% collection' },
]
const HOURLY = Array.from({length:12},(_,i)=>({ t:`${7+i}:00`, entries: Math.floor(80+Math.random()*120), exits: Math.floor(40+Math.random()*100) }))
const PIE = [{ n:'Tuition',v:68 },{ n:'Hostel',v:12 },{ n:'Transport',v:8 },{ n:'Mess',v:6 },{ n:'Misc',v:6 }]
const PIE_COLORS = ['#5b6ef5','#ff6b35','#00c896','#e8b400','#e879c0']

const ALERTS = [
  { type:'warning', msg:'3 buses delayed — Velachery route (Est. +12 min)', time:'2m ago' },
  { type:'error',   msg:'Medical room low stock: Paracetamol 500mg (<10 units)', time:'15m ago' },
  { type:'info',    msg:'Fee deadline tomorrow — 847 students pending', time:'1h ago' },
  { type:'success', msg:'Kalam College hostel at 98% capacity', time:'2h ago' },
]

export default function AdminDash() {
  return (
    <div>
      {/* Hero */}
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(255,107,53,0.15) 0%,rgba(255,107,53,0.04) 100%)', border:'1px solid rgba(255,107,53,0.2)' }}>
        <div className="hero-greeting" style={{ color:'#ff6b35' }}>System Administrator</div>
        <div className="hero-name">Good morning, Dr. Rajkumar 👋</div>
        <div className="hero-meta">SRM Institute of Science and Technology · Kattankulathur · {new Date().toDateString()}</div>
      </div>

      {/* KPIs */}
      <div className="g4 fade-up-1" style={{ marginBottom:'20px' }}>
        {KPIS.map((k,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon">{k.icon}</div>
            <div className="stat-value">{k.v}</div>
            <div className="stat-label">{k.l}</div>
            <div className="stat-delta" style={{ color:'var(--t3)', fontSize:'10.5px' }}>{k.d}</div>
          </div>
        ))}
      </div>

      <div className="g2 fade-up-2" style={{ marginBottom:'20px' }}>
        {/* College Cards */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">Residential Colleges</div><div className="card-sub">Cross-college occupancy & fee status</div></div>
          </div>
          {COLLEGES.map(c=>(
            <div key={c.code} style={{ marginBottom:'16px', paddingBottom:'16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:c.color+'22', border:`1px solid ${c.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'11px', fontWeight:800, color:c.color }}>{c.code}</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>{c.name}</div>
                  <div style={{ fontSize:'11px', color:'var(--t3)' }}>{c.students.toLocaleString()} students · {c.faculty} faculty</div>
                </div>
                <div style={{ marginLeft:'auto', textAlign:'right' }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color: c.fees_collected/c.fees_total > 0.85 ? 'var(--faculty)' : 'var(--accounts)' }}>₹{c.fees_collected}Cr</div>
                  <div style={{ fontSize:'10px', color:'var(--t3)' }}>of ₹{c.fees_total}Cr</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <div className="progress-bar" style={{ flex:1 }}>
                  <div className="progress-fill" style={{ width:`${c.students/c.capacity*100}%`, background:c.color }} />
                </div>
                <span style={{ fontSize:'10px', color:'var(--t3)', whiteSpace:'nowrap' }}>{Math.round(c.students/c.capacity*100)}% full</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts + Pie */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'12px' }}>⚡ Live Alerts</div>
            {ALERTS.map((a,i)=>(
              <div key={i} style={{ display:'flex', gap:'10px', padding:'10px', borderRadius:'9px', background:'var(--glass)', border:'1px solid var(--border)', marginBottom:'8px' }}>
                <span style={{ fontSize:'16px' }}>{ a.type==='error'?'🔴':a.type==='warning'?'🟡':a.type==='success'?'🟢':'🔵' }</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px', color:'var(--t1)', lineHeight:1.45 }}>{a.msg}</div>
                  <div style={{ fontSize:'10px', color:'var(--t3)', marginTop:'3px' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'4px' }}>Revenue Breakdown</div>
            <div className="card-sub" style={{ marginBottom:'12px' }}>FY 2024–25</div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={PIE} cx="50%" cy="50%" outerRadius={60} dataKey="v" label={({n,v})=>`${n} ${v}%`} labelLine fontSize={9}>
                  {PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'9px', fontSize:'11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="card card-p fade-up-3">
        <div className="card-header">
          <div><div className="card-title">Campus Traffic Today</div><div className="card-sub">Gate entries & exits by hour</div></div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={HOURLY}>
            <defs>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5b6ef5" stopOpacity={0.3}/><stop offset="95%" stopColor="#5b6ef5" stopOpacity={0}/></linearGradient>
              <linearGradient id="gX" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fill:'var(--t3)', fontSize:10 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'var(--t3)', fontSize:10 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'9px', fontSize:'11px' }}/>
            <Area type="monotone" dataKey="entries" stroke="#5b6ef5" fill="url(#gE)" strokeWidth={2} name="Entries"/>
            <Area type="monotone" dataKey="exits"   stroke="#ff6b35" fill="url(#gX)" strokeWidth={2} name="Exits"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
