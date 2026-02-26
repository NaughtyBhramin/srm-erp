import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Car, GraduationCap, Bus, ParkingSquare, TrendingUp, Zap, AlertTriangle } from 'lucide-react'

const trafficData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}h`,
  v: i >= 7 && i <= 10 ? Math.floor(Math.random() * 100 + 80) : i >= 17 && i <= 19 ? Math.floor(Math.random() * 80 + 60) : Math.floor(Math.random() * 30 + 10),
}))

const weekData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({
  d, v: [820, 940, 890, 1020, 1100, 480, 310][i], prev: [750, 860, 810, 980, 990, 440, 290][i]
}))

const TT = ({ contentStyle, ...p }) => (
  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: 'var(--text-1)' }}>
    {p.payload?.map(e => <div key={e.name}><span style={{ color: 'var(--text-3)' }}>{e.name}: </span><strong>{e.value}</strong></div>)}
  </div>
)

function StatCard({ label, value, delta, positive, icon: Icon, accent, sub, delay }) {
  return (
    <div className={`stat-card fade-up fade-up-${delay}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: `${accent}18` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        {delta && (
          <span className={`stat-delta`} style={{ display: 'flex', alignItems: 'center', gap: '3px', color: positive ? 'var(--green)' : 'var(--red)' }}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{delta}
          </span>
        )}
      </div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

const ZONES = [
  { name: 'Zone A — Staff 2W', occ: 77, total: 200 },
  { name: 'Zone B — Student 2W', occ: 84, total: 500 },
  { name: 'Zone C — Staff 4W', occ: 72, total: 100 },
  { name: 'Zone D — Student 4W', occ: 92, total: 150 },
  { name: 'Zone E — Bus Bay', occ: 47, total: 30 },
  { name: 'Zone F — Visitor', occ: 56, total: 50 },
]

const ALERTS = [
  { type: 'warning', msg: 'Zone D nearing capacity (92%)', time: '2m ago' },
  { type: 'info', msg: 'Bus Route 3 delayed by 8 mins', time: '5m ago' },
  { type: 'success', msg: 'Permit SRM-AB12CD approved', time: '12m ago' },
  { type: 'warning', msg: 'Violation: TN22EF9012 — No permit', time: '18m ago' },
]

export default function Dashboard() {
  const { user } = useAuth()

  const greet = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  }

  return (
    <div>
      {/* Welcome */}
      <div className="fade-up" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-1)' }}>
          {greet()}, <span style={{ color: 'var(--primary)' }}>{user?.full_name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px', marginTop: '4px' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;·&nbsp; SRM Institute of Science & Technology
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Students" value="18,452" delta="+2.4%" positive icon={GraduationCap} accent="#6378ff" delay={1} />
        <StatCard label="Vehicles Registered" value="3,241" delta="+5.1%" positive icon={Car} accent="#f5a623" delay={2} />
        <StatCard label="Active Parking" value="847" delta="+3%" positive icon={ParkingSquare} accent="#00e5a0" sub="82% occupancy" delay={3} />
        <StatCard label="Buses Live" value="24" delta="-2" icon={Bus} accent="#22d3ee" sub="6 delayed" delay={4} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: '20px', marginBottom: '20px' }}>
        {/* Hourly traffic chart */}
        <div className="card fade-up fade-up-1" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-1)' }}>Today's Parking Traffic</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Hourly vehicle movements</div>
            </div>
            <span className="live-dot">LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6378ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6378ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fill: 'var(--text-3)', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="v" stroke="#6378ff" strokeWidth={2} fill="url(#g1)" name="Vehicles" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly comparison */}
        <div className="card fade-up fade-up-2" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>Weekly Comparison</div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>This week vs last week</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weekData}>
              <XAxis dataKey="d" tick={{ fill: 'var(--text-3)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="v" stroke="#6378ff" strokeWidth={2.5} dot={false} name="This week" />
              <Line type="monotone" dataKey="prev" stroke="#f5a623" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Last week" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="card fade-up fade-up-3" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--gold)' }} /> Live Alerts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ALERTS.map((a, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                  background: a.type === 'warning' ? 'var(--gold)' : a.type === 'success' ? 'var(--green)' : 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-1)', lineHeight: '1.4' }}>{a.msg}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Occupancy */}
      <div className="card fade-up" style={{ padding: '20px' }}>
        <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Zone Occupancy Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {ZONES.map(z => {
            const c = z.occ > 90 ? 'var(--red)' : z.occ > 75 ? 'var(--gold)' : 'var(--green)'
            return (
              <div key={z.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-2)' }}>{z.name}</span>
                  <span className="mono" style={{ color: c, fontWeight: '700' }}>{z.occ}%</span>
                </div>
                <div className="occ-track">
                  <div className="occ-fill" style={{ width: `${z.occ}%`, background: c }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
