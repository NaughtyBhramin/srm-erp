import { useState } from 'react'
import { Plus, Search, CheckCircle, Trash2 } from 'lucide-react'

const INIT = [
  { id:'1', num:'TN07CD1234', type:'two_wheeler', make:'Honda', model:'Activa 6G', color:'White', year:2022, verified:true, owner:'Rahul Sharma', roll:'RA2111003010001' },
  { id:'2', num:'TN09AB5678', type:'four_wheeler', make:'Maruti', model:'Swift', color:'Red', year:2021, verified:true, owner:'Dr. Priya Kumar', roll:'EMP-CSE-001' },
  { id:'3', num:'TN22EF9012', type:'two_wheeler', make:'TVS', model:'Jupiter', color:'Blue', year:2023, verified:false, owner:'Arun Patel', roll:'RA2111003010052' },
  { id:'4', num:'TN33GH3456', type:'four_wheeler', make:'Hyundai', model:'Creta', color:'Black', year:2020, verified:true, owner:'Dr. Suresh Nair', roll:'EMP-ECE-023' },
  { id:'5', num:'TN01XY7890', type:'two_wheeler', make:'Yamaha', model:'FZ-S', color:'Grey', year:2022, verified:true, owner:'Kavya Reddy', roll:'RA2011003020023' },
]

function typeBadge(type) {
  if (type === 'two_wheeler') return <span className="badge badge-blue" style={{ fontSize:'10px' }}>Two Wheeler</span>
  if (type === 'bus') return <span className="badge badge-gold" style={{ fontSize:'10px' }}>Bus</span>
  return <span className="badge badge-green" style={{ fontSize:'10px' }}>Four Wheeler</span>
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(INIT)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ num:'', type:'two_wheeler', make:'', model:'', color:'', year:'' })

  const filtered = vehicles.filter(v => {
    const s = !search || v.num.includes(search.toUpperCase()) || v.owner.toLowerCase().includes(search.toLowerCase())
    const f = filter === 'all'
      || (filter === 'verified' && v.verified)
      || (filter === 'unverified' && !v.verified)
      || v.type === filter
    return s && f
  })

  const handleAdd = () => {
    if (!form.num) return
    setVehicles([...vehicles, {
      ...form,
      id: Date.now().toString(),
      num: form.num.toUpperCase(),
      verified: false,
      owner: 'Pending',
      roll: 'PENDING'
    }])
    setShowAdd(false)
    setForm({ num:'', type:'two_wheeler', make:'', model:'', color:'', year:'' })
  }

  const FILTERS = ['all', 'two_wheeler', 'four_wheeler', 'verified', 'unverified']

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontWeight:'700', fontSize:'20px', color:'var(--text-1)' }}>Vehicle Management</h1>
          <p style={{ fontSize:'13px', color:'var(--text-3)', marginTop:'4px' }}>{vehicles.length} registered vehicles</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} /> Register
        </button>
      </div>

      {showAdd && (
        <div className="card fade-up" style={{ padding:'20px', marginBottom:'16px' }}>
          <h3 style={{ fontWeight:'700', color:'var(--text-1)', marginBottom:'14px' }}>Register New Vehicle</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
            <input
              className="input mono"
              placeholder="Vehicle Number (TN07CD1234)"
              value={form.num}
              onChange={e => setForm({...form, num: e.target.value.toUpperCase()})}
            />
            <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="two_wheeler">Two Wheeler</option>
              <option value="four_wheeler">Four Wheeler</option>
              <option value="bus">Bus</option>
            </select>
            <input className="input" placeholder="Make (Honda, Maruti...)" value={form.make} onChange={e => setForm({...form, make: e.target.value})} />
            <input className="input" placeholder="Model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
            <input className="input" placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
            <input className="input" type="number" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
          </div>
          <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>Register Vehicle</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
        <div className="input-icon-wrap" style={{ flex:1, maxWidth:'300px' }}>
          <Search size={15} className="icon" />
          <input
            className="input"
            placeholder="Search number or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className="btn btn-sm"
              onClick={() => setFilter(f)}
              style={{
                fontSize:'12px',
                textTransform:'capitalize',
                background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? 'white' : 'var(--text-2)',
                border:'1px solid var(--border)'
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Make / Model</th>
                <th>Color</th>
                <th>Year</th>
                <th>Owner</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td className="mono" style={{ color:'var(--text-1)', fontWeight:'700' }}>{v.num}</td>
                  <td>{typeBadge(v.type)}</td>
                  <td>{v.make} {v.model}</td>
                  <td style={{ fontSize:'13px' }}>{v.color}</td>
                  <td className="mono">{v.year}</td>
                  <td>
                    <div style={{ fontSize:'13px', color:'var(--text-1)' }}>{v.owner}</div>
                    <div className="mono" style={{ fontSize:'11px', color:'var(--text-3)' }}>{v.roll}</div>
                  </td>
                  <td>
                    {v.verified
                      ? <span className="badge badge-green"><CheckCircle size={10} /> Verified</span>
                      : <span className="badge badge-red">Pending</span>
                    }
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'6px' }}>
                      {!v.verified && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize:'11px', color:'var(--green)' }}
                          onClick={() => setVehicles(vehicles.map(veh => veh.id === v.id ? {...veh, verified:true} : veh))}
                        >
                          Verify
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => setVehicles(vehicles.filter(veh => veh.id !== v.id))}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-3)' }}>No vehicles found</div>
          )}
        </div>
      </div>
    </div>
  )
}
