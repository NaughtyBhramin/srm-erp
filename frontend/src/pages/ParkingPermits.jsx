import { useState } from 'react'
import { FileText, Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
const PERMITS = [
  { id:'1', num:'SRM-PRM-AB12CD34', owner:'Rahul Sharma', vehicle:'TN07CD1234', zone:'Zone B – Student 2W', type:'semester', until:'2024-06-30', status:'active', paid:1500 },
  { id:'2', num:'SRM-PRM-EF56GH78', owner:'Dr. Priya Kumar', vehicle:'TN09AB5678', zone:'Zone C – Staff 4W', type:'annual', until:'2024-12-31', status:'active', paid:0 },
  { id:'3', num:'SRM-PRM-IJ90KL12', owner:'Kavya Reddy', vehicle:'TN01XY7890', zone:'Zone B – Student 2W', type:'monthly', until:'2024-01-31', status:'expired', paid:200 },
  { id:'4', num:'SRM-PRM-MN34OP56', owner:'Arun Patel', vehicle:'TN22EF9012', zone:'Zone B – Student 2W', type:'semester', until:'2024-07-31', status:'pending', paid:0 },
]
const sb = (s) => ({ active:'badge-green', expired:'badge-red', pending:'badge-gold', suspended:'badge-purple' })[s] || 'badge-blue'

export default function ParkingPermits() {
  const [permits] = useState(PERMITS)
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all'?permits:permits.filter(p=>p.status===filter)
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
        <div><h1 style={{ fontWeight:'700',fontSize:'20px',color:'var(--text-1)' }}>Parking Permits</h1></div>
        <button className="btn btn-primary btn-sm"><Plus size={14}/> Issue Permit</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
        {[{l:'Active',v:permits.filter(p=>p.status==='active').length,c:'var(--green)'},{l:'Pending',v:permits.filter(p=>p.status==='pending').length,c:'var(--gold)'},{l:'Expired',v:permits.filter(p=>p.status==='expired').length,c:'var(--red)'},{l:'Revenue',v:'₹'+permits.reduce((s,p)=>s+p.paid,0).toLocaleString(),c:'var(--primary)'}].map(m=>(
          <div key={m.l} className="stat-card" style={{textAlign:'center',padding:'16px'}}><div className="stat-value" style={{fontSize:'28px',color:m.c}}>{m.v}</div><div className="stat-label">{m.l}</div></div>
        ))}
      </div>
      <div style={{ display:'flex', gap:'6px', marginBottom:'14px' }}>
        {['all','active','pending','expired'].map(f=>(
          <button key={f} className="btn btn-sm" onClick={()=>setFilter(f)} style={{ fontSize:'12px',textTransform:'capitalize',background:filter===f?'var(--primary)':'rgba(255,255,255,0.04)',color:filter===f?'white':'var(--text-2)',border:'1px solid var(--border)' }}>{f}</button>
        ))}
      </div>
      <div className="card"><div className="table-wrap"><table className="table">
        <thead><tr><th>Permit No.</th><th>Owner</th><th>Vehicle</th><th>Zone</th><th>Type</th><th>Valid Until</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>{filtered.map(p=>(
          <tr key={p.id}>
            <td className="mono" style={{color:'var(--gold)',fontSize:'12px'}}>{p.num}</td>
            <td style={{color:'var(--text-1)'}}>{p.owner}</td>
            <td className="mono">{p.vehicle}</td>
            <td style={{fontSize:'12px'}}>{p.zone}</td>
            <td><span className="badge badge-blue" style={{fontSize:'10px',textTransform:'capitalize'}}>{p.type}</span></td>
            <td className="mono" style={{fontSize:'12px'}}>{p.until}</td>
            <td style={{color:p.paid>0?'var(--green)':'var(--text-3)',fontWeight:'700'}}>{p.paid>0?`₹${p.paid}`:'Free'}</td>
            <td><span className={`badge ${sb(p.status)}`} style={{fontSize:'10px',textTransform:'capitalize'}}>{p.status}</span></td>
          </tr>
        ))}</tbody>
      </table></div></div>
    </div>
  )
}
