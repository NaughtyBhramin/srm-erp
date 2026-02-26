import { useState, useEffect } from 'react'
import { Bus, MapPin, Clock, Users, CheckCircle, AlertTriangle, Navigation, RefreshCw } from 'lucide-react'

const ROUTES = [
  { id: 'R1', name: 'Route 1 — Tambaram', stops: ['SRM Gate','Potheri','Vandalur','Tambaram','Pallavaram'], color: '#6378ff', buses: 4, delay: 0, nextArrival: 3 },
  { id: 'R2', name: 'Route 2 — Velachery', stops: ['SRM Gate','Medavakkam','Perungudi','Velachery','OMR'], color: '#f5a623', buses: 3, delay: 8, nextArrival: 11 },
  { id: 'R3', name: 'Route 3 — Chrompet', stops: ['SRM Gate','Guduvanchery','Urapakkam','Chrompet','Pallavaram'], color: '#00e5a0', buses: 2, delay: 0, nextArrival: 7 },
  { id: 'R4', name: 'Route 4 — Porur', stops: ['SRM Gate','Potheri','Vandalur','Porur','Koyambedu'], color: '#a855f7', buses: 3, delay: 0, nextArrival: 14 },
  { id: 'R5', name: 'Route 5 — Saidapet', stops: ['SRM Gate','Perungudi','Kotturpuram','Saidapet','Chennai Central'], color: '#22d3ee', buses: 2, delay: 5, nextArrival: 19 },
]

const LIVE_BUSES = [
  { id: 'TN-SRM-01', route: 'R1', driver: 'Kumar R.', capacity: 52, occupied: 41, speed: 48, location: 'Vandalur Junction', eta: 12, status: 'on-time' },
  { id: 'TN-SRM-04', route: 'R2', driver: 'Suresh P.', capacity: 52, occupied: 38, speed: 0, location: 'Perungudi Signal', eta: 23, status: 'delayed' },
  { id: 'TN-SRM-07', route: 'R3', driver: 'Rajan M.', capacity: 52, occupied: 29, speed: 55, location: 'Urapakkam', eta: 7, status: 'on-time' },
  { id: 'TN-SRM-11', route: 'R4', driver: 'Prakash V.', capacity: 52, occupied: 47, speed: 42, location: 'Porur Flyover', eta: 14, status: 'on-time' },
]

const MY_SCHEDULES = [
  { route: 'Route 1 — Tambaram', board: 'SRM Gate', time: '05:30 PM', seat: 'B-12', status: 'confirmed' },
]

function LiveBusCard({ bus }) {
  const [pulse, setPulse] = useState(true)
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1000); return () => clearInterval(t) }, [])
  const route = ROUTES.find(r => r.id === bus.route)
  const pct = Math.round(bus.occupied / bus.capacity * 100)

  return (
    <div className="bus-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bus size={15} style={{ color: route?.color }} />
            <span className="mono" style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-1)' }}>{bus.id}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{route?.name}</div>
        </div>
        <span className={`badge ${bus.status === 'on-time' ? 'badge-green' : 'badge-red'}`}>
          {bus.status === 'on-time' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
          {bus.status}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', opacity: pulse ? 1 : 0.3, transition: 'opacity 0.5s', flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>{bus.location}</span>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>ETA {bus.eta}m</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12px' }}>
        <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)' }}>{bus.speed} <span style={{ fontSize: '10px', fontWeight: '400', color: 'var(--text-3)' }}>km/h</span></div>
          <div style={{ color: 'var(--text-3)', fontSize: '10px' }}>Speed</div>
        </div>
        <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }}>
          <div style={{ fontWeight: '700', color: pct > 80 ? 'var(--red)' : 'var(--text-1)' }}>{bus.occupied}/{bus.capacity}</div>
          <div style={{ color: 'var(--text-3)', fontSize: '10px' }}>Seats</div>
        </div>
        <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)' }}>{bus.driver.split(' ')[0]}</div>
          <div style={{ color: 'var(--text-3)', fontSize: '10px' }}>Driver</div>
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <div className="occ-track">
          <div className="occ-fill" style={{ width: `${pct}%`, background: pct > 80 ? 'var(--red)' : 'var(--green)' }} />
        </div>
      </div>
    </div>
  )
}

export default function Transport() {
  const [selected, setSelected] = useState(ROUTES[0])
  const [tab, setTab] = useState('live')
  const [attendanceMarked, setAttendanceMarked] = useState({})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Transport Management</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>Real-time bus tracking & attendance</p>
        </div>
        <button className="btn btn-ghost btn-sm"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['live', 'routes', 'schedule', 'attendance'].map(t => (
          <button key={t} className="btn btn-sm" style={{ textTransform: 'capitalize', background: tab === t ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: tab === t ? 'white' : 'var(--text-2)', border: '1px solid var(--border)' }} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'live' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {LIVE_BUSES.map(b => <LiveBusCard key={b.id} bus={b} />)}
        </div>
      )}

      {tab === 'routes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ROUTES.map(r => (
              <div key={r.id} className={`bus-card ${selected?.id === r.id ? 'selected' : ''}`} onClick={() => setSelected(r)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />
                  <span style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-1)' }}>{r.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-3)' }}>
                  <span><Bus size={11} style={{ display: 'inline', marginRight: '4px' }} />{r.buses} buses</span>
                  {r.delay > 0 && <span style={{ color: 'var(--gold)' }}><AlertTriangle size={11} style={{ display: 'inline', marginRight: '4px' }} />{r.delay}m delay</span>}
                  <span style={{ marginLeft: 'auto' }}>Next: {r.nextArrival}m</span>
                </div>
              </div>
            ))}
          </div>
          {selected && (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selected.color }} />
                <h3 style={{ fontWeight: '700', color: 'var(--text-1)', fontSize: '16px' }}>{selected.name}</h3>
              </div>
              <div className="bus-route-line">
                {selected.stops.map((stop, i) => (
                  <div key={stop} className={`route-stop ${i === 1 ? 'active' : ''}`}>
                    <div>
                      <div style={{ fontWeight: i === 0 || i === selected.stops.length - 1 ? '700' : '400', color: i === 0 || i === selected.stops.length - 1 ? 'var(--text-1)' : undefined }}>{stop}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{['Depart', 'In transit', 'Upcoming', 'Upcoming', 'Terminus'][i]}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>{['05:30', '05:52', '06:08', '06:22', '06:40'][i]} PM</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'schedule' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>My Scheduled Buses</h3>
            {MY_SCHEDULES.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <Bus size={20} style={{ color: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-1)' }}>{s.route}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Boarding: {s.board} · Seat: {s.seat}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{s.time}</div>
                  <span className="badge badge-green">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>Book a Bus</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px' }}>
              <select className="input" style={{ fontSize: '13px' }}>
                {ROUTES.map(r => <option key={r.id}>{r.name}</option>)}
              </select>
              <select className="input" style={{ fontSize: '13px' }}>
                {selected?.stops.map(s => <option key={s}>{s}</option>)}
              </select>
              <input className="input" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              <button className="btn btn-primary">Book</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'attendance' && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>Bus Attendance</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>Today — {new Date().toLocaleDateString('en-IN')}</p>
          <table className="table">
            <thead><tr><th>Bus ID</th><th>Route</th><th>Morning</th><th>Evening</th><th>Action</th></tr></thead>
            <tbody>
              {LIVE_BUSES.map(b => {
                const route = ROUTES.find(r => r.id === b.route)
                return (
                  <tr key={b.id}>
                    <td className="mono">{b.id}</td>
                    <td style={{ fontSize: '13px' }}>{route?.name}</td>
                    <td>{attendanceMarked[b.id + '_m'] ? <span className="badge badge-green"><CheckCircle size={10} /> Boarded</span> : <span className="badge">—</span>}</td>
                    <td>{attendanceMarked[b.id + '_e'] ? <span className="badge badge-green"><CheckCircle size={10} /> Boarded</span> : <span className="badge">—</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setAttendanceMarked(a => ({ ...a, [b.id + '_m']: true }))}>Mark AM</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setAttendanceMarked(a => ({ ...a, [b.id + '_e']: true }))}>Mark PM</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
