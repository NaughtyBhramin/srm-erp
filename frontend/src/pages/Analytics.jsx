import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const TT = ({ payload, label }) => payload?.length ? (
  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: 'var(--text-1)' }}>
    {label && <div style={{ color: 'var(--text-3)', marginBottom: '6px', fontWeight: '600' }}>{label}</div>}
    {payload.map(p => <div key={p.name} style={{ color: p.color || 'var(--text-1)' }}>{p.name}: <strong>{p.value}</strong></div>)}
  </div>
) : null

const hourly = Array.from({length: 24}, (_,i) => ({ h: `${i}h`, entries: i>=7&&i<=10?Math.floor(Math.random()*80+60):i>=17&&i<=19?Math.floor(Math.random()*60+50):Math.floor(Math.random()*20+5), exits: i>=9&&i<=12?Math.floor(Math.random()*40+20):i>=17&&i<=20?Math.floor(Math.random()*80+60):Math.floor(Math.random()*15+5) }))
const weekly = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => ({ d, v: [820,940,890,1020,1100,480,310][i], rev: [4100,4700,4450,5100,5500,2400,1550][i] }))
const zones = [{name:'Zone A',v:155,c:'#6378ff'},{name:'Zone B',v:418,c:'#f5a623'},{name:'Zone C',v:72,c:'#00e5a0'},{name:'Zone D',v:138,c:'#a855f7'},{name:'Zone E',v:14,c:'#22d3ee'},{name:'Zone F',v:28,c:'#ff4d6d'}]

export default function Analytics() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Parking Analytics</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Real-time insights and historical trends</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { l: "Today's Entries", v: '847', d: '+12%', c: 'var(--green)' },
          { l: "Today's Revenue", v: '₹4,235', d: '+8%', c: 'var(--gold)' },
          { l: 'Peak Hour', v: '08:00–09:00', d: 'busiest', c: 'var(--primary)' },
          { l: 'Avg Duration', v: '3.2 hrs', d: '-5 min vs avg', c: 'var(--purple)' },
        ].map(s => (
          <div key={s.l} className="stat-card">
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>{s.l}</div>
            <div className="stat-value" style={{ fontSize: '26px', color: s.c }}>{s.v}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Hourly */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>Hourly Traffic Today</div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Vehicle entries and exits by hour</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hourly} barSize={8} barGap={3}>
            <XAxis dataKey="h" tick={{ fill: 'var(--text-3)', fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<TT />} />
            <Bar dataKey="entries" fill="#6378ff" radius={[3,3,0,0]} name="Entries" />
            <Bar dataKey="exits" fill="#f5a623" radius={[3,3,0,0]} name="Exits" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px' }}>
          {[['#6378ff','Entries'],['#f5a623','Exits']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c }} />
              <span style={{ color: 'var(--text-3)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
        {/* Weekly trend */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Weekly Vehicle Count</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekly}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6378ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6378ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fill: 'var(--text-3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="v" stroke="#6378ff" strokeWidth={2.5} fill="url(#ag)" name="Vehicles" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone pie */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Zone Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={zones} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="v">
                {zones.map((e, i) => <Cell key={i} fill={e.c} />)}
              </Pie>
              <Tooltip content={({ payload }) => payload?.[0] ? <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>{payload[0].name}: <strong>{payload[0].value}</strong></div> : null} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {zones.map(z => (
              <div key={z.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: z.c }} />
                <span style={{ color: 'var(--text-2)', flex: 1 }}>{z.name}</span>
                <span style={{ color: 'var(--text-1)', fontWeight: '700' }}>{z.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
