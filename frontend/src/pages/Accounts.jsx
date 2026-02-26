import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DollarSign, Users, Package, TrendingUp, Download, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const TT = () => null

const feeBreakdown = [
  { name: 'Tuition Fees', value: 68, color: '#6378ff' },
  { name: 'Transport', value: 12, color: '#f5a623' },
  { name: 'Hostel', value: 11, color: '#00e5a0' },
  { name: 'Exam Fees', value: 5, color: '#a855f7' },
  { name: 'Misc', value: 4, color: '#22d3ee' },
]

const monthlyRevenue = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'].map((m, i) => ({
  m, collected: [1.2, 4.8, 3.2, 2.1, 3.9, 1.8, 5.2, 2.4][i], outstanding: [0.3, 0.8, 0.5, 0.4, 0.6, 0.3, 0.9, 0.5][i]
}))

const resourceData = [
  { category: 'Lab Equipment', total: 450, used: 312, unit: 'units' },
  { category: 'Library Books', total: 12000, used: 8745, unit: 'copies' },
  { category: 'Vehicles (Campus)', total: 24, used: 18, unit: 'vehicles' },
  { category: 'Classrooms', total: 180, used: 142, unit: 'rooms' },
  { category: 'Lab Computers', total: 600, used: 487, unit: 'systems' },
]

const headcountData = [
  { label: 'UG Students', value: '14,820', delta: '+340', positive: true, color: '#6378ff' },
  { label: 'PG Students', value: '3,632', delta: '+89', positive: true, color: '#a855f7' },
  { label: 'Faculty', value: '892', delta: '+12', positive: true, color: '#00e5a0' },
  { label: 'Staff', value: '1,240', delta: '-5', positive: false, color: '#f5a623' },
  { label: 'Contract Workers', value: '380', delta: '+20', positive: true, color: '#22d3ee' },
  { label: 'Parents (Registered)', value: '9,845', delta: '+156', positive: true, color: '#ff4d6d' },
]

const recentTx = [
  { desc: 'Fee Collection — Batch 2021-25', amount: '+₹42,80,000', type: 'credit', date: 'Feb 24', dept: 'Finance' },
  { desc: 'Lab Equipment Purchase', amount: '-₹8,45,000', type: 'debit', date: 'Feb 22', dept: 'CSE' },
  { desc: 'Scholarship Disbursement', amount: '-₹15,20,000', type: 'debit', date: 'Feb 20', dept: 'Finance' },
  { desc: 'Transport Revenue — Sem 2', amount: '+₹18,35,000', type: 'credit', date: 'Feb 18', dept: 'Transport' },
  { desc: 'Library Resource Upgrade', amount: '-₹3,60,000', type: 'debit', date: 'Feb 15', dept: 'Library' },
]

export default function Accounts() {
  const [activeSection, setActiveSection] = useState('finance')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Accounts & Administration</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Finance · Resources · Headcount</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm"><Download size={14} /> Export Report</button>
          <button className="btn btn-primary btn-sm"><FileText size={14} /> Generate Report</button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', width: 'fit-content' }}>
        {[['finance', '💰 Finance'], ['resources', '📦 Resources'], ['headcount', '👥 Headcount']].map(([s, l]) => (
          <button key={s} onClick={() => setActiveSection(s)}
            style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', background: activeSection === s ? 'var(--primary)' : 'transparent', color: activeSection === s ? 'white' : 'var(--text-2)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {l}
          </button>
        ))}
      </div>

      {activeSection === 'finance' && (
        <div>
          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Revenue (AY)', value: '₹128.4 Cr', delta: '+8.2%', pos: true },
              { label: 'Fees Collected', value: '₹94.2 Cr', delta: '+5.7%', pos: true },
              { label: 'Outstanding Fees', value: '₹12.8 Cr', delta: '-3.1%', pos: false },
              { label: 'Operating Cost', value: '₹82.1 Cr', delta: '+2.3%', pos: false },
            ].map(m => (
              <div key={m.label} className="stat-card">
                <div className="stat-value" style={{ fontSize: '28px', color: 'var(--text-1)' }}>{m.value}</div>
                <div className="stat-label">{m.label}</div>
                <div className="stat-delta" style={{ color: m.pos ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {m.pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{m.delta} vs last year
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Revenue chart */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Monthly Revenue (₹ Crore)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyRevenue} barSize={14} barGap={4}>
                  <XAxis dataKey="m" tick={{ fill: 'var(--text-3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip content={({ payload, label }) => payload?.length ? (
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px' }}>
                      <div style={{ color: 'var(--text-3)', marginBottom: '4px' }}>{label}</div>
                      {payload.map(p => <div key={p.name} style={{ color: p.color }}>₹{p.value}Cr {p.name}</div>)}
                    </div>
                  ) : null} />
                  <Bar dataKey="collected" fill="#6378ff" radius={[4,4,0,0]} name="collected" />
                  <Bar dataKey="outstanding" fill="#ff4d6d" radius={[4,4,0,0]} name="outstanding" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#6378ff', display: 'inline-block' }} />Collected</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ff4d6d', display: 'inline-block' }} />Outstanding</span>
              </div>
            </div>

            {/* Fee breakdown donut */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '12px' }}>Revenue Breakdown</div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={feeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {feeBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-legend" style={{ marginTop: '8px' }}>
                {feeBreakdown.map(e => (
                  <div key={e.name} className="legend-item">
                    <div className="legend-dot" style={{ background: e.color }} />
                    <span style={{ flex: 1 }}>{e.name}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-1)' }}>{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Recent Transactions</div>
            <table className="table">
              <thead><tr><th>Description</th><th>Department</th><th>Date</th><th>Amount</th></tr></thead>
              <tbody>
                {recentTx.map((t, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-1)', fontWeight: '500' }}>{t.desc}</td>
                    <td><span className="badge badge-blue" style={{ fontSize: '11px' }}>{t.dept}</span></td>
                    <td style={{ color: 'var(--text-3)', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>{t.date}</td>
                    <td style={{ fontWeight: '700', fontFamily: 'JetBrains Mono', color: t.type === 'credit' ? 'var(--green)' : 'var(--red)' }}>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'resources' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {resourceData.map(r => {
              const pct = Math.round(r.used / r.total * 100)
              const c = pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--gold)' : 'var(--green)'
              return (
                <div key={r.category} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-1)' }}>{r.category}</div>
                    <span className="mono" style={{ fontSize: '13px', fontWeight: '700', color: c }}>{pct}%</span>
                  </div>
                  <div className="occ-track" style={{ marginBottom: '10px' }}>
                    <div className="occ-fill" style={{ width: `${pct}%`, background: c }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-3)' }}>
                    <span>Used: <strong style={{ color: 'var(--text-1)' }}>{r.used.toLocaleString()}</strong></span>
                    <span>Total: <strong style={{ color: 'var(--text-1)' }}>{r.total.toLocaleString()}</strong> {r.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>Resource Utilization Overview</div>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px' }}>Real-time campus resource tracking</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={resourceData.map(r => ({ name: r.category.split(' ')[0], pct: Math.round(r.used/r.total*100) }))} barSize={40}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: 'var(--text-3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Bar dataKey="pct" fill="#6378ff" radius={[6,6,0,0]} name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeSection === 'headcount' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {headcountData.map(h => (
              <div key={h.label} className="stat-card" style={{ borderColor: `${h.color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '32px', color: h.color }}>{h.value}</div>
                    <div className="stat-label">{h.label}</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px', color: h.positive ? 'var(--green)' : 'var(--red)', marginTop: '4px' }}>
                    {h.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{h.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Total Campus Population: <span style={{ color: 'var(--primary)' }}>30,809</span></div>
            <div style={{ display: 'flex', height: '40px', borderRadius: '10px', overflow: 'hidden', gap: '2px' }}>
              {headcountData.map(h => (
                <div key={h.label} title={`${h.label}: ${h.value}`}
                  style={{ background: h.color, flex: parseInt(h.value.replace(/,/g,'')) }}
                  className="tooltip" data-tip={`${h.label}: ${h.value}`} />
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
              {headcountData.map(h => (
                <div key={h.label} className="legend-item">
                  <div className="legend-dot" style={{ background: h.color }} />
                  <span style={{ color: 'var(--text-2)', fontSize: '12px' }}>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
