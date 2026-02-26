import { Car, Bike, Bus, MapPin } from 'lucide-react'
const ZONES = [
  { code:'ZA-2W', name:'Zone A — Staff Two Wheeler', total:200, available:45, type:'two_wheeler', rate:0, loc:'Near Admin Block, Gate 1' },
  { code:'ZB-2W', name:'Zone B — Student Two Wheeler', total:500, available:82, type:'two_wheeler', rate:5, loc:'East Campus, Near Library' },
  { code:'ZC-4W', name:'Zone C — Staff Four Wheeler', total:100, available:28, type:'four_wheeler', rate:0, loc:'Near Admin Block' },
  { code:'ZD-4W', name:'Zone D — Student Four Wheeler', total:150, available:12, type:'four_wheeler', rate:20, loc:'West Campus Parking' },
  { code:'ZE-BUS', name:'Zone E — Bus Parking', total:30, available:16, type:'bus', rate:0, loc:'Main Gate Bus Bay' },
  { code:'ZF-VIS', name:'Zone F — Visitor Parking', total:50, available:22, type:'four_wheeler', rate:30, loc:'Main Entrance' },
]
export default function ParkingZones() {
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontWeight:'700', fontSize:'20px', color:'var(--text-1)' }}>Parking Zones</h1>
        <p style={{ fontSize:'13px', color:'var(--text-3)', marginTop:'4px' }}>Campus parking zone configuration and status</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px' }}>
        {ZONES.map(z => {
          const pct = Math.round((z.total-z.available)/z.total*100)
          const c = pct>90?'var(--red)':pct>75?'var(--gold)':'var(--green)'
          const Icon = z.type==='two_wheeler'?Bike:z.type==='bus'?Bus:Car
          return (
            <div key={z.code} className="card" style={{ padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                  <div style={{ padding:'10px', borderRadius:'12px', background:'rgba(99,120,255,0.1)' }}>
                    <Icon size={20} style={{ color:'var(--primary)' }} />
                  </div>
                  <div>
                    <div className="mono" style={{ fontWeight:'800', fontSize:'14px', color:'var(--text-1)' }}>{z.code}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-3)' }}>{z.type.replace('_',' ')}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="stat-value" style={{ fontSize:'32px', color:c }}>{pct}%</div>
                  <div style={{ fontSize:'11px', color:'var(--text-3)' }}>occupied</div>
                </div>
              </div>
              <div style={{ fontWeight:'600', color:'var(--text-1)', marginBottom:'6px' }}>{z.name}</div>
              <div style={{ fontSize:'12px', color:'var(--text-3)', display:'flex', gap:'4px', alignItems:'center', marginBottom:'14px' }}><MapPin size={11}/>{z.loc}</div>
              <div className="occ-track" style={{ marginBottom:'12px' }}><div className="occ-fill" style={{ width:`${pct}%`, background:c }} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', textAlign:'center' }}>
                {[['Total',z.total,'var(--text-2)'],['Free',z.available,'var(--green)'],['Occupied',z.total-z.available,'var(--red)']].map(([l,v,col])=>(
                  <div key={l} style={{ padding:'8px', background:'var(--bg-elevated)', borderRadius:'8px', border:'1px solid var(--border)' }}>
                    <div style={{ fontWeight:'800', color:col }}>{v}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-3)' }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'10px', fontSize:'12px', color:'var(--text-3)', textAlign:'right' }}>{z.rate>0?`₹${z.rate}/hour`:'Free parking'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
