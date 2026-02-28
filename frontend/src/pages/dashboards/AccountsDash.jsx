import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const MONTHLY = [
  {m:'Aug',collected:14.2,pending:2.1},{m:'Sep',collected:18.4,pending:1.8},{m:'Oct',collected:16.8,pending:2.4},
  {m:'Nov',collected:12.3,pending:3.2},{m:'Dec',collected:11.1,pending:1.9},{m:'Jan',collected:15.6,pending:2.8},
  {m:'Feb',collected:9.8, pending:4.1},{m:'Mar',collected:2.8, pending:8.6},
]
const FEES = [
  { student:'Rahul Sharma',   reg:'RA2111003010001', dept:'CSE', amount:'₹45,000', due:'05 Mar 25', status:'pending' },
  { student:'Kavya Reddy',    reg:'RA2011003010023', dept:'ECE', amount:'₹45,000', due:'05 Mar 25', status:'overdue' },
  { student:'Arjun Kumar',    reg:'RA2111003010045', dept:'MECH',amount:'₹42,000', due:'01 Mar 25', status:'paid' },
  { student:'Priya Sundaram', reg:'RA2111003010067', dept:'CSE', amount:'₹45,000', due:'05 Mar 25', status:'paid' },
  { student:'Vikram Singh',   reg:'RA2211003010012', dept:'CIVIL',amount:'₹40,000',due:'10 Mar 25', status:'pending' },
]
const SALARY = [
  { name:'Dr. Priya Nair',     emp:'EMP-CSE-001', dept:'CSE',  net:'₹77,800', month:'Feb 2025', status:'paid' },
  { name:'Dr. K. Sundaram',    emp:'EMP-ECE-001', dept:'ECE',  net:'₹92,400', month:'Feb 2025', status:'paid' },
  { name:'Mr. R. Venkat',      emp:'EMP-PHY-003', dept:'PHY',  net:'₹58,200', month:'Feb 2025', status:'pending' },
  { name:'Dr. L. Preethi',     emp:'EMP-MBA-002', dept:'MBA',  net:'₹88,500', month:'Feb 2025', status:'pending' },
]
const STATUS_C = { paid:'badge-green', pending:'badge-gold', overdue:'badge-red' }

export default function AccountsDash() {
  const overdue = FEES.filter(f=>f.status==='overdue').length
  const pending = FEES.filter(f=>f.status==='pending').length
  return (
    <div>
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(232,180,0,0.12) 0%,rgba(232,180,0,0.03) 100%)', border:'1px solid rgba(232,180,0,0.2)', marginBottom:'20px' }}>
        <div className="hero-greeting" style={{ color:'var(--accounts)' }}>Accounts Department</div>
        <div className="hero-name">Finance Dashboard</div>
        <div className="hero-meta">FY 2024–25 · February 2025</div>
      </div>

      <div className="g4 fade-up-1" style={{ marginBottom:'20px' }}>
        {[['₹128.4 Cr','Total Revenue','↑ 8.2% YoY','var(--accounts)'],['₹94.2 Cr','Fees Collected','94% target','var(--faculty)'],['₹12.8 Cr','Outstanding','↓ needs action','var(--security)'],['₹22.1 Cr','Salary Paid','Feb payroll done','var(--t2)']].map(([v,l,d,c])=>(
          <div key={l} className="stat-card">
            <div className="stat-value" style={{ color:c, fontSize:'22px' }}>{v}</div>
            <div className="stat-label">{l}</div>
            <div style={{ fontSize:'10.5px', color:'var(--t3)', marginTop:'4px' }}>{d}</div>
          </div>
        ))}
      </div>

      {overdue > 0 && (
        <div className="fade-up-1" style={{ padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'20px' }}>🚨</span>
          <span style={{ fontSize:'13px', color:'var(--security)' }}><b>{overdue} overdue fee payments</b> require immediate follow-up · Total ₹{overdue*45000/1000}K at risk</span>
          <button className="btn btn-danger btn-sm" style={{ marginLeft:'auto' }}>Send Reminders</button>
        </div>
      )}

      <div className="g2 fade-up-2" style={{ marginBottom:'20px' }}>
        {/* Monthly chart */}
        <div className="card card-p">
          <div className="card-title" style={{ marginBottom:'4px' }}>Monthly Fee Collection (₹ Cr)</div>
          <div className="card-sub" style={{ marginBottom:'14px' }}>Collected vs Outstanding — FY 2024–25</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={MONTHLY}>
              <XAxis dataKey="m" tick={{ fill:'var(--t3)', fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'9px', fontSize:'11px' }}/>
              <Bar dataKey="collected" fill="#e8b400" radius={[4,4,0,0]} name="Collected"/>
              <Bar dataKey="pending"   fill="rgba(239,68,68,0.5)" radius={[4,4,0,0]} name="Pending"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept breakdown */}
        <div className="card card-p">
          <div className="card-title" style={{ marginBottom:'14px' }}>Fee by Department</div>
          {[['CSE',92,'var(--student)',4200],['ECE',87,'var(--transport)',3800],['MECH',79,'var(--accounts)',3200],['CIVIL',74,'var(--faculty)',2800],['MBA',95,'var(--medical)',2100]].map(([dept,pct,c,students])=>(
            <div key={dept} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'12.5px', fontWeight:600, color:'var(--t1)' }}>{dept}</span>
                <div style={{ display:'flex', gap:'12px' }}>
                  <span style={{ fontSize:'11px', color:'var(--t3)' }}>{students.toLocaleString()} students</span>
                  <span style={{ fontSize:'12px', fontWeight:700, color:c }}>{pct}%</span>
                </div>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%`, background:c }}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Table */}
      <div className="card fade-up-3" style={{ marginBottom:'16px' }}>
        <div className="card-p" style={{ borderBottom:'1px solid var(--border)', paddingBottom:'14px' }}>
          <div className="card-header" style={{ marginBottom:0 }}>
            <div><div className="card-title">Fee Payments</div><div className="card-sub">Recent transactions</div></div>
            <button className="btn btn-ghost btn-sm">Export</button>
          </div>
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Student</th><th>Reg No.</th><th>Dept</th><th>Amount</th><th>Due Date</th><th>Status</th><th></th></tr></thead>
          <tbody>{FEES.map((f,i)=>(
            <tr key={i}>
              <td style={{ color:'var(--t1)', fontWeight:600 }}>{f.student}</td>
              <td className="mono">{f.reg}</td>
              <td><span className="badge badge-blue" style={{ fontSize:'9px' }}>{f.dept}</span></td>
              <td className="mono" style={{ color:'var(--accounts)', fontWeight:700 }}>{f.amount}</td>
              <td style={{ fontSize:'12px' }}>{f.due}</td>
              <td><span className={`badge ${STATUS_C[f.status]}`}>{f.status}</span></td>
              <td>{f.status!=='paid'&&<button className="btn btn-ghost btn-sm" style={{ fontSize:'10px' }}>Remind</button>}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>

      {/* Salary Table */}
      <div className="card fade-up-4">
        <div className="card-p" style={{ borderBottom:'1px solid var(--border)', paddingBottom:'14px' }}>
          <div className="card-header" style={{ marginBottom:0 }}>
            <div><div className="card-title">Salary Payroll — Feb 2025</div><div className="card-sub">Faculty & staff</div></div>
            <button className="btn btn-primary btn-sm">Process Remaining</button>
          </div>
        </div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Employee</th><th>ID</th><th>Dept</th><th>Net Salary</th><th>Month</th><th>Status</th></tr></thead>
          <tbody>{SALARY.map((s,i)=>(
            <tr key={i}>
              <td style={{ color:'var(--t1)', fontWeight:600 }}>{s.name}</td>
              <td className="mono">{s.emp}</td>
              <td><span className="badge badge-blue" style={{ fontSize:'9px' }}>{s.dept}</span></td>
              <td className="mono" style={{ color:'var(--faculty)', fontWeight:700 }}>{s.net}</td>
              <td style={{ fontSize:'12px' }}>{s.month}</td>
              <td><span className={`badge ${s.status==='paid'?'badge-green':'badge-gold'}`}>{s.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  )
}
