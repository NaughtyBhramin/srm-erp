import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview','Academics','Fees','Messages']
const COURSES = [
  { code:'CS3401', name:'OS Theory',       att:88, grade:'A', marks:'42/50', status:'good' },
  { code:'CS3501', name:'Comp. Networks',  att:74, grade:'B+',marks:'36/50', status:'warn' },
  { code:'CS3601', name:'ML Fundamentals', att:91, grade:'A+',marks:'48/50', status:'good' },
  { code:'CS3701', name:'DBMS',            att:62, grade:'B', marks:'31/50', status:'danger' },
  { code:'CS3801', name:'Web Development', att:95, grade:'O', marks:'49/50', status:'good' },
]
const FEES = [
  { type:'Tuition Fee',   amount:'₹36,000', due:'05 Mar 2025', status:'pending' },
  { type:'Hostel Fee',    amount:'₹8,000',  due:'01 Mar 2025', status:'overdue' },
  { type:'Transport Fee', amount:'₹1,000',  due:'05 Mar 2025', status:'paid' },
]
const MSGS = [
  { from:'Dr. Priya Nair', role:'CS Faculty', college:'TC', color:'#00c896', msg:'Rahul has excellent aptitude in ML. Encourage his project submission this Friday.', time:'2h ago', read:false },
  { from:'Warden Kumar',   role:'KC Warden',  college:'KC', color:'#5b6ef5', msg:'All hostellers must renew room allocation by March 10. Please submit acknowledgment.', time:'1d ago', read:true },
  { from:'Transport Dept', role:'Admin',       college:null, color:'#14b8e0', msg:'Route R02 departure has been advanced to 5:30 PM from next week.', time:'2d ago', read:true },
]

export default function ParentDash() {
  const { user } = useAuth()
  const [tab, setTab] = useState('Overview')
  return (
    <div>
      {/* Hero */}
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(155,135,245,0.12) 0%,rgba(155,135,245,0.03) 100%)', border:'1px solid rgba(155,135,245,0.2)', marginBottom:'20px' }}>
        <div className="hero-greeting" style={{ color:'var(--parent)' }}>Parent / Guardian Portal</div>
        <div className="hero-name">Welcome, {user.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'8px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${user.collegeColor}22`, border:`2px solid ${user.collegeColor}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:800, color:user.collegeColor }}>{user.collegeCode}</div>
          <div>
            <div style={{ fontWeight:700, color:'var(--t1)', fontSize:'14px' }}>{user.childName}</div>
            <div style={{ fontSize:'12px', color:'var(--t3)' }}>{user.childReg} · Year {user.childYear} · {user.college} · CGPA {user.childCGPA}</div>
          </div>
          <div style={{ marginLeft:'auto', padding:'8px 16px', borderRadius:'20px', background:`${user.collegeColor}18`, border:`1px solid ${user.collegeColor}35`, fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:800, color:user.collegeColor }}>
            {user.childCGPA}
            <span style={{ fontSize:'11px', fontWeight:400, color:'var(--t3)', display:'block' }}>CGPA</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar fade-up-1" style={{ '--accent':'var(--parent)' }}>
        {TABS.map(t=><div key={t} className={`tab-item ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</div>)}
      </div>

      {tab==='Overview' && (
        <div className="fade-up">
          <div className="g4" style={{ marginBottom:'16px' }}>
            {[['8.72','CGPA','var(--parent)'],['83%','Avg Attendance','var(--faculty)'],['₹9,000','Fees Due','var(--security)'],['14🔥','Streak Days','var(--accounts)']].map(([v,l,c])=>(
              <div key={l} className="stat-card"><div className="stat-value" style={{ color:c, fontSize:'24px' }}>{v}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
          <div className="g2">
            <div className="card card-p">
              <div className="card-title" style={{ marginBottom:'12px' }}>📅 Today's Classes</div>
              {['08:00 — Data Structures','09:00 — DBMS Lab','11:00 — Computer Networks','14:00 — OS Theory'].map((c,i)=>(
                <div key={i} style={{ padding:'9px 12px', borderRadius:'9px', background:'var(--glass)', border:'1px solid var(--border)', marginBottom:'7px', fontSize:'12.5px', color:'var(--t2)' }}>{c}</div>
              ))}
            </div>
            <div className="card card-p">
              <div className="card-title" style={{ marginBottom:'12px' }}>🏨 Hostel & Mess</div>
              {[['Room',`Block B, Room ${user.collegeCode}-204`],['Mess Plan','Full Board (All meals)'],['Hostel Fee','₹8,000 — OVERDUE'],['Warden','Dr. Suresh Nair']].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px' }}>
                  <span style={{ color:'var(--t3)' }}>{l}</span>
                  <span style={{ color:'var(--t1)', fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='Academics' && (
        <div className="card fade-up">
          <div className="card-p" style={{ borderBottom:'1px solid var(--border)' }}>
            <div className="card-title">Academic Progress — Sem 6</div>
          </div>
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th>Course</th><th>Attendance</th><th>Marks</th><th>Grade</th><th>Status</th></tr></thead>
            <tbody>{COURSES.map((c,i)=>(
              <tr key={i}>
                <td><div style={{ fontWeight:600, color:'var(--t1)' }}>{c.name}</div><div className="mono" style={{ fontSize:'10px', color:'var(--t3)' }}>{c.code}</div></td>
                <td><span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:c.att<65?'var(--security)':c.att<75?'var(--accounts)':'var(--faculty)' }}>{c.att}%</span></td>
                <td className="mono">{c.marks}</td>
                <td><span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'15px', color:'var(--t1)' }}>{c.grade}</span></td>
                <td><span className={`badge ${c.status==='danger'?'badge-red':c.status==='warn'?'badge-gold':'badge-green'}`}>{c.status==='danger'?'At Risk':c.status==='warn'?'Monitor':'Good'}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}

      {tab==='Fees' && (
        <div className="fade-up">
          {FEES.map((f,i)=>(
            <div key={i} className="card card-p" style={{ marginBottom:'12px', border:`1px solid ${f.status==='overdue'?'rgba(239,68,68,0.3)':f.status==='paid'?'rgba(0,200,150,0.2)':'var(--border)'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'var(--t1)' }}>{f.type}</div>
                  <div style={{ fontSize:'12px', color:'var(--t3)', marginTop:'3px' }}>Due: {f.due}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'20px', fontWeight:800, color:f.status==='overdue'?'var(--security)':f.status==='paid'?'var(--faculty)':'var(--accounts)' }}>{f.amount}</div>
                  <span className={`badge ${f.status==='paid'?'badge-green':f.status==='overdue'?'badge-red':'badge-gold'}`}>{f.status}</span>
                </div>
              </div>
              {f.status!=='paid' && <button className="btn btn-primary" style={{ marginTop:'12px', width:'100%', justifyContent:'center', background:'var(--parent)' }}>Pay Online</button>}
            </div>
          ))}
        </div>
      )}

      {tab==='Messages' && (
        <div className="fade-up">
          {MSGS.map((m,i)=>(
            <div key={i} className="card card-p" style={{ marginBottom:'12px', border:`1px solid ${!m.read?'rgba(155,135,245,0.3)':'var(--border)'}`, background:!m.read?'rgba(155,135,245,0.04)':'var(--bg2)' }}>
              <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:m.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:800, color:m.color, border:`1px solid ${m.color}44`, flexShrink:0 }}>{m.from[0]}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'13px', color:'var(--t1)' }}>{m.from}</div>
                  <div style={{ fontSize:'11px', color:'var(--t3)' }}>{m.role} {m.college&&`· ${m.college}`} · {m.time}</div>
                </div>
                {!m.read && <div style={{ marginLeft:'auto', width:'8px', height:'8px', borderRadius:'50%', background:'var(--parent)', marginTop:'6px' }}/>}
              </div>
              <p style={{ fontSize:'13px', color:'var(--t2)', lineHeight:1.6, margin:0 }}>{m.msg}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
