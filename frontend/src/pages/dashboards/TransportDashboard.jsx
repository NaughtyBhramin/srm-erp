import { useState, useEffect } from 'react'
import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const BUSES = [
  { id:'B01', num:'TN-SRM-01', route:'R01', name:'Tambaram Express', driver:'Kumar R.', capacity:52, occupied:41, speed:48, location:'Vandalur Junction', eta:12, status:'on_time',  delay:0  },
  { id:'B04', num:'TN-SRM-04', route:'R02', name:'Velachery Shuttle',driver:'Suresh P.',capacity:52, occupied:38, speed:0,  location:'Perungudi Signal',  eta:23, status:'delayed',   delay:8  },
  { id:'B07', num:'TN-SRM-07', route:'R03', name:'Chrompet Link',    driver:'Rajan M.', capacity:52, occupied:29, speed:55, location:'Urapakkam',          eta:7,  status:'on_time',  delay:0  },
  { id:'B11', num:'TN-SRM-11', route:'R04', name:'Porur Connect',    driver:'Prakash V.',capacity:52,occupied:47, speed:42, location:'Porur Flyover',      eta:14, status:'on_time',  delay:0  },
  { id:'B15', num:'TN-SRM-15', route:'R05', name:'Saidapet Fast',    driver:'Mani K.',  capacity:52, occupied:22, speed:36, location:'Kotturpuram',         eta:19, status:'on_time',  delay:5  },
]

export default function TransportDashboard() {
  const [buses, setBuses] = useState(BUSES)
  const [selected, setSelected] = useState(null)
  const accent = '#3dd6f5'

  useEffect(() => {
    const t = setInterval(() => {
      setBuses(prev => prev.map(b => ({
        ...b,
        occupied: Math.max(0, Math.min(b.capacity, b.occupied + Math.floor(Math.random()*3-1))),
        speed: b.status==='delayed' ? 0 : Math.max(20, Math.min(70, b.speed + Math.floor(Math.random()*10-5))),
        eta: Math.max(1, b.eta + (Math.random() > 0.7 ? -1 : 0))
      })))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const delayed = buses.filter(b=>b.status==='delayed').length
  const totalPax = buses.reduce((a,b)=>a+b.occupied, 0)

  return (
    <P style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ marginBottom:'24px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>
          🚌 Transport Control
        </div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px' }}>Live GPS tracking · Route management · Booking dashboard</div>
      </div>

      <Grid cols={4} gap={14} style={{ marginBottom:'24px' }}>
        <StatCard label="Buses Active"     value={`${buses.length}/20`}  icon="🚌" accent={accent} />
        <StatCard label="Delayed"          value={delayed}               icon="⚠️" sub="Needs attention" accent='#ff4757' trend={delayed>0?'+Action needed':'+All good'} />
        <StatCard label="Passengers Now"   value={totalPax}              icon="👥" sub="across all routes" accent={accent} />
        <StatCard label="Routes Active"    value="5"                     icon="🗺️" sub="of 8 routes" accent={accent} />
      </Grid>

      <Row gap={20}>
        <Col style={{ flex:1 }}>
          <SectionTitle accent={accent}>Live Fleet — Updates every 3s</SectionTitle>
          <Col gap={10}>
            {buses.map((b,i) => {
              const pct = Math.round(b.occupied/b.capacity*100)
              const sel = selected === b.id
              return (
                <Card key={i} onClick={() => setSelected(sel ? null : b.id)} style={{
                  padding:'16px 18px', cursor:'pointer',
                  background: sel ? `${accent}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${sel ? accent+'40' : 'rgba(255,255,255,0.07)'}`
                }}>
                  <Row gap={14} style={{ alignItems:'center' }}>
                    {/* Bus number & live dot */}
                    <div style={{ flexShrink:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: b.status==='delayed' ? '#ff4757' : '#00d4aa', animation: b.speed>0 ? 'pulse 1.5s infinite' : 'none' }} />
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:accent, fontWeight:600 }}>{b.num}</div>
                      </div>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>{b.route}</div>
                    </div>

                    {/* Route name + location */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'13.5px', fontWeight:600, color:'#fff' }}>{b.name}</div>
                      <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'1px' }}>📍 {b.location} · Driver: {b.driver}</div>
                    </div>

                    {/* Stats */}
                    <div style={{ display:'flex', gap:'16px', flexShrink:0 }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:800, color: b.speed===0 ? '#ff4757' : '#fff' }}>{b.speed}</div>
                        <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', fontWeight:600 }}>KM/H</div>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:800, color:accent }}>{b.eta}m</div>
                        <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', fontWeight:600 }}>ETA</div>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:800, color: pct>85?'#f5c518':'#fff' }}>{b.occupied}</div>
                        <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', fontWeight:600 }}>PAX/{b.capacity}</div>
                      </div>
                    </div>

                    <Badge color={b.status==='delayed'?'#ff4757':'#00d4aa'}>{b.status==='delayed'?`⚠️ +${b.delay}min`:'ON TIME'}</Badge>
                  </Row>

                  {/* Occupancy bar */}
                  <div style={{ marginTop:'10px' }}>
                    <MiniBar value={b.occupied} max={b.capacity} color={pct>85?'#f5c518':accent} />
                    <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', marginTop:'3px' }}>{pct}% capacity</div>
                  </div>
                </Card>
              )
            })}
          </Col>
        </Col>

        {/* Right sidebar: bookings + schedule */}
        <div style={{ width:'280px', flexShrink:0 }}>
          <SectionTitle accent={accent}>Today's Schedule</SectionTitle>
          <Card style={{ padding:'4px', marginBottom:'16px' }}>
            {[
              { trip:'Morning',   time:'05:30–08:30', status:'Completed', pax:186 },
              { trip:'Afternoon', time:'14:00–17:00', status:'Running',   pax:127 },
              { trip:'Evening',   time:'17:30–20:30', status:'Scheduled', pax:0 },
            ].map((t,i) => (
              <div key={i} style={{
                padding:'12px 14px',
                borderBottom: i<2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                  <div style={{ fontSize:'13px', fontWeight:600, color:'#fff' }}>{t.trip} Trip</div>
                  <Badge color={t.status==='Completed'?'#00d4aa':t.status==='Running'?accent:'rgba(255,255,255,0.3)'}>{t.status}</Badge>
                </Row>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)' }}>{t.time}</div>
                {t.pax > 0 && <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>👥 {t.pax} passengers</div>}
              </div>
            ))}
          </Card>

          <SectionTitle accent={accent}>Bookings Today</SectionTitle>
          <Card style={{ padding:'14px 16px' }}>
            {BUSES.map((b,i) => (
              <Row key={i} gap={0} style={{ justifyContent:'space-between', padding:'6px 0', borderBottom: i<BUSES.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)' }}>{b.name.split(' ')[0]}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'13px', color:accent }}>{b.occupied}</div>
              </Row>
            ))}
          </Card>
        </div>
      </Row>
    </P>
  )
}
