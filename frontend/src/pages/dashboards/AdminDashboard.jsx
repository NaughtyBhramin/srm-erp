import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const COLLEGES = [
  { name:'Vivekananda College', code:'VC', color:'#ff6b35', students:820, capacity:850, warden:'Dr. Meera K.' },
  { name:'Kalam College',       code:'KC', color:'#6378ff', students:741, capacity:780, warden:'Dr. Suresh N.' },
  { name:'Tagore College',      code:'TC', color:'#00d4aa', students:698, capacity:720, warden:'Dr. Priya S.' },
  { name:'Bose College',        code:'BC', color:'#f5c518', students:611, capacity:660, warden:'Dr. Anand K.' },
]

const ALERTS = [
  { type:'⚠️', msg:'12 students have overdue fees > ₹50,000', time:'10m ago', color:'#f5c518' },
  { type:'🔴', msg:'Hostel Block C — water shortage reported', time:'23m ago', color:'#ff4757' },
  { type:'🚌', msg:'Route R02 (Velachery) delayed by 8 min',   time:'31m ago', color:'#3dd6f5' },
  { type:'🏥', msg:'Medical: Paracetamol stock below reorder', time:'1h ago',  color:'#ff6eb4' },
  { type:'🅿️', msg:'Zone D parking 96% full — overflow risk',  time:'2h ago',  color:'#ff6b35' },
]

const MODULES = [
  { label:'Total Students',    value:'14,820', sub:'across 4 colleges', icon:'🎓', trend:'+182 this sem' },
  { label:'Faculty',           value:'892',    sub:'active this semester',icon:'👨‍🏫', trend:'+14 new' },
  { label:'Fee Collection',    value:'₹94.2Cr',sub:'of ₹107Cr target', icon:'💰', trend:'+8.4%' },
  { label:'Hostel Occupancy',  value:'87%',    sub:'3,180 rooms filled', icon:'🏠', trend:'+3%' },
  { label:'Buses Running',     value:'18/20',  sub:'2 under maintenance', icon:'🚌', trend:'90%' },
  { label:'Medical Visits',    value:'47',     sub:'today across campus', icon:'🏥', trend:'+12 vs yesterday' },
  { label:'Parking Today',     value:'1,243',  sub:'entries recorded',   icon:'🅿️', trend:'82% full' },
  { label:'Daily Workers',     value:'380',    sub:'present today',      icon:'👷', trend:'96% attendance' },
]

export default function AdminDashboard() {
  return (
    <P>
      {/* Welcome */}
      <div style={{ marginBottom:'28px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'26px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>
          Good morning, Dr. Rajkumar 👋
        </div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px' }}>
          Friday, 28 February 2026 · All systems operational
        </div>
      </div>

      {/* 8-metric grid */}
      <Grid cols={4} gap={14} style={{ marginBottom:'24px' }}>
        {MODULES.map((m,i) => (
          <StatCard key={i} label={m.label} value={m.value} sub={m.sub} icon={m.icon} trend={m.trend} accent='#ff6b35' />
        ))}
      </Grid>

      <Row gap={20} style={{ marginBottom:'24px' }}>
        {/* Residential Colleges */}
        <div style={{ flex:1 }}>
          <SectionTitle action="View all →" accent='#ff6b35'>Residential Colleges</SectionTitle>
          <Col gap={10}>
            {COLLEGES.map(c => (
              <Card key={c.code} style={{ padding:'16px 18px' }}>
                <Row gap={14} style={{ alignItems:'center' }}>
                  <div style={{
                    width:'44px', height:'44px', borderRadius:'12px', background:c.color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'14px', color:'#fff', flexShrink:0
                  }}>{c.code}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:'13.5px', color:'#fff', marginBottom:'2px' }}>{c.name}</div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>Warden: {c.warden}</div>
                    <div style={{ marginTop:'8px' }}>
                      <MiniBar value={c.students} max={c.capacity} color={c.color} />
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', marginTop:'3px' }}>
                        {c.students}/{c.capacity} students · {Math.round(c.students/c.capacity*100)}%
                      </div>
                    </div>
                  </div>
                </Row>
              </Card>
            ))}
          </Col>
        </div>

        {/* Live Alerts */}
        <div style={{ width:'340px', flexShrink:0 }}>
          <SectionTitle action="All alerts →" accent='#ff6b35'>Live Alerts</SectionTitle>
          <Card style={{ padding:'4px' }}>
            {ALERTS.map((a,i) => (
              <div key={i} style={{
                display:'flex', gap:'12px', alignItems:'flex-start',
                padding:'12px 14px', borderBottom: i < ALERTS.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <div style={{ fontSize:'18px', flexShrink:0, marginTop:'1px' }}>{a.type}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.8)', lineHeight:1.4 }}>{a.msg}</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)', marginTop:'3px' }}>{a.time}</div>
                </div>
                <div style={{ width:'3px', height:'36px', borderRadius:'3px', background:a.color, flexShrink:0, marginTop:'2px' }} />
              </div>
            ))}
          </Card>
        </div>
      </Row>

      {/* Campus map placeholder */}
      <SectionTitle accent='#ff6b35'>Department Fee Status</SectionTitle>
      <Grid cols={3} gap={14}>
        {[
          {dept:'Computer Science & Engineering', collected:94, total:100, color:'#6378ff'},
          {dept:'Electronics & Communication',   collected:87, total:100, color:'#00d4aa'},
          {dept:'Mechanical Engineering',        collected:78, total:100, color:'#f5c518'},
          {dept:'Civil Engineering',             collected:82, total:100, color:'#ff6b35'},
          {dept:'Business Administration',       collected:91, total:100, color:'#a29bfe'},
          {dept:'Physics',                       collected:96, total:100, color:'#ff6eb4'},
        ].map((d,i) => (
          <Card key={i} style={{ padding:'16px 18px' }}>
            <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:'10px' }}>{d.dept}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'8px' }}>
              {d.collected}%
            </div>
            <MiniBar value={d.collected} max={100} color={d.color} height={5} />
          </Card>
        ))}
      </Grid>
    </P>
  )
}
