import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat']
const TT = {
  Mon:[ {c:'CS3401 — OS Theory',      room:'TechA-301',time:'08:00–09:00',color:'#5b6ef5'},{c:'CS3501 — Networks',   room:'TechA-101',time:'11:00–12:00',color:'#00c896'},{c:'CS3401 — OS Lab',room:'Lab-C04',time:'14:00–16:00',color:'#5b6ef5'} ],
  Tue:[ {c:'CS3501 — Networks',        room:'TechA-101',time:'09:00–10:00',color:'#00c896'},{c:'Research Review',    room:'Conf-R01', time:'14:00–15:00',color:'#e8b400'} ],
  Wed:[ {c:'CS3401 — OS Theory',       room:'TechA-301',time:'08:00–09:00',color:'#5b6ef5'},{c:'Student Mentoring',  room:'Cabin-F3', time:'11:00–12:00',color:'#e879c0'} ],
  Thu:[ {c:'CS3501 — Networks',        room:'TechA-101',time:'09:00–10:00',color:'#00c896'},{c:'CS3401 — OS Theory', room:'TechA-301',time:'11:00–12:00',color:'#5b6ef5'} ],
  Fri:[ {c:'CS3501 — Networks Lab',    room:'Lab-B08',  time:'08:00–10:00',color:'#00c896'},{c:'Dept Meeting',       room:'Conf-R01', time:'14:00–15:00',color:'#ff6b35'} ],
  Sat:[ {c:'OS Theory — Extra Class',  room:'TechA-301',time:'09:00–10:00',color:'#5b6ef5'} ],
}
const COURSES = [
  { code:'CS3401', name:'OS Theory',      students:62, avg_att:78, submissions:58, pending_grading:12, sem:6 },
  { code:'CS3501', name:'Comp. Networks', students:55, avg_att:71, submissions:50, pending_grading:5,  sem:6 },
]
const WATCHLIST = [
  { name:'Arun Patel',     reg:'RA2111003010023', att:58, cgpa:5.8, course:'CS3401', status:'danger' },
  { name:'Meena Raj',      reg:'RA2111003010045', att:63, cgpa:6.2, course:'CS3501', status:'warn' },
  { name:'Vikram Singh',   reg:'RA2111003010067', att:68, cgpa:7.1, course:'CS3401', status:'warn' },
]
const ATT_TREND = DAYS.map(d=>({ day:d, att: Math.floor(68+Math.random()*20) }))

export default function FacultyDash() {
  const { user } = useAuth()
  return (
    <div>
      {/* Hero */}
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(0,200,150,0.12) 0%,rgba(0,200,150,0.03) 100%)', border:'1px solid rgba(0,200,150,0.2)', marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              {user.college && <div style={{ fontSize:'11px', fontWeight:700, color:user.collegeColor, letterSpacing:'0.06em', textTransform:'uppercase', background:`${user.collegeColor}15`, padding:'3px 10px', borderRadius:'20px', border:`1px solid ${user.collegeColor}30` }}>{user.collegeCode} Warden</div>}
            </div>
            <div className="hero-name">{user.name}</div>
            <div className="hero-meta">{user.designation} · Dept. of {user.dept} · {user.empId}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[['117','Students'],['2','Courses'],['78%','Avg Att.'],['₹92,400','Salary']].map(([v,l])=>(
              <div key={l} style={{ padding:'10px 14px', borderRadius:'10px', background:'rgba(0,200,150,0.08)', border:'1px solid rgba(0,200,150,0.15)', textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:800, color:'var(--faculty)' }}>{v}</div>
                <div style={{ fontSize:'10px', color:'var(--t3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="card card-p fade-up-1" style={{ marginBottom:'20px' }}>
        <div className="card-title" style={{ marginBottom:'14px' }}>📅 Weekly Timetable</div>
        <div className="timetable-strip">
          {DAYS.map(d=>(
            <div key={d} className="tt-day">
              <div className="tt-day-name">{d}</div>
              {(TT[d]||[]).map((s,i)=>(
                <div key={i} className="tt-slot" style={{ background:`${s.color}12`, borderLeftColor:s.color }}>
                  <div className="tt-course">{s.c}</div>
                  <div className="tt-time">{s.time}</div>
                  <div className="tt-room">{s.room}</div>
                </div>
              ))}
              {!TT[d]?.length && <div style={{ fontSize:'10px', color:'var(--t4)', padding:'8px 0' }}>Free</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="g2 fade-up-2" style={{ marginBottom:'20px' }}>
        {/* Course Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {COURSES.map(c=>(
            <div key={c.code} className="card card-p">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                <div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t3)' }}>{c.code}</div>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'var(--t1)', marginTop:'2px' }}>{c.name}</div>
                </div>
                <span className="badge badge-blue">Sem {c.sem}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'12px' }}>
                {[['Students',c.students,'var(--t1)'],['Avg Att.',`${c.avg_att}%`,c.avg_att<75?'var(--security)':'var(--faculty)'],['Submissions',c.submissions,'var(--t1)']].map(([l,v,col])=>(
                  <div key={l} style={{ textAlign:'center', padding:'8px', borderRadius:'8px', background:'var(--glass)', border:'1px solid var(--border)' }}>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:800, color:col }}>{v}</div>
                    <div style={{ fontSize:'9.5px', color:'var(--t3)' }}>{l}</div>
                  </div>
                ))}
              </div>
              {c.pending_grading > 0 && (
                <div style={{ padding:'8px 12px', borderRadius:'8px', background:'rgba(232,180,0,0.08)', border:'1px solid rgba(232,180,0,0.2)', fontSize:'11.5px', color:'var(--accounts)' }}>
                  📝 {c.pending_grading} assignments awaiting grading
                </div>
              )}
            </div>
          ))}
          {/* Attendance trend */}
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'10px' }}>Attendance Trend (This Week)</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={ATT_TREND}>
                <XAxis dataKey="day" tick={{ fill:'var(--t3)', fontSize:10 }} axisLine={false} tickLine={false}/>
                <Bar dataKey="att" fill="#00c896" radius={[4,4,0,0]}/>
                <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'9px', fontSize:'11px' }}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Watchlist */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">⚠️ Student Watchlist</div><div className="card-sub">Low attendance · Needs attention</div></div>
          </div>
          {WATCHLIST.map((s,i)=>(
            <div key={i} style={{ padding:'12px', borderRadius:'10px', border:`1px solid ${s.status==='danger'?'rgba(239,68,68,0.25)':'rgba(232,180,0,0.2)'}`, background:s.status==='danger'?'rgba(239,68,68,0.06)':'rgba(232,180,0,0.06)', marginBottom:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                <div style={{ fontWeight:700, fontSize:'13px', color:'var(--t1)' }}>{s.name}</div>
                <span className={`badge ${s.status==='danger'?'badge-red':'badge-gold'}`}>{s.att}% att</span>
                <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t3)' }}>CGPA {s.cgpa}</span>
              </div>
              <div style={{ fontSize:'11px', color:'var(--t3)' }}>{s.reg} · {s.course}</div>
              <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>📧 Message</button>
                <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>📋 Record</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop:'12px', padding:'10px 14px', borderRadius:'9px', background:'var(--glass)', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'12px', fontWeight:700, color:'var(--t1)' }}>Salary Breakdown — Feb 2025</div>
            <div style={{ display:'flex', gap:'16px', marginTop:'8px' }}>
              {[['Basic','₹72,000','var(--faculty)'],['HRA','₹14,400','var(--t2)'],['Deductions','-₹8,600','var(--security)'],['Net','₹77,800','var(--accounts)']].map(([l,v,c])=>(
                <div key={l}>
                  <div style={{ fontSize:'10px', color:'var(--t3)' }}>{l}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'13px', fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
