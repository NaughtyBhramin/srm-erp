import { useState } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
const VIOLATIONS = [
  { id:'1', vehicle:'TN07CD1234', type:'Wrong Zone', desc:'Two-wheeler in four-wheeler zone', fine:500, date:'2024-01-15 09:23', status:'pending', reporter:'Security Ram' },
  { id:'2', vehicle:'TN22EF9012', type:'No Permit', desc:'Vehicle parked without valid permit', fine:1000, date:'2024-01-14 14:45', status:'paid', reporter:'Security Suresh' },
  { id:'3', vehicle:'TN55AB3456', type:'Double Parking', desc:'Vehicle blocking another parked vehicle', fine:750, date:'2024-01-13 11:30', status:'pending', reporter:'Security Ram' },
  { id:'4', vehicle:'TN01XY7890', type:'Handicap Misuse', desc:'Non-handicap vehicle in handicap spot', fine:2000, date:'2024-01-12 16:15', status:'paid', reporter:'Security Priya' },
  { id:'5', vehicle:'TN88CD9012', type:'Expired Permit', desc:'Using expired semester permit', fine:500, date:'2024-01-11 08:50', status:'disputed', reporter:'Security Suresh' },
]
const sb = (s) => ({ pending:'badge-gold', paid:'badge-green', disputed:'badge-red', dismissed:'badge-blue' })[s]

export default function ParkingViolations() {
  const [violations, setViolations] = useState(VIOLATIONS)
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all'?violations:violations.filter(v=>v.status===filter)
  const total = violations.reduce((s,v)=>s+v.fine,0)
  const collected = violations.filter(v=>v.status==='paid').reduce((s,v)=>s+v.fine,0)
  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'24px' }}>
        <h1 style={{ fontWeight:'700',fontSize:'20px',color:'var(--text-1)' }}>Parking Violations</h1>
        <button className="btn btn-primary btn-sm"><Plus size={14}/> Report Violation</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'24px' }}>
        {[{l:'Total',v:violations.length,c:'var(--red)'},{l:'Pending',v:violations.filter(v=>v.status==='pending').length,c:'var(--gold)'},{l:'Collected',v:'₹'+collected.toLocaleString(),c:'var(--green)'},{l:'Outstanding',v:'₹'+(total-collected).toLocaleString(),c:'var(--text-2)'}].map(m=>(
          <div key={m.l} className="stat-card" style={{textAlign:'center',padding:'16px'}}><div className="stat-value" style={{fontSize:'28px',color:m.c}}>{m.v}</div><div className="stat-label">{m.l}</div></div>
        ))}
      </div>
      <div style={{ display:'flex',gap:'6px',marginBottom:'14px' }}>
        {['all','pending','paid','disputed'].map(f=>(
          <button key={f} className="btn btn-sm" onClick={()=>setFilter(f)} style={{ fontSize:'12px',textTransform:'capitalize',background:filter===f?'var(--primary)':'rgba(255,255,255,0.04)',color:filter===f?'white':'var(--text-2)',border:'1px solid var(--border)' }}>{f}</button>
        ))}
      </div>
      <div className="card"><div className="table-wrap"><table className="table">
        <thead><tr><th>Vehicle</th><th>Type</th><th>Description</th><th>Fine</th><th>Date</th><th>Reporter</th><th>Status</th><th></th></tr></thead>
        <tbody>{filtered.map(v=>(
          <tr key={v.id}>
            <td className="mono" style={{fontWeight:'700',color:'var(--text-1)'}}>{v.vehicle}</td>
            <td><span className="badge badge-red" style={{fontSize:'10px'}}>{v.type}</span></td>
            <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12.5px'}}>{v.desc}</td>
            <td className="mono" style={{fontWeight:'800',color:'var(--gold)'}}>₹{v.fine}</td>
            <td className="mono" style={{fontSize:'11px'}}>{v.date}</td>
            <td style={{fontSize:'12px'}}>{v.reporter}</td>
            <td><span className={`badge ${sb(v.status)}`} style={{fontSize:'10px',textTransform:'capitalize'}}>{v.status}</span></td>
            <td>{v.status==='pending'&&<button className="btn btn-ghost btn-sm" style={{fontSize:'11px',color:'var(--green)'}} onClick={()=>setViolations(violations.map(vi=>vi.id===v.id?{...vi,status:'paid'}:vi))}>Mark Paid</button>}</td>
          </tr>
        ))}</tbody>
      </table></div></div>
    </div>
  )
}
