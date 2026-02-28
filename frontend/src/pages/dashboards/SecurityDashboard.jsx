import { useState } from 'react'
import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const ZONES = [
  { code:'ZA', name:'Staff 2-Wheeler',  total:200, occ:155, color:'#00d4aa' },
  { code:'ZB', name:'Student 2-Wheeler',total:500, occ:418, color:'#f5c518' },
  { code:'ZC', name:'Staff 4-Wheeler',  total:100, occ:72,  color:'#6378ff' },
  { code:'ZD', name:'Student 4-Wheeler',total:150, occ:144, color:'#ff4757' },
  { code:'ZE', name:'Bus Bay',          total:30,  occ:14,  color:'#00d4aa' },
  { code:'ZF', name:'Visitor',          total:50,  occ:28,  color:'#ff6b35' },
]

const VIOLATIONS = [
  { num:'TN07CD1234', type:'No Permit',       zone:'ZB', time:'9:14 AM', fine:'₹500', status:'pending' },
  { num:'TN09AB5678', type:'Wrong Zone',      zone:'ZC', time:'10:02 AM',fine:'₹300', status:'paid' },
  { num:'TN22EF9012', type:'Double Parking',  zone:'ZB', time:'10:45 AM',fine:'₹750', status:'pending' },
  { num:'TN01XY7890', type:'Blocked Exit',    zone:'ZD', time:'11:30 AM',fine:'₹1000',status:'pending' },
]

const RECENT_LOG = [
  { num:'TN07CD1234', type:'2W', action:'ENTRY', zone:'ZB', time:'11:42', who:'Student' },
  { num:'TN33GH3456', type:'4W', action:'EXIT',  zone:'ZC', time:'11:39', who:'Faculty' },
  { num:'TN55AB9900', type:'4W', action:'ENTRY', zone:'ZF', time:'11:35', who:'Visitor' },
  { num:'TN78CD2200', type:'2W', action:'ENTRY', zone:'ZB', time:'11:31', who:'Student' },
  { num:'TN09AB5678', type:'4W', action:'EXIT',  zone:'ZC', time:'11:28', who:'Faculty' },
]

export default function SecurityDashboard() {
  const [activeZone, setActiveZone] = useState(null)
  const accent = '#ff4757'

  const totalSlots = ZONES.reduce((a,z)=>a+z.total,0)
  const totalOcc   = ZONES.reduce((a,z)=>a+z.occ,0)

  return (
    <P style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:'24px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>
          🚨 Security Control Room
        </div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px' }}>Gate monitoring · Parking enforcement · Vehicle registry</div>
      </div>

      {/* Big stats */}
      <Grid cols={4} gap={14} style={{ marginBottom:'24px' }}>
        <StatCard label="Total Slots"      value={totalSlots} icon="🅿️" accent={accent} />
        <StatCard label="Currently Full"   value={totalOcc}   icon="🚗" sub={`${Math.round(totalOcc/totalSlots*100)}% occupied`} accent={accent} trend={totalOcc/totalSlots > 0.9 ? '+CRITICAL' : '+Normal'} />
        <StatCard label="Active Violations"value="4"          icon="🚨" sub="₹2,550 outstanding" accent={accent} />
        <StatCard label="Gate Entries Today" value="1,243"    icon="🚧" sub="Today 6AM–Now" accent={accent} />
      </Grid>

      <Row gap={20} style={{ marginBottom:'24px' }}>
        {/* Zone grid */}
        <div style={{ flex:1 }}>
          <SectionTitle accent={accent}>Zone Status — Live</SectionTitle>
          <Grid cols={3} gap={10}>
            {ZONES.map((z,i) => {
              const pct = Math.round(z.occ/z.total*100)
              const isSelected = activeZone === z.code
              return (
                <Card key={i} onClick={() => setActiveZone(isSelected ? null : z.code)} style={{
                  padding:'16px',
                  background: isSelected ? `${z.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? z.color+'50' : 'rgba(255,255,255,0.07)'}`,
                  cursor:'pointer'
                }}>
                  <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'10px' }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'18px', color:z.color }}>{z.code}</div>
                    <Badge color={pct > 90 ? '#ff4757' : pct > 70 ? '#f5c518' : '#00d4aa'}>
                      {pct > 90 ? 'FULL' : pct > 70 ? 'BUSY' : 'OK'}
                    </Badge>
                  </Row>
                  <div style={{ fontSize:'11.5px', color:'rgba(255,255,255,0.6)', marginBottom:'10px' }}>{z.name}</div>
                  <MiniBar value={z.occ} max={z.total} color={pct > 90 ? '#ff4757' : pct > 70 ? '#f5c518' : z.color} />
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'5px' }}>
                    {z.occ}/{z.total} · {pct}%
                  </div>
                </Card>
              )
            })}
          </Grid>
        </div>

        {/* Violations */}
        <div style={{ width:'300px', flexShrink:0 }}>
          <SectionTitle action="All violations →" accent={accent}>Active Violations</SectionTitle>
          <Col gap={8}>
            {VIOLATIONS.map((v,i) => (
              <Card key={i} style={{ padding:'12px 14px', borderLeft:`3px solid ${v.status==='paid' ? '#00d4aa' : '#ff4757'}` }}>
                <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:'#fff', fontWeight:600 }}>{v.num}</div>
                  <Badge color={v.status==='paid' ? '#00d4aa' : '#ff4757'}>{v.status}</Badge>
                </Row>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>{v.type} · {v.zone} · {v.time}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:800, color: v.status==='paid' ? '#00d4aa' : '#f5c518', marginTop:'4px' }}>{v.fine}</div>
              </Card>
            ))}
          </Col>
        </div>
      </Row>

      {/* Gate log */}
      <SectionTitle action="Full log →" accent={accent}>Gate Log — Last 5 Entries</SectionTitle>
      <Card>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              {['Vehicle','Type','Action','Zone','Time','Category'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_LOG.map((l,i) => (
              <tr key={i} style={{ borderBottom: i < RECENT_LOG.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:'#fff', fontWeight:600 }}>{l.num}</td>
                <td style={{ padding:'10px 14px' }}><Badge color='#6378ff'>{l.type}</Badge></td>
                <td style={{ padding:'10px 14px' }}><Badge color={l.action==='ENTRY'?'#00d4aa':'#ff4757'}>{l.action}</Badge></td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>{l.zone}</td>
                <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>{l.time}</td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>{l.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </P>
  )
}
