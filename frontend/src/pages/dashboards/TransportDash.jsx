import { useState, useEffect } from 'react'

const INIT_BUSES = [
  { id:'b1', num:'TN-SRM-01', route:'R01', rname:'Tambaram Express', driver:'Kumar R.',   dphone:'9841XXXXXX', cap:52, occ:41, speed:48, loc:'Vandalur Junction',  eta:12, status:'on_time', lat:12.9249, lng:80.1000, stops:['SRM Gate','Potheri','Vandalur','Tambaram','Pallavaram'], delay:0, active_stop:2 },
  { id:'b2', num:'TN-SRM-04', route:'R02', rname:'Velachery Shuttle', driver:'Suresh P.', dphone:'9842XXXXXX', cap:52, occ:38, speed:0,  loc:'Perungudi Signal',   eta:23, status:'delayed', lat:12.9516, lng:80.2209, stops:['SRM Gate','Medavakkam','Perungudi','Velachery','OMR'],   delay:8, active_stop:2 },
  { id:'b3', num:'TN-SRM-07', route:'R03', rname:'Chrompet Link',     driver:'Rajan M.',  dphone:'9843XXXXXX', cap:52, occ:29, speed:55, loc:'Urapakkam',          eta:7,  status:'on_time', lat:12.9050, lng:80.0720, stops:['SRM Gate','Guduvanchery','Urapakkam','Chrompet'],       delay:0, active_stop:1 },
  { id:'b4', num:'TN-SRM-11', route:'R04', rname:'Porur Connect',     driver:'Prakash V.',dphone:'9844XXXXXX', cap:52, occ:47, speed:42, loc:'Porur Flyover',      eta:14, status:'on_time', lat:13.0350, lng:80.1560, stops:['SRM Gate','Potheri','Vandalur','Porur','Koyambedu'],    delay:0, active_stop:3 },
  { id:'b5', num:'TN-SRM-15', route:'R05', rname:'Saidapet Fast',     driver:'Mani K.',   dphone:'9845XXXXXX', cap:52, occ:22, speed:36, loc:'Kotturpuram',        eta:19, status:'on_time', lat:13.0100, lng:80.2350, stops:['SRM Gate','Perungudi','Kotturpuram','Saidapet'],         delay:5, active_stop:2 },
]

export default function TransportDash() {
  const [buses, setBuses] = useState(INIT_BUSES)
  const [sel, setSel] = useState('b1')
  const selBus = buses.find(b=>b.id===sel)

  useEffect(() => {
    const t = setInterval(()=>{
      setBuses(prev => prev.map(b => ({
        ...b,
        speed: b.speed > 0 ? Math.max(0, b.speed + Math.floor(Math.random()*10-5)) : b.speed,
        occ:   Math.min(b.cap, Math.max(0, b.occ + Math.floor(Math.random()*3-1))),
        eta:   Math.max(1, b.eta + (Math.random()>0.6?-1:0)),
      })))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(20,184,224,0.12) 0%,rgba(20,184,224,0.03) 100%)', border:'1px solid rgba(20,184,224,0.2)', marginBottom:'20px' }}>
        <div className="hero-greeting" style={{ color:'var(--transport)' }}>Transport Control Centre</div>
        <div className="hero-name">Live Fleet Overview</div>
        <div className="hero-meta">{buses.length} buses · {buses.filter(b=>b.status==='on_time').length} on time · {buses.filter(b=>b.status==='delayed').length} delayed</div>
      </div>

      <div className="g4 fade-up-1" style={{ marginBottom:'20px' }}>
        {[['5','Active Buses','🚌'],['218','Passengers','👥'],[`${buses.filter(b=>b.status==='delayed').length}','Delayed','⚠️`],['5','Routes','🗺']].map(([v,l,ic])=>(
          <div key={l} className="stat-card"><div className="stat-icon">{ic}</div><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      <div className="g2 fade-up-2">
        {/* Bus Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {buses.map(b=>{
            const isSel  = sel===b.id
            const occPct = Math.round(b.occ/b.cap*100)
            return (
              <div key={b.id} className="bus-card" onClick={()=>setSel(b.id)} style={{
                border:`1px solid ${isSel?'rgba(20,184,224,0.5)':b.status==='delayed'?'rgba(239,68,68,0.25)':'var(--border)'}`,
                background: isSel?'rgba(20,184,224,0.06)':'var(--bg2)', cursor:'pointer'
              }}>
                <div className="bus-status-bar" style={{ background:b.status==='delayed'?'var(--security)':'var(--faculty)' }} />
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', marginBottom:'10px' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div className="bus-number">{b.num}</div>
                      <span className={`badge ${b.status==='delayed'?'badge-red':'badge-green'}`} style={{ fontSize:'9px' }}>
                        {b.status==='delayed'?`DELAYED +${b.delay}m`:'ON TIME'}
                      </span>
                    </div>
                    <div className="bus-route" style={{ marginTop:'2px' }}>{b.route} · {b.rname}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'2px' }}>
                      <div className="bus-speed">{b.speed}</div>
                      <div style={{ fontSize:'10px', color:'var(--t3)' }}>km/h</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'12px', fontSize:'12px', color:'var(--t2)', flexWrap:'wrap' }}>
                  <span><span className="gps-pulse"/>📍 {b.loc}</span>
                  <span>⏱ ETA {b.eta}min</span>
                  <span>👥 {b.occ}/{b.cap}</span>
                  <span>👤 {b.driver}</span>
                </div>
                <div style={{ marginTop:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px', fontSize:'10px', color:'var(--t3)' }}>
                    <span>Occupancy</span><span>{occPct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${occPct}%`, background:occPct>85?'var(--security)':occPct>60?'var(--accounts)':'var(--transport)' }}/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Route Detail */}
        {selBus && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div className="card card-p">
              <div className="card-title" style={{ marginBottom:'4px' }}>Route Detail — {selBus.rname}</div>
              <div className="card-sub" style={{ marginBottom:'16px' }}>{selBus.route} · Driver: {selBus.driver} · 📞 {selBus.dphone}</div>
              {selBus.stops.map((stop,i)=>(
                <div key={i} style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'6px' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:'12px', height:'12px', borderRadius:'50%', border:`2px solid ${i===selBus.active_stop?'var(--transport)':'var(--border3)'}`, background:i<selBus.active_stop?'var(--transport)':i===selBus.active_stop?'var(--transport)22':'transparent', flexShrink:0 }}/>
                    {i<selBus.stops.length-1&&<div style={{ width:'2px', height:'20px', background:i<selBus.active_stop?'var(--transport)':'var(--border)', marginTop:'2px', borderRadius:'1px' }}/>}
                  </div>
                  <div style={{ fontSize:'13px', color: i===selBus.active_stop?'var(--transport)':i<selBus.active_stop?'var(--t3)':'var(--t2)', fontWeight: i===selBus.active_stop?700:400, paddingBottom:'14px' }}>
                    {stop}
                    {i===selBus.active_stop && <span style={{ display:'block', fontSize:'10px', color:'var(--transport)', fontWeight:400 }}>← Bus is here · ETA {selBus.eta}min to next</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Scheduling */}
            <div className="card card-p">
              <div className="card-title" style={{ marginBottom:'12px' }}>📅 Today's Schedule</div>
              {[['Morning Departure','05:30 AM','Completed'],['Arrival at SRM','09:15 AM','Completed'],['Afternoon Return','05:00 PM','Scheduled'],['Estimated Arrival','08:45 PM','Estimated']].map(([l,t,s])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'12.5px', color:'var(--t2)' }}>{l}</span>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--t1)', fontWeight:700 }}>{t}</div>
                    <div style={{ fontSize:'10px', color:s==='Completed'?'var(--faculty)':s==='Scheduled'?'var(--transport)':'var(--t3)' }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
