import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'

const TIMETABLE = [
  { time:'08:00', course:'Data Structures',   room:'TechA-204', type:'lecture' },
  { time:'09:00', course:'DBMS Lab',          room:'Lab-B12',   type:'lab' },
  { time:'11:00', course:'Computer Networks', room:'TechA-101', type:'lecture' },
  { time:'14:00', course:'OS Theory',         room:'TechA-301', type:'lecture' },
]
const ATTENDANCE = [
  { sub:'Data Structures', pct:88, credits:4, status:'good' },
  { sub:'DBMS',            pct:74, credits:4, status:'warn' },
  { sub:'Computer Networks',pct:62,credits:3, status:'danger' },
  { sub:'OS Theory',       pct:91, credits:3, status:'good' },
  { sub:'Web Dev',         pct:95, credits:3, status:'good' },
]
const MESS_TODAY = {
  breakfast:['Idli · Sambar · Chutney','Bread · Jam','Tea / Coffee'],
  lunch:['Rice · Dal · Rajma','Roti · Sabzi','Curd · Papad'],
  snacks:['Samosa · Chai','Biscuits'],
  dinner:['Chapati · Paneer','Rice · Dal Fry','Kheer (Special)'],
}
const FEED_PREVIEW = [
  { id:1, author:'Arjun M.',   college:'KC', color:'#5b6ef5', content:'Just dropped a cheat sheet for CN — Unit 3 shortest paths 🔥 Check Study Hub!', type:'study',    likes:42, time:'1h' },
  { id:2, author:'Priya V.',   college:'TC', color:'#00c896', content:'Congrats to KC House on winning Inter-College Chess! 🏆', type:'achievement', likes:87, time:'3h' },
  { id:3, author:'Anonymous',  college:'VC', color:'#ff6b35', content:'Canteen queue at Block C is insane. Why open only 2 counters during peak hours?', type:'whistleblower', likes:128, time:'5h' },
]
const TYPE_COLOR = { study:'#5b6ef5', achievement:'#e8b400', whistleblower:'#ef4444', post:'var(--t2)', announcement:'#00c896', event:'#e879c0' }
const TYPE_ICON  = { study:'📚', achievement:'🏆', whistleblower:'🔔', post:'💬', announcement:'📢', event:'🎉' }

export default function StudentDash() {
  const { user } = useAuth()
  const todaySlots = TIMETABLE

  return (
    <div>
      {/* College Hero Banner — Identity centrepiece */}
      <div className="role-hero fade-up" style={{
        background:`linear-gradient(135deg, ${user.collegeColor}20 0%, ${user.collegeColor}06 100%)`,
        border:`1px solid ${user.collegeColor}35`,
        marginBottom:'20px',
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`${user.collegeColor}22`, border:`2px solid ${user.collegeColor}55`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:800, color:user.collegeColor }}>{user.collegeCode}</div>
              <div style={{ fontSize:'12px', color:user.collegeColor, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{user.college}</div>
            </div>
            <div className="hero-name">{user.name} 👋</div>
            <div className="hero-meta">{user.reg} · {user.dept} · Year {user.year} · CGPA {user.cgpa}</div>
          </div>
          {/* Streak + Quick stats */}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <div style={{ textAlign:'center', padding:'14px 18px', borderRadius:'14px', background:`${user.collegeColor}15`, border:`1px solid ${user.collegeColor}30` }}>
              <div style={{ fontSize:'30px', animation:'streakBounce 2s ease infinite' }}>🔥</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:800, color:user.collegeColor }}>{user.streak}</div>
              <div style={{ fontSize:'10px', color:'var(--t3)', fontWeight:600 }}>DAY STREAK</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {[['📚','4 Classes today'],['🏨',`Room ${user.hostelRoom}`],['🍽',user.messPlan],['🚌','R02 · ETA 8m']].map(([ic,tx],i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'var(--t2)' }}>
                  <span style={{ fontSize:'14px' }}>{ic}</span>{tx}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Fee due alert */}
        <div style={{ marginTop:'14px', padding:'10px 14px', borderRadius:'10px', background:'rgba(232,180,0,0.1)', border:'1px solid rgba(232,180,0,0.25)', display:'flex', alignItems:'center', gap:'8px' }}>
          <span>⚠️</span>
          <span style={{ fontSize:'12.5px', color:'var(--accounts)' }}>Semester fee due in <b>3 days</b> · ₹45,000 pending</span>
          <button className="btn btn-sm" style={{ marginLeft:'auto', background:'var(--accounts)', color:'#000', border:'none' }}>Pay Now</button>
        </div>
      </div>

      <div className="g2 fade-up-1" style={{ marginBottom:'20px' }}>
        {/* Today's Timetable */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">📅 Today's Classes</div><div className="card-sub">Monday, {new Date().toLocaleDateString()}</div></div>
          </div>
          {todaySlots.map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:'12px', padding:'10px 12px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--border)', marginBottom:'8px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t3)', width:'44px', flexShrink:0 }}>{s.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>{s.course}</div>
                <div style={{ fontSize:'11px', color:'var(--t3)' }}>{s.room}</div>
              </div>
              <span className={`badge ${s.type==='lab'?'badge-gold':'badge-blue'}`}>{s.type}</span>
            </div>
          ))}
        </div>

        {/* Attendance */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">📊 Attendance</div><div className="card-sub">Current semester</div></div>
          </div>
          {ATTENDANCE.map((a,i)=>(
            <div key={i} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                <span style={{ fontSize:'12.5px', color:'var(--t1)', fontWeight:600 }}>{a.sub}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color: a.status==='danger'?'var(--security)':a.status==='warn'?'var(--accounts)':'var(--faculty)', fontWeight:700 }}>{a.pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${a.pct}%`, background: a.status==='danger'?'var(--security)':a.status==='warn'?'var(--accounts)':'var(--faculty)' }} />
              </div>
              {a.status==='danger' && <div style={{ fontSize:'10px', color:'var(--security)', marginTop:'3px' }}>⚠ Below 65% — at risk of debarment</div>}
              {a.status==='warn'   && <div style={{ fontSize:'10px', color:'var(--accounts)', marginTop:'3px' }}>⚡ Below 75% — needs improvement</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="g2 fade-up-2" style={{ marginBottom:'20px' }}>
        {/* Mess Menu */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">🍽 Today's Mess Menu</div><div className="card-sub">Kalam College Dining Hall</div></div>
          </div>
          {Object.entries(MESS_TODAY).map(([meal, items])=>(
            <div key={meal} style={{ marginBottom:'12px' }}>
              <div style={{ fontSize:'10px', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', marginBottom:'5px' }}>{meal}</div>
              <div style={{ fontSize:'12.5px', color:'var(--t2)', lineHeight:1.6 }}>{items.join(' · ')}</div>
            </div>
          ))}
        </div>

        {/* Feed Preview */}
        <div className="card card-p">
          <div className="card-header">
            <div><div className="card-title">🔥 College Feed</div><div className="card-sub">Latest from campus</div></div>
            <button className="btn btn-ghost btn-sm">See All</button>
          </div>
          {FEED_PREVIEW.map(p=>(
            <div key={p.id} style={{ marginBottom:'12px', paddingBottom:'12px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`${p.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:800, color:p.color, border:`1px solid ${p.color}44`, flexShrink:0 }}>{p.college}</div>
                <div style={{ fontWeight:600, fontSize:'12px', color:'var(--t1)' }}>{p.author}</div>
                <span className="badge" style={{ background:`${TYPE_COLOR[p.type]}18`, color:TYPE_COLOR[p.type], border:`1px solid ${TYPE_COLOR[p.type]}30`, fontSize:'9px' }}>{TYPE_ICON[p.type]} {p.type}</span>
                <span style={{ marginLeft:'auto', fontSize:'10px', color:'var(--t3)' }}>{p.time}</span>
              </div>
              <p style={{ fontSize:'12.5px', color:'var(--t2)', lineHeight:1.55, margin:0 }}>{p.content}</p>
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                <span style={{ fontSize:'11px', color:'var(--t3)' }}>❤ {p.likes}</span>
                <span style={{ fontSize:'11px', color:'var(--t3)' }}>💬 Reply</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
