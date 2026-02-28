import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const FEE_DATA = [
  { dept:'CSE',   collected:2840000, total:3020000, students:142, overdue:12 },
  { dept:'ECE',   collected:2210000, total:2560000, students:128, overdue:18 },
  { dept:'MECH',  collected:1890000, total:2100000, students:105, overdue:9  },
  { dept:'CIVIL', collected:1650000, total:1900000, students:95,  overdue:11 },
  { dept:'MBA',   collected:2100000, total:2200000, students:110, overdue:5  },
]

const SALARY_PENDING = [
  { name:'Dr. Priya Nair',     dept:'CSE',  amount:79500, month:'Feb 2026' },
  { name:'Dr. Suresh Kumar',   dept:'ECE',  amount:82000, month:'Feb 2026' },
  { name:'Prof. Meena Raj',    dept:'MECH', amount:71200, month:'Feb 2026' },
  { name:'Dr. Anand Krishnan', dept:'MBA',  amount:91000, month:'Feb 2026' },
]

export default function AccountsDashboard() {
  const accent = '#f5c518'
  const crore = n => `₹${(n/10000000).toFixed(1)}Cr`
  const lakh  = n => `₹${(n/100000).toFixed(1)}L`

  return (
    <P style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ marginBottom:'24px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>
          💰 Accounts & Finance
        </div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px' }}>Fee management · Payroll · Invoicing · Financial reports</div>
      </div>

      <Grid cols={4} gap={14} style={{ marginBottom:'24px' }}>
        <StatCard label="Total Revenue"    value="₹128.4Cr"  icon="💰" sub="This academic year" accent={accent} trend="+8.4% YoY" />
        <StatCard label="Fees Collected"   value="₹94.2Cr"   icon="✅" sub="of ₹107Cr target"  accent='#00d4aa' trend="88% collected" />
        <StatCard label="Outstanding Fees" value="₹12.8Cr"   icon="⚠️" sub="452 students"       accent='#ff4757' trend="+Needs attention" />
        <StatCard label="Salaries Due"     value="₹3.2Cr"    icon="💵" sub="Feb 2026 payroll"   accent={accent} trend="Due in 3 days" />
      </Grid>

      <Row gap={20} style={{ marginBottom:'24px' }}>
        {/* Department fee collection */}
        <div style={{ flex:1 }}>
          <SectionTitle action="Export report →" accent={accent}>Fee Collection by Department</SectionTitle>
          <Col gap={10}>
            {FEE_DATA.map((d,i) => {
              const pct = Math.round(d.collected/d.total*100)
              return (
                <Card key={i} style={{ padding:'16px 18px' }}>
                  <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'8px', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:600, color:'#fff' }}>{d.dept}</div>
                      <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'1px' }}>{d.students} students · {d.overdue} overdue</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:800, color: pct >= 90 ? '#00d4aa' : pct >= 80 ? accent : '#ff4757' }}>{pct}%</div>
                      <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>{lakh(d.collected)} / {lakh(d.total)}</div>
                    </div>
                  </Row>
                  <MiniBar value={d.collected} max={d.total} color={pct >= 90 ? '#00d4aa' : pct >= 80 ? accent : '#ff4757'} />
                </Card>
              )
            })}
          </Col>
        </div>

        {/* Salary + recent */}
        <div style={{ width:'300px', flexShrink:0 }}>
          <SectionTitle action="Process all →" accent={accent}>Pending Salaries — Feb 2026</SectionTitle>
          <Col gap={8} style={{ marginBottom:'20px' }}>
            {SALARY_PENDING.map((s,i) => (
              <Card key={i} style={{ padding:'12px 14px' }}>
                <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                  <div style={{ fontSize:'12.5px', fontWeight:600, color:'#fff' }}>{s.name}</div>
                  <Badge color={accent}>{s.dept}</Badge>
                </Row>
                <Row gap={0} style={{ justifyContent:'space-between', marginTop:'4px', alignItems:'center' }}>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)' }}>{s.month}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:800, color:'#fff' }}>₹{s.amount.toLocaleString()}</div>
                </Row>
              </Card>
            ))}
            <div style={{ textAlign:'center', padding:'12px', background:`${accent}15`, border:`1px solid ${accent}30`, borderRadius:'12px' }}>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', marginBottom:'4px' }}>Total Pending Payroll</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:accent }}>₹3,23,700</div>
            </div>
          </Col>

          <SectionTitle accent={accent}>Revenue Breakdown</SectionTitle>
          <Card style={{ padding:'16px' }}>
            {[
              { label:'Tuition Fees',   pct:68, color:'#6378ff' },
              { label:'Hostel Fees',    pct:12, color:'#00d4aa' },
              { label:'Transport',      pct:8,  color:'#f5c518' },
              { label:'Exam Fees',      pct:7,  color:'#ff6b35' },
              { label:'Miscellaneous',  pct:5,  color:'#ff6eb4' },
            ].map((r,i) => (
              <div key={i} style={{ marginBottom: i<4 ? '10px' : 0 }}>
                <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)' }}>{r.label}</div>
                  <div style={{ fontSize:'12px', fontWeight:700, color:r.color }}>{r.pct}%</div>
                </Row>
                <MiniBar value={r.pct} max={100} color={r.color} height={4} />
              </div>
            ))}
          </Card>
        </div>
      </Row>
    </P>
  )
}
