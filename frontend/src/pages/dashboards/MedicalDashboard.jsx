import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const VISITS_TODAY = [
  { name:'Rahul Sharma',    reg:'RA21110030100001', type:'consultation', symptoms:'Fever, headache',        time:'9:15 AM',  status:'discharged' },
  { name:'Priya Menon',     reg:'RA2111003010012',  type:'first_aid',    symptoms:'Minor cut — right hand', time:'10:30 AM', status:'discharged' },
  { name:'Arun Patel',      reg:'RA2111003010052',  type:'consultation', symptoms:'Stomach pain',           time:'11:00 AM', status:'referred' },
  { name:'Kavya Reddy',     reg:'RA2011003020023',  type:'checkup',      symptoms:'Annual health checkup',  time:'11:45 AM', status:'completed' },
  { name:'Kumar Rajan',     reg:'EMP-CSE-001',      type:'consultation', symptoms:'Hypertension',           time:'2:00 PM',  status:'in_progress' },
]

const INVENTORY_LOW = [
  { name:'Paracetamol 500mg', stock:48,  reorder:100, unit:'tablets',  expiry:'Mar 2026' },
  { name:'ORS Sachets',       stock:12,  reorder:50,  unit:'sachets',  expiry:'Dec 2026' },
  { name:'Bandage 4"',        stock:8,   reorder:30,  unit:'rolls',    expiry:'Jun 2027' },
  { name:'Crocin Syrup',      stock:5,   reorder:20,  unit:'bottles',  expiry:'Nov 2025' },
]

export default function MedicalDashboard() {
  const accent = '#ff6eb4'

  return (
    <P style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ marginBottom:'24px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>
          🏥 Medical Room Dashboard
        </div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px' }}>Patient visits · Health records · Medicine inventory · Emergency response</div>
      </div>

      <Grid cols={4} gap={14} style={{ marginBottom:'24px' }}>
        <StatCard label="Today's Visits"    value="5"    icon="🏥" sub="2 pending" accent={accent} />
        <StatCard label="Low Stock Items"   value="4"    icon="💊" sub="Need reorder" accent='#ff4757' trend="+Urgent" />
        <StatCard label="Total Records"     value="3,842" icon="📁" sub="Campus-wide" accent={accent} />
        <StatCard label="Referred Out"      value="1"    icon="🚑" sub="Today" accent='#f5c518' />
      </Grid>

      <Row gap={20}>
        {/* Today's visits */}
        <div style={{ flex:1 }}>
          <SectionTitle action="All records →" accent={accent}>Today's Patient Visits</SectionTitle>
          <Col gap={8}>
            {VISITS_TODAY.map((v,i) => (
              <Card key={i} style={{ padding:'14px 16px', borderLeft:`3px solid ${
                v.status==='in_progress' ? accent :
                v.status==='referred'    ? '#ff4757' :
                'rgba(255,255,255,0.1)'
              }` }}>
                <Row gap={14} style={{ alignItems:'center' }}>
                  <div style={{ flex:1 }}>
                    <Row gap={8} style={{ marginBottom:'4px', alignItems:'center' }}>
                      <div style={{ fontSize:'13.5px', fontWeight:600, color:'#fff' }}>{v.name}</div>
                      <Badge color={
                        v.type==='emergency'     ? '#ff4757' :
                        v.type==='first_aid'     ? '#f5c518' :
                        v.type==='checkup'       ? '#00d4aa' : accent
                      }>{v.type.replace('_',' ')}</Badge>
                    </Row>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)' }}>{v.reg} · {v.time}</div>
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'4px' }}>{v.symptoms}</div>
                  </div>
                  <Badge color={
                    v.status==='in_progress' ? accent :
                    v.status==='referred'    ? '#ff4757' :
                    v.status==='discharged'  ? '#00d4aa' : '#6378ff'
                  }>{v.status.replace('_',' ')}</Badge>
                </Row>
              </Card>
            ))}
          </Col>

          {/* Health stats */}
          <div style={{ marginTop:'16px' }}>
            <SectionTitle accent={accent}>Common Conditions (This Month)</SectionTitle>
            <Card style={{ padding:'16px 18px' }}>
              {[
                { condition:'Fever / Viral',   count:48, max:100, color:accent },
                { condition:'Gastro Issues',   count:31, max:100, color:'#f5c518' },
                { condition:'Injury / First Aid',count:22,max:100,color:'#ff4757' },
                { condition:'Annual Checkups', count:67, max:100, color:'#00d4aa' },
                { condition:'Chronic (BP/Diabetes)',count:14,max:100,color:'#a29bfe' },
              ].map((c,i) => (
                <div key={i} style={{ marginBottom: i<4 ? '12px' : 0 }}>
                  <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'5px' }}>
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)' }}>{c.condition}</div>
                    <div style={{ fontSize:'12px', fontWeight:700, color:'#fff' }}>{c.count} cases</div>
                  </Row>
                  <MiniBar value={c.count} max={c.max} color={c.color} />
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* Inventory + appointments */}
        <div style={{ width:'290px', flexShrink:0 }}>
          <SectionTitle action="Full inventory →" accent={accent}>⚠️ Low Stock — Reorder Now</SectionTitle>
          <Col gap={8} style={{ marginBottom:'20px' }}>
            {INVENTORY_LOW.map((m,i) => (
              <Card key={i} style={{ padding:'12px 14px', border:'1px solid rgba(255,71,87,0.25)' }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'#fff', marginBottom:'6px' }}>{m.name}</div>
                <MiniBar value={m.stock} max={m.reorder} color='#ff4757' />
                <Row gap={0} style={{ justifyContent:'space-between', marginTop:'5px' }}>
                  <div style={{ fontSize:'10px', color:'#ff4757', fontWeight:600 }}>{m.stock}/{m.reorder} {m.unit}</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>Exp: {m.expiry}</div>
                </Row>
              </Card>
            ))}
          </Col>

          <SectionTitle accent={accent}>Today's Appointments</SectionTitle>
          <Card style={{ padding:'4px' }}>
            {[
              { name:'Annual checkup batch — B.Tech Y2', time:'3:00 PM',  count:15 },
              { name:'Blood pressure monitoring — Staff', time:'4:30 PM',  count:8 },
              { name:'Eye test camp', time:'5:00 PM', count:20 },
            ].map((a,i) => (
              <div key={i} style={{ padding:'12px 14px', borderBottom: i<2?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ fontSize:'12.5px', fontWeight:600, color:'#fff', marginBottom:'3px' }}>{a.name}</div>
                <Row gap={8} style={{ alignItems:'center' }}>
                  <div style={{ fontSize:'11px', color:accent, fontWeight:600 }}>{a.time}</div>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>· {a.count} patients</div>
                </Row>
              </div>
            ))}
          </Card>
        </div>
      </Row>
    </P>
  )
}
