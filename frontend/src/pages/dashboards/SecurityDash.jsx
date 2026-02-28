import { useState } from 'react'

const ZONES = [
  { code:'ZA', name:'Staff 2W',    total:200, avail:45, color:'#5b6ef5' },
  { code:'ZB', name:'Student 2W',  total:500, avail:82, color:'#00c896' },
  { code:'ZC', name:'Staff 4W',    total:100, avail:28, color:'#e879c0' },
  { code:'ZD', name:'Student 4W',  total:150, avail:12, color:'#e8b400' },
  { code:'ZE', name:'Bus Bay',     total:30,  avail:16, color:'#14b8e0' },
  { code:'ZF', name:'Visitor',     total:50,  avail:22, color:'#ff6b35' },
]
const VIOLATIONS = [
  { vnum:'TN07CD1234', type:'No Permit',   zone:'ZB', time:'09:14', fine:'₹500',  status:'pending' },
  { vnum:'TN09AB5678', type:'Wrong Zone',  zone:'ZA', time:'09:02', fine:'₹300',  status:'paid' },
  { vnum:'TN22EF9012', type:'Double Park', zone:'ZD', time:'08:45', fine:'₹800',  status:'pending' },
  { vnum:'TN33GH3456', type:'No Helmet',   zone:'ZB', time:'08:30', fine:'₹200',  status:'disputed' },
]
const GATE_LOG = [
  { num:'TN07CD1234', type:'🛵', dir:'IN',  time:'09:14', verified:true  },
  { num:'TN09AB5678', type:'🚗', dir:'OUT', time:'09:10', verified:true  },
  { num:'TN22EF9012', type:'🛵', dir:'IN',  time:'09:08', verified:false },
  { num:'TN01XY7890', type:'🚗', dir:'IN',  time:'09:02', verified:true  },
  { num:'TN33GH3456', type:'🛵', dir:'OUT', time:'08:58', verified:true  },
  { num:'KA05MN2345', type:'🚗', dir:'IN',  time:'08:45', verified:false },
]
const GRID = Array.from({length:60},(_,i)=>({ id:i+1, status:i%7===0?'reserved':i%5===0?'handicap':Math.random()>0.38?'occupied':'free' }))

export default function SecurityDash() {
  const [selZone, setSelZone] = useState('ZB')
  const zone = ZONES.find(z=>z.code===selZone)
  const occ = zone ? Math.round((zone.total-zone.avail)/zone.total*100) : 0

  return (
    <div>
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.12) 0%,rgba(239,68,68,0.03) 100%)', border:'1px solid rgba(239,68,68,0.2)', marginBottom:'20px' }}>
        <div className="hero-greeting" style={{ color:'var(--security)' }}>Security Operations Centre</div>
        <div className="hero-name">Gate & Parking Overview</div>
        <div className="hero-meta">Shift: Morning · {new Date().toLocaleString()}</div>
      </div>

      <div className="g4 fade-up-1" style={{ marginBottom:'20px' }}>
        {[['1,030','Total Slots','🅿'],['338','Available','✅'],['692','Occupied','🔴'],['5','Violations Today','⚠️']].map(([v,l,ic])=>(
          <div key={l} className="stat-card">
            <div className="stat-icon">{ic}</div>
            <div className="stat-value">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="g2 fade-up-2" style={{ marginBottom:'20px' }}>
        {/* Zone selector + slot grid */}
        <div className="card card-p">
          <div className="card-title" style={{ marginBottom:'12px' }}>🅿 Live Parking Grid</div>
          {/* Zone tabs */}
          <div style={{ display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap' }}>
            {ZONES.map(z=>(
              <button key={z.code} onClick={()=>setSelZone(z.code)} style={{
                padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:700, border:'none', cursor:'pointer',
                background: selZone===z.code ? z.color : 'var(--glass)',
                color: selZone===z.code ? '#fff' : 'var(--t3)',
                boxShadow: selZone===z.code ? `0 0 12px ${z.color}40` : 'none',
              }}>{z.code} · {z.name}</button>
            ))}
          </div>
          {zone && (
            <div style={{ display:'flex', gap:'16px', marginBottom:'14px', alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'12px', color:'var(--t2)' }}>Occupancy</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', fontWeight:700, color:occ>80?'var(--security)':occ>60?'var(--accounts)':'var(--faculty)' }}>{occ}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width:`${occ}%`, background:occ>80?'var(--security)':occ>60?'var(--accounts)':'var(--faculty)' }}/></div>
              </div>
              <div style={{ fontSize:'12px', color:'var(--t2)' }}>{zone.avail} free of {zone.total}</div>
            </div>
          )}
          <div className="slot-grid">
            {GRID.slice(0,48).map(s=>(
              <div key={s.id} className={`slot slot-${s.status}`} title={`Slot ${s.id}`}>{s.id}</div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'12px', marginTop:'12px' }}>
            {[['Free','slot-free'],['Occupied','slot-occ'],['Reserved','slot-reserved'],['Handicap','slot-handicap']].map(([l,cls])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'var(--t3)' }}>
                <div className={`slot ${cls}`} style={{ width:'14px', height:'14px', fontSize:'0', borderRadius:'4px' }}/>
                {l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {/* Violations */}
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'12px' }}>⚠️ Today's Violations</div>
            {VIOLATIONS.map((v,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'9px', background:'var(--glass)', border:'1px solid var(--border)', marginBottom:'7px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t1)', fontWeight:700 }}>{v.vnum}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'11.5px', color:'var(--t2)' }}>{v.type} · {v.zone}</div>
                  <div style={{ fontSize:'10px', color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{v.time}</div>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--security)', fontWeight:700 }}>{v.fine}</div>
                <span className={`badge ${v.status==='paid'?'badge-green':v.status==='disputed'?'badge-purple':'badge-red'}`} style={{ fontSize:'9px' }}>{v.status}</span>
              </div>
            ))}
          </div>

          {/* Gate Log */}
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'12px' }}>🚪 Gate Log (Live)</div>
            {GATE_LOG.map((g,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', borderRadius:'8px', marginBottom:'5px', background: g.dir==='IN'?'rgba(0,200,150,0.06)':'rgba(91,110,245,0.06)', borderLeft:`3px solid ${g.dir==='IN'?'var(--faculty)':'var(--student)'}` }}>
                <span>{g.type}</span>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t1)', fontWeight:700, flex:1 }}>{g.num}</div>
                <span style={{ fontSize:'11px', fontWeight:800, color:g.dir==='IN'?'var(--faculty)':'var(--student)' }}>{g.dir}</span>
                <span style={{ fontSize:'10px', color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{g.time}</span>
                <span style={{ fontSize:'14px' }}>{g.verified?'✅':'❌'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
