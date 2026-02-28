import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Grid, Card, Row, Col, SectionTitle, Badge, MiniBar, P } from './shared'

const CHILD = {
  name: 'Rahul Sharma', reg: 'RA2111003010001', dept: 'CSE', year: 3,
  cgpa: 8.72, attendance: 78, college: 'Kalam College', collegeCode: 'KC',
  collegeColor: '#6378ff', room: 'B-204', bloodGroup: 'O+', phone: '9876543210'
}

const ATTENDANCE_SUBJECTS = [
  { sub: 'Data Structures',  pct: 82, color: '#00d4aa' },
  { sub: 'DBMS',             pct: 74, color: '#f5c518' },
  { sub: 'Machine Learning', pct: 88, color: '#6378ff' },
  { sub: 'Networks',         pct: 70, color: '#ff4757' },
]

const FEES = [
  { label: 'Tuition Fee',   amount: '₹1,20,000', status: 'paid',    due: '—' },
  { label: 'Hostel Fee',    amount: '₹45,000',   status: 'paid',    due: '—' },
  { label: 'Transport Fee', amount: '₹8,500',    status: 'pending', due: '15 Mar 2026' },
  { label: 'Exam Fee',      amount: '₹3,200',    status: 'pending', due: '20 Mar 2026' },
]

const ALERTS = [
  { type: '⚠️', msg: 'DBMS attendance at 74% — approaching minimum limit', color: '#f5c518' },
  { type: '💰', msg: 'Transport fee ₹8,500 due on 15 March 2026',          color: '#ff4757' },
  { type: '📋', msg: 'End Semester Exams scheduled: April 10–25',          color: '#6378ff' },
  { type: '🏥', msg: 'Medical checkup visit on Feb 24 — mild fever',       color: '#ff6eb4' },
]

const BUS = { route: 'R02 — Velachery Shuttle', status: 'on_time', eta: '6:45 PM', stop: 'Velachery Bus Stand' }

const MESSAGES = [
  { from: 'Dr. Priya Nair (Faculty)',   msg: 'Rahul performed well in the mid-term. Needs to improve Networks attendance.', time: '2 days ago' },
  { from: 'Kalam College Warden',       msg: 'Room inspection passed. All facilities in order for Block B.',                time: '1 week ago' },
  { from: 'Accounts Department',        msg: 'Semester fee payment confirmed. Receipt ID: SRM2026-48291.',                  time: '2 weeks ago' },
]

export default function ParentDashboard() {
  const { user } = useAuth()
  const collegeColor = CHILD.collegeColor
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      {/* Hero — child identity */}
      <div style={{
        background: `linear-gradient(135deg, ${collegeColor}22 0%, transparent 70%)`,
        borderBottom: `1px solid ${collegeColor}20`, padding: '28px 24px 24px'
      }}>
        <Row gap={16} style={{ alignItems: 'center', marginBottom: '20px' }}>
          {/* College badge */}
          <div style={{
            width: '54px', height: '54px', borderRadius: '14px', background: collegeColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff', flexShrink: 0
          }}>{CHILD.collegeCode}</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, color: '#fff' }}>
              Welcome, {user.full_name?.split(' ')[1]} 👋
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '3px' }}>
              Parent of {CHILD.name} · {CHILD.college} · Year {CHILD.year}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {ALERTS.filter(a => a.color === '#ff4757' || a.color === '#f5c518').length > 0 && (
              <div style={{
                padding: '8px 14px', borderRadius: '10px',
                background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)',
                fontSize: '12px', fontWeight: 700, color: '#ff4757'
              }}>
                ⚠️ {ALERTS.length} alerts need attention
              </div>
            )}
          </div>
        </Row>

        {/* Child quick stats */}
        <Grid cols={4} gap={12}>
          {[
            { label: 'CGPA', value: CHILD.cgpa, icon: '📊', color: collegeColor },
            { label: 'Attendance', value: CHILD.attendance + '%', icon: '📋', color: '#f5c518' },
            { label: 'Fees Due', value: '₹11,700', icon: '💰', color: '#ff4757' },
            { label: 'Hostel Room', value: CHILD.room, icon: '🏠', color: '#00d4aa' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(0,0,0,0.3)', border: `1px solid ${s.color}25`,
              borderRadius: '12px', padding: '14px 16px'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </Grid>
      </div>

      <P>
        {/* Tab switcher */}
        <Row gap={8} style={{ marginBottom: '24px' }}>
          {['overview', 'academics', 'fees', 'messages'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 18px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
              border: activeTab === tab ? `1px solid ${collegeColor}` : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === tab ? `${collegeColor}20` : 'transparent',
              color: activeTab === tab ? collegeColor : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s'
            }}>{tab}</button>
          ))}
        </Row>

        {activeTab === 'overview' && (
          <Row gap={20}>
            <Col style={{ flex: 1 }}>
              {/* Alerts */}
              <div>
                <SectionTitle accent={collegeColor}>Alerts & Notices</SectionTitle>
                <Col gap={8}>
                  {ALERTS.map((a, i) => (
                    <Card key={i} style={{ padding: '14px 16px' }}>
                      <Row gap={12} style={{ alignItems: 'center' }}>
                        <div style={{ fontSize: '20px' }}>{a.type}</div>
                        <div style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{a.msg}</div>
                        <div style={{ width: '3px', height: '30px', borderRadius: '3px', background: a.color, flexShrink: 0 }} />
                      </Row>
                    </Card>
                  ))}
                </Col>
              </div>

              {/* Bus today */}
              <div>
                <SectionTitle accent='#3dd6f5'>Bus Today</SectionTitle>
                <Card style={{ padding: '18px' }}>
                  <Row gap={14} style={{ alignItems: 'center' }}>
                    <div style={{ fontSize: '32px' }}>🚌</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{BUS.route}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Boarding at: {BUS.stop}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: 800, color: '#3dd6f5' }}>{BUS.eta}</div>
                      <Badge color='#00d4aa'>{BUS.status}</Badge>
                    </div>
                  </Row>
                </Card>
              </div>
            </Col>

            <div style={{ width: '300px', flexShrink: 0 }}>
              {/* Recent faculty messages */}
              <SectionTitle action="View all →" accent={collegeColor}>Faculty Messages</SectionTitle>
              <Col gap={8}>
                {MESSAGES.map((m, i) => (
                  <Card key={i} style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: collegeColor, marginBottom: '6px' }}>{m.from}</div>
                    <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{m.msg}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>{m.time}</div>
                  </Card>
                ))}
              </Col>

              {/* Child info card */}
              <div style={{ marginTop: '16px' }}>
                <SectionTitle accent={collegeColor}>Child Profile</SectionTitle>
                <Card style={{ padding: '16px 18px' }}>
                  {[
                    { label: 'Registration', value: CHILD.reg },
                    { label: 'Department', value: CHILD.dept },
                    { label: 'Blood Group', value: CHILD.bloodGroup },
                    { label: 'Phone', value: CHILD.phone },
                    { label: 'College', value: CHILD.college },
                  ].map((f, i) => (
                    <Row key={i} gap={0} style={{
                      justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{f.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{f.value}</div>
                    </Row>
                  ))}
                </Card>
              </div>
            </div>
          </Row>
        )}

        {activeTab === 'academics' && (
          <Row gap={20}>
            <Col style={{ flex: 1 }}>
              <SectionTitle accent={collegeColor}>Subject Attendance</SectionTitle>
              <Col gap={10}>
                {ATTENDANCE_SUBJECTS.map((a, i) => (
                  <Card key={i} style={{ padding: '16px 18px' }}>
                    <Row gap={0} style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{a.sub}</div>
                      <div style={{
                        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '16px',
                        color: a.pct < 75 ? '#ff4757' : '#00d4aa'
                      }}>{a.pct}%</div>
                    </Row>
                    <MiniBar value={a.pct} max={100} color={a.pct < 75 ? '#ff4757' : a.color} />
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                      {a.pct < 75 ? '⚠️ Below 75% minimum — action needed' : '✓ Attendance satisfactory'}
                    </div>
                  </Card>
                ))}
              </Col>
            </Col>
            <div style={{ width: '280px', flexShrink: 0 }}>
              <SectionTitle accent={collegeColor}>Academic Performance</SectionTitle>
              <Card style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Current CGPA</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '56px', fontWeight: 800, color: collegeColor, lineHeight: 1 }}>{CHILD.cgpa}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>out of 10.0</div>
                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,212,170,0.08)', borderRadius: '10px', border: '1px solid rgba(0,212,170,0.15)' }}>
                  <div style={{ fontSize: '12px', color: '#00d4aa', fontWeight: 600 }}>Performance: Good Standing</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>Top 30% of batch</div>
                </div>
              </Card>
            </div>
          </Row>
        )}

        {activeTab === 'fees' && (
          <Row gap={20}>
            <Col style={{ flex: 1 }}>
              <SectionTitle accent='#f5c518'>Fee Breakdown</SectionTitle>
              <Card style={{ padding: '4px' }}>
                {FEES.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: i < FEES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{f.label}</div>
                      {f.status === 'pending' && <div style={{ fontSize: '10px', color: '#ff4757', marginTop: '2px' }}>Due: {f.due}</div>}
                    </div>
                    <Row gap={10} style={{ alignItems: 'center' }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: 800, color: '#fff' }}>{f.amount}</div>
                      <Badge color={f.status === 'paid' ? '#00d4aa' : '#ff4757'}>{f.status}</Badge>
                    </Row>
                  </div>
                ))}
                <div style={{ padding: '16px 18px', background: 'rgba(255,71,87,0.08)', borderRadius: '0 0 15px 15px' }}>
                  <Row gap={0} style={{ justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Total Pending</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, color: '#ff4757' }}>₹11,700</div>
                  </Row>
                  <button style={{
                    width: '100%', marginTop: '12px', padding: '12px',
                    background: '#f5c518', border: 'none', borderRadius: '10px',
                    fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '13px',
                    color: '#000', cursor: 'pointer'
                  }}>Pay Now — ₹11,700</button>
                </div>
              </Card>
            </Col>
            <div style={{ width: '280px', flexShrink: 0 }}>
              <SectionTitle accent='#f5c518'>Payment Summary</SectionTitle>
              <Col gap={12}>
                {[
                  { label: 'Total Fees', value: '₹1,76,700', color: '#fff' },
                  { label: 'Paid', value: '₹1,65,000', color: '#00d4aa' },
                  { label: 'Pending', value: '₹11,700', color: '#ff4757' },
                ].map((s, i) => (
                  <Card key={i} style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '26px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  </Card>
                ))}
              </Col>
            </div>
          </Row>
        )}

        {activeTab === 'messages' && (
          <Col gap={12}>
            <SectionTitle accent={collegeColor}>Messages from Faculty & Admin</SectionTitle>
            {MESSAGES.map((m, i) => (
              <Card key={i} style={{ padding: '18px 20px' }}>
                <Row gap={12} style={{ alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: collegeColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0
                  }}>💬</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: collegeColor, marginBottom: '6px' }}>{m.from}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{m.msg}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>{m.time}</div>
                  </div>
                </Row>
              </Card>
            ))}
          </Col>
        )}
      </P>
    </div>
  )
}
