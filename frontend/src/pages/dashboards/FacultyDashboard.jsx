import { useAuth } from '../../context/AuthContext'
import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, Avatar, P } from './shared'

const COURSES = [
  { code:'CSE301', name:'Data Structures & Algorithms', students:62, attendance:82, time:'Mon/Wed/Fri 8-9AM', room:'CSE-101' },
  { code:'CSE402', name:'Machine Learning',             students:58, attendance:78, time:'Tue/Thu 11AM-1PM', room:'CSE-201' },
  { code:'CSE305', name:'DBMS Lab',                     students:30, attendance:91, time:'Mon 2-5PM',        room:'Lab-3' },
]

const MY_STUDENTS = [
  { name:'Rahul Sharma',   reg:'RA2111003010001', cgpa:8.72, attendance:82, college:'KC', color:'#6378ff' },
  { name:'Priya Menon',    reg:'RA2111003010012', cgpa:9.14, attendance:94, college:'VC', color:'#ff6b35' },
  { name:'Arun Patel',     reg:'RA2111003010052', cgpa:7.81, attendance:68, college:'TC', color:'#00d4aa' },
  { name:'Kavya Reddy',    reg:'RA2011003020023', cgpa:8.45, attendance:88, college:'BC', color:'#f5c518' },
  { name:'Dev Krishnaswamy',reg:'RA2111003010099',cgpa:6.92, attendance:65, college:'KC', color:'#6378ff' },
]

const TIMETABLE_WEEK = [
  { day:'Mon', slots:['DSA 8AM','DBMS Lab 2PM'] },
  { day:'Tue', slots:['ML 11AM'] },
  { day:'Wed', slots:['DSA 8AM', 'Dept Meet 3PM'] },
  { day:'Thu', slots:['ML 11AM'] },
  { day:'Fri', slots:['DSA 8AM', 'Research 2PM'] },
]

export default function FacultyDashboard() {
  const { user } = useAuth()
  const accent = '#00d4aa'
  const collegeColor = user.college_color || accent

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Header with college */}
      <div style={{
        background:`linear-gradient(135deg, ${collegeColor}20 0%, transparent 70%)`,
        borderBottom:`1px solid ${collegeColor}15`, padding:'24px 24px 20px'
      }}>
        <Row gap={14} style={{ alignItems:'center', marginBottom:'20px' }}>
          <div style={{
            width:'48px', height:'48px', borderRadius:'12px', background:collegeColor,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'16px', color:'#fff', flexShrink:0
          }}>{user.college_code}</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800, color:'#fff' }}>
              Dr. {user.full_name?.split(' ').slice(1).join(' ')} 👋
            </div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'2px' }}>
              {user.designation} · {user.dept} · {user.college_name}
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'10px' }}>
            <div style={{ textAlign:'center', padding:'10px 16px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', border:`1px solid ${accent}20` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800, color:accent }}>3</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)' }}>COURSES</div>
            </div>
            <div style={{ textAlign:'center', padding:'10px 16px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', border:`1px solid ${accent}20` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800, color:'#fff' }}>150</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)' }}>STUDENTS</div>
            </div>
            <div style={{ textAlign:'center', padding:'10px 16px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', border:'1px solid rgba(245,197,24,0.2)' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800, color:'#f5c518' }}>₹95K</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)' }}>SALARY</div>
            </div>
          </div>
        </Row>

        {/* Week timetable strip */}
        <div style={{ display:'flex', gap:'8px' }}>
          {TIMETABLE_WEEK.map((d,i) => (
            <div key={i} style={{
              flex:1, background: i===4 ? `${accent}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i===4 ? accent+'40' : 'rgba(255,255,255,0.07)'}`,
              borderRadius:'10px', padding:'10px 10px 8px'
            }}>
              <div style={{ fontSize:'10px', fontWeight:700, color: i===4 ? accent : 'rgba(255,255,255,0.3)', marginBottom:'6px', letterSpacing:'0.08em' }}>{d.day}</div>
              {d.slots.map((s,j) => (
                <div key={j} style={{ fontSize:'10px', color:'rgba(255,255,255,0.6)', marginBottom:'2px', lineHeight:1.3 }}>{s}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <P>
        <Row gap={20}>
          <Col style={{ flex:1 }}>
            <div>
              <SectionTitle action="Mark attendance →" accent={accent}>My Courses</SectionTitle>
              <Col gap={10}>
                {COURSES.map((c,i) => (
                  <Card key={i} style={{ padding:'16px 18px' }}>
                    <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                      <div>
                        <div style={{ fontSize:'13.5px', fontWeight:600, color:'#fff' }}>{c.name}</div>
                        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>{c.code} · {c.time} · {c.room}</div>
                      </div>
                      <Badge color={accent}>{c.students} students</Badge>
                    </Row>
                    <div style={{ marginTop:'10px' }}>
                      <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'4px' }}>
                        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>Avg attendance</div>
                        <div style={{ fontSize:'11px', fontWeight:700, color: c.attendance >= 80 ? '#00d4aa' : '#f5c518' }}>{c.attendance}%</div>
                      </Row>
                      <MiniBar value={c.attendance} max={100} color={c.attendance >= 80 ? '#00d4aa' : '#f5c518'} />
                    </div>
                  </Card>
                ))}
              </Col>
            </div>

            {/* Salary card */}
            <div>
              <SectionTitle accent={accent}>Salary Breakdown</SectionTitle>
              <Card style={{ padding:'18px' }}>
                <Grid cols={3} gap={12}>
                  {[
                    { label:'Basic', value:'₹65,000', color:'#fff' },
                    { label:'HRA',   value:'₹19,500', color:'#00d4aa' },
                    { label:'DA',    value:'₹11,050', color:'#00d4aa' },
                    { label:'PF (Deduction)', value:'-₹7,800', color:'#ff4757' },
                    { label:'Tax',   value:'-₹8,250', color:'#ff4757' },
                    { label:'Net',   value:'₹79,500', color:'#f5c518' },
                  ].map((s,i) => (
                    <div key={i} style={{ textAlign:'center', padding:'10px', background:'rgba(255,255,255,0.03)', borderRadius:'10px' }}>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', marginBottom:'4px' }}>{s.label}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:800, color:s.color }}>{s.value}</div>
                    </div>
                  ))}
                </Grid>
              </Card>
            </div>
          </Col>

          {/* Student list */}
          <div style={{ width:'300px', flexShrink:0 }}>
            <SectionTitle action="All students →" accent={accent}>Students to Watch</SectionTitle>
            <Col gap={8}>
              {MY_STUDENTS.map((s,i) => (
                <Card key={i} style={{ padding:'12px 14px' }}>
                  <Row gap={10} style={{ alignItems:'center' }}>
                    <div style={{
                      width:'32px', height:'32px', borderRadius:'50%', background:s.color,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'11px', color:'#fff', flexShrink:0
                    }}>{s.college}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'12.5px', fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', marginTop:'1px' }}>{s.reg}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'12px', fontWeight:700, color: s.attendance < 75 ? '#ff4757' : '#00d4aa' }}>{s.attendance}%</div>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)' }}>CGPA {s.cgpa}</div>
                    </div>
                  </Row>
                  {s.attendance < 75 && (
                    <div style={{ marginTop:'6px', fontSize:'10px', color:'#ff4757', fontWeight:600 }}>
                      ⚠️ Below 75% — send attendance notice
                    </div>
                  )}
                </Card>
              ))}
            </Col>
          </div>
        </Row>
      </P>
    </div>
  )
}
