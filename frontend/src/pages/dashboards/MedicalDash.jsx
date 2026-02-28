const VISITS = [
  { patient:'Rahul Sharma',  roll:'RA2111003010001', type:'consultation', symptoms:'Fever, headache', diagnosis:'Viral fever', prescription:'Paracetamol 500mg × 3 days', time:'09:15', follow:'Mar 5' },
  { patient:'Priya Reddy',   roll:'RA2011003010023', type:'first_aid',    symptoms:'Minor cut on finger', diagnosis:'Laceration', prescription:'Dressing + Antiseptic', time:'09:42', follow:null },
  { patient:'Dr. K. Rajan',  roll:'EMP-ECE-003',     type:'checkup',     symptoms:'Annual checkup', diagnosis:'BP normal, healthy', prescription:'Vitamin D supplements', time:'10:05', follow:'Jun 1' },
  { patient:'Arun Kumar',    roll:'RA2211003010015', type:'emergency',    symptoms:'Severe abdominal pain', diagnosis:'Suspected appendicitis — referred', prescription:'Referred: Saveetha Hospital', time:'10:30', follow:null },
]
const INVENTORY = [
  { name:'Paracetamol 500mg', cat:'Analgesic',    stock:8,  unit:'strips', reorder:10, expiry:'Dec 2026' },
  { name:'ORS Packets',       cat:'Electrolyte',  stock:34, unit:'pkts',   reorder:20, expiry:'Aug 2026' },
  { name:'Betadine',          cat:'Antiseptic',   stock:12, unit:'bottles',reorder:8,  expiry:'Mar 2026' },
  { name:'Ibuprofen 400mg',   cat:'Analgesic',    stock:45, unit:'strips', reorder:15, expiry:'Nov 2026' },
  { name:'Amoxicillin 500mg', cat:'Antibiotic',   stock:6,  unit:'strips', reorder:10, expiry:'Sep 2026' },
  { name:'Cetrizine 10mg',    cat:'Antihistamine',stock:28, unit:'strips', reorder:10, expiry:'Jul 2027' },
]
const TS = { consultation:{icon:'🩺',color:'#5b6ef5',label:'Consultation'}, first_aid:{icon:'🩹',color:'#00c896',label:'First Aid'}, checkup:{icon:'✅',color:'#e8b400',label:'Checkup'}, emergency:{icon:'🚨',color:'#ef4444',label:'Emergency'} }

export default function MedicalDash() {
  const lowStock = INVENTORY.filter(i=>i.stock<=i.reorder)
  return (
    <div>
      <div className="role-hero fade-up" style={{ background:'linear-gradient(135deg,rgba(232,121,192,0.12) 0%,rgba(232,121,192,0.03) 100%)', border:'1px solid rgba(232,121,192,0.2)', marginBottom:'20px' }}>
        <div className="hero-greeting" style={{ color:'var(--medical)' }}>SRM Medical Centre</div>
        <div className="hero-name">Today's Overview</div>
        <div className="hero-meta">{new Date().toDateString()} · Dr. Anitha Krishnan on duty</div>
      </div>
      {lowStock.length>0 && (
        <div className="fade-up-1" style={{ padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'center' }}>
          <span style={{ fontSize:'20px' }}>💊</span>
          <span style={{ fontSize:'13px', color:'var(--security)' }}><b>Low Stock:</b> {lowStock.map(i=>i.name).join(' · ')}</span>
          <button className="btn btn-danger btn-sm" style={{ marginLeft:'auto' }}>Request Stock</button>
        </div>
      )}
      <div className="g4 fade-up-1" style={{ marginBottom:'20px' }}>
        {[['23','Visits Today','🩺'],['1','Emergency','🚨'],['3','Low Stock','💊'],['4','Follow-ups','📅']].map(([v,l,ic])=>(
          <div key={l} className="stat-card"><div className="stat-icon">{ic}</div><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="g2 fade-up-2">
        <div>
          <div className="card-title" style={{ marginBottom:'12px' }}>Today's Visits</div>
          {VISITS.map((v,i)=>{ const ts=TS[v.type]; return (
            <div key={i} className="visit-card" style={{ border:`1px solid ${ts.color}22`, marginBottom:'10px' }}>
              <div style={{ fontSize:'24px' }}>{ts.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>{v.patient}</span>
                  <span className="badge" style={{ background:`${ts.color}18`, color:ts.color, border:`1px solid ${ts.color}30`, fontSize:'9px' }}>{ts.label}</span>
                  <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--t3)' }}>{v.time}</span>
                </div>
                <div style={{ fontSize:'11px', color:'var(--t3)', marginBottom:'3px' }}>{v.roll}</div>
                <div style={{ fontSize:'12px', color:'var(--t2)', marginBottom:'3px' }}><b>Symptoms:</b> {v.symptoms}</div>
                <div style={{ fontSize:'12px', color:'var(--t2)', marginBottom:'3px' }}><b>Diagnosis:</b> {v.diagnosis}</div>
                <div style={{ fontSize:'12px', color:ts.color }}><b>Rx:</b> {v.prescription}</div>
                {v.follow && <div style={{ marginTop:'6px', fontSize:'11px', color:'var(--accounts)' }}>📅 Follow-up: {v.follow}</div>}
              </div>
            </div>
          )})}
        </div>
        <div className="card card-p">
          <div className="card-title" style={{ marginBottom:'14px' }}>💊 Medicine Inventory</div>
          {INVENTORY.map((item,i)=>{ const isLow=item.stock<=item.reorder; return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'9px', border:`1px solid ${isLow?'rgba(239,68,68,0.25)':'var(--border)'}`, background:isLow?'rgba(239,68,68,0.05)':'var(--glass)', marginBottom:'8px' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12.5px', fontWeight:700, color:'var(--t1)' }}>{item.name}</div>
                <div style={{ fontSize:'10px', color:'var(--t3)' }}>{item.cat} · Exp: {item.expiry}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'14px', fontWeight:800, color:isLow?'var(--security)':'var(--faculty)' }}>{item.stock}</div>
                <div style={{ fontSize:'9px', color:'var(--t3)' }}>{item.unit}</div>
              </div>
              {isLow && <span className="badge badge-red" style={{ fontSize:'9px' }}>LOW</span>}
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}
