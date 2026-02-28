import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, Avatar, P } from './shared'

const TIMETABLE = [
  { time:'08:00', subject:'Data Structures', room:'CSE-101', faculty:'Dr. Kumar',       type:'lecture' },
  { time:'09:00', subject:'DBMS Lab',        room:'Lab-3',   faculty:'Dr. Priya',       type:'lab' },
  { time:'11:00', subject:'Machine Learning',room:'CSE-201', faculty:'Dr. Suresh',      type:'lecture' },
  { time:'14:00', subject:'Networks',        room:'CSE-102', faculty:'Dr. Ramesh',      type:'lecture' },
]

const FEED_PREVIEW = [
  { author:'Kalam College', avatar:null, color:'#6378ff', code:'KC',  content:'🏆 KC wins Inter-College Coding Marathon! Congratulations to all 47 participants!', time:'2h', type:'achievement', likes:142 },
  { author:'Rahul Sharma',  avatar:null, color:'#6378ff', code:'KC',  content:'Anyone else struggling with the ML assignment? Meet me at the library at 6PM 📚', time:'4h', type:'post', likes:23 },
  { author:'Dr. Priya Nair',avatar:null, color:'#00d4aa', code:'TC',  content:'📢 DBMS Lab Viva rescheduled to Monday 10AM. Please prepare ER diagrams.', time:'5h', type:'announcement', likes:67 },
]

const ATTENDANCE = [
  { subject:'Data Structures',  pct:82, classes:41, total:50, color:'#00d4aa' },
  { subject:'DBMS',             pct:74, classes:37, total:50, color:'#f5c518' },
  { subject:'Machine Learning', pct:88, classes:44, total:50, color:'#6378ff' },
  { subject:'Networks',         pct:70, classes:35, total:50, color:'#ff4757' },
]

const FEES_SUMMARY = [
  { label:'Tuition Fee',   amount:'₹1,20,000', paid:true },
  { label:'Hostel Fee',    amount:'₹45,000',   paid:true },
  { label:'Transport Fee', amount:'₹8,500',    paid:false },
  { label:'Exam Fee',      amount:'₹3,200',    paid:false },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const accent = '#6378ff'
  const collegeColor = user.college_color || accent

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* College Hero Banner */}
      <div style={{
        background:`linear-gradient(135deg, ${collegeColor}25 0%, ${collegeColor}08 60%, transparent 100%)`,
        borderBottom:`1px solid ${collegeColor}20`,
        padding:'28px 24px 22px'
      }}>
        <Row gap={16} style={{ alignItems:'center', marginBottom:'20px' }}>
          <div style={{
            width:'54px', height:'54px', borderRadius:'14px',
            background:collegeColor, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'18px', color:'#fff'
          }}>{user.college_code}</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff', lineHeight:1.1 }}>
              Welcome back, {user.full_name?.split(' ')[0]} 👋
            </div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'13px', marginTop:'3px' }}>
              {user.college_name} · Year {user.year} · {user.dept} · {user.reg_number}
            </div>
          </div>
          {/* Streak badge */}
          <div style={{ marginLeft:'auto', textAlign:'center' }}>
            <div style={{ fontSize:'28px' }}>🔥</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:collegeColor, lineHeight:1 }}>{user.streak}</div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>DAY STREAK</div>
          </div>
        </Row>

        {/* Quick stats */}
        <Grid cols={4} gap={12}>
          {[
            { label:'CGPA', value: user.cgpa, icon:'📊', color:accent },
            { label:'Attendance', value:'78%', icon:'📋', color:'#f5c518' },
            { label:'Pending Fees', value:'₹11,700', icon:'💰', color:'#ff4757' },
            { label:'Room', value:'B-204', icon:'🏠', color:'#00d4aa' },
          ].map((s,i) => (
            <div key={i} style={{
              background:'rgba(0,0,0,0.3)', border:`1px solid ${s.color}25`,
              borderRadius:'12px', padding:'14px 16px'
            }}>
              <div style={{ fontSize:'18px', marginBottom:'6px' }}>{s.icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800, color:'#fff' }}>{s.value}</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:600, letterSpacing:'0.06em', marginTop:'2px' }}>{s.label}</div>
            </div>
          ))}
        </Grid>
      </div>

      <P>
        <Row gap={20}>
          {/* LEFT: Today + Attendance */}
          <Col style={{ flex:1 }}>
            {/* Today's timetable */}
            <div>
              <SectionTitle action="Full timetable →" accent={accent}>Today's Classes</SectionTitle>
              <Col gap={8}>
                {TIMETABLE.map((t,i) => (
                  <Card key={i} style={{ padding:'12px 16px' }}>
                    <Row gap={14} style={{ alignItems:'center' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:accent, fontWeight:600, flexShrink:0, width:'45px' }}>{t.time}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'13.5px', fontWeight:600, color:'#fff' }}>{t.subject}</div>
                        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'1px' }}>{t.faculty} · {t.room}</div>
                      </div>
                      <Badge color={t.type==='lab' ? '#f5c518' : accent}>{t.type}</Badge>
                    </Row>
                  </Card>
                ))}
              </Col>
            </div>

            {/* Attendance */}
            <div style={{ marginTop:'4px' }}>
              <SectionTitle action="Details →" accent={accent}>Attendance Status</SectionTitle>
              <Col gap={8}>
                {ATTENDANCE.map((a,i) => (
                  <Card key={i} style={{ padding:'14px 16px' }}>
                    <Row gap={0} style={{ justifyContent:'space-between', marginBottom:'8px' }}>
                      <div style={{ fontSize:'13px', fontWeight:500, color:'rgba(255,255,255,0.8)' }}>{a.subject}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'14px', color: a.pct < 75 ? '#ff4757' : '#00d4aa' }}>{a.pct}%</div>
                    </Row>
                    <MiniBar value={a.pct} max={100} color={a.pct < 75 ? '#ff4757' : a.color} />
                    <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)', marginTop:'4px' }}>{a.classes}/{a.total} classes · {a.pct < 75 ? '⚠️ Below minimum' : '✓ Good'}</div>
                  </Card>
                ))}
              </Col>
            </div>
          </Col>

          {/* RIGHT: Feed + Fees */}
          <div style={{ width:'320px', flexShrink:0 }}>
            {/* College Feed preview */}
            <div>
              <SectionTitle action="Open Feed →" accent={collegeColor}>College Feed</SectionTitle>
              <Col gap={8}>
                {FEED_PREVIEW.map((p,i) => (
                  <Card key={i} style={{ padding:'14px 16px' }}>
                    <Row gap={10} style={{ marginBottom:'8px' }}>
                      <div style={{
                        width:'32px', height:'32px', borderRadius:'50%', background:p.color,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'11px', color:'#fff', flexShrink:0
                      }}>{p.code}</div>
                      <div>
                        <div style={{ fontSize:'12.5px', fontWeight:600, color:'#fff' }}>{p.author}</div>
                        <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>{p.time} ago</div>
                      </div>
                      <Badge color={p.type==='achievement'?'#f5c518':p.type==='announcement'?'#ff6eb4':p.color} style={{marginLeft:'auto'}}>{p.type}</Badge>
                    </Row>
                    <div style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{p.content}</div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'8px' }}>❤️ {p.likes}</div>
                  </Card>
                ))}
              </Col>
            </div>

            {/* Fee summary */}
            <div style={{ marginTop:'16px' }}>
              <SectionTitle action="Pay now →" accent='#f5c518'>Fee Summary</SectionTitle>
              <Card style={{ padding:'4px' }}>
                {FEES_SUMMARY.map((f,i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'11px 14px',
                    borderBottom: i < FEES_SUMMARY.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    <div style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.7)' }}>{f.label}</div>
                    <Row gap={8} style={{ alignItems:'center' }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'#fff' }}>{f.amount}</div>
                      <Badge color={f.paid ? '#00d4aa' : '#ff4757'}>{f.paid ? 'Paid' : 'Due'}</Badge>
                    </Row>
                  </div>
                ))}
                <div style={{ padding:'14px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,71,87,0.07)', borderRadius:'0 0 15px 15px' }}>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>Total Pending</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800, color:'#ff4757' }}>₹11,700</div>
                </div>
              </Card>
            </div>

            {/* Today's Mess */}
            <div style={{ marginTop:'16px' }}>
              <SectionTitle accent='#f5c518'>Today's Mess Menu</SectionTitle>
              <Card style={{ padding:'14px 16px' }}>
                {[
                  { meal:'Breakfast', items:'Idli, Sambar, Coconut Chutney', time:'7:30–9:00' },
                  { meal:'Lunch',     items:'Rice, Dal, Rajma, Papad, Curd', time:'12:00–2:00' },
                  { meal:'Dinner',    items:'Roti, Paneer Butter Masala, Salad', time:'7:30–9:30' },
                ].map((m,i) => (
                  <div key={i} style={{ padding:'8px 0', borderBottom: i<2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <Row gap={0} style={{ justifyContent:'space-between' }}>
                      <div style={{ fontSize:'11px', fontWeight:700, color:'#f5c518', textTransform:'uppercase', letterSpacing:'0.06em' }}>{m.meal}</div>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>{m.time}</div>
                    </Row>
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'3px' }}>{m.items}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </Row>
      </P>
    </div>
  )
}
