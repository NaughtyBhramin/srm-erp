import { useState, useEffect } from 'react'
import { Car, Bike, Bus, MapPin, LogIn, LogOut, RefreshCw, AlertCircle } from 'lucide-react'

const ZONES = [
  { id:'za', code:'ZA-2W', name:'Zone A — Staff 2W', total:200, available:45, type:'two_wheeler', rate:0, location:'Near Admin Block, Gate 1' },
  { id:'zb', code:'ZB-2W', name:'Zone B — Student 2W', total:500, available:82, type:'two_wheeler', rate:5, location:'East Campus, Near Library' },
  { id:'zc', code:'ZC-4W', name:'Zone C — Staff 4W', total:100, available:28, type:'four_wheeler', rate:0, location:'Near Admin Block' },
  { id:'zd', code:'ZD-4W', name:'Zone D — Student 4W', total:150, available:12, type:'four_wheeler', rate:20, location:'West Campus Parking' },
  { id:'ze', code:'ZE-BUS', name:'Zone E — Bus Bay', total:30, available:16, type:'bus', rate:0, location:'Main Gate Bus Bay' },
  { id:'zf', code:'ZF-VIS', name:'Zone F — Visitor', total:50, available:22, type:'four_wheeler', rate:30, location:'Main Entrance' },
]

function genSlots(zoneId, total, available) {
  const slots = Math.min(total, 80)
  const occRate = 1 - available / total
  return Array.from({ length: slots }, (_, i) => ({
    id: `${zoneId}-${i+1}`, number: `${zoneId.toUpperCase().split('').pop()}${String(i+1).padStart(2,'0')}`,
    occupied: Math.random() < occRate,
    type: i % 15 === 0 ? 'handicap' : i % 8 === 0 ? 'reserved' : 'standard'
  }))
}

const ICON = { two_wheeler: Bike, four_wheeler: Car, bus: Bus }

export default function ParkingDashboard() {
  const [selected, setSelected] = useState(ZONES[0])
  const [slots] = useState(() => Object.fromEntries(ZONES.map(z => [z.id, genSlots(z.id, z.total, z.available)])))
  const [showEntry, setShowEntry] = useState(false)
  const [vehicle, setVehicle] = useState('')
  const [slotFilter, setSlotFilter] = useState('all')

  const totalSlots = ZONES.reduce((s, z) => s + z.total, 0)
  const totalAvail = ZONES.reduce((s, z) => s + z.available, 0)
  const activeSlots = slots[selected?.id] || []
  const filteredSlots = slotFilter === 'free' ? activeSlots.filter(s => !s.occupied) : slotFilter === 'occ' ? activeSlots.filter(s => s.occupied) : activeSlots

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Vehicle Parking System</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm"><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowEntry(!showEntry)}><LogIn size={14} /> Record Entry</button>
        </div>
      </div>

      {/* Quick entry */}
      {showEntry && (
        <div className="card fade-up" style={{ padding: '18px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-3)', display: 'block', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle Number</label>
              <input className="input mono" placeholder="TN07CD1234" value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-3)', display: 'block', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zone</label>
              <select className="input">{ZONES.map(z => <option key={z.id}>{z.code} — {z.name.split('—')[1]?.trim()}</option>)}</select>
            </div>
            <button className="btn btn-primary"><LogIn size={14} /> Confirm</button>
            <button className="btn btn-ghost" onClick={() => setShowEntry(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { l: 'Total Capacity', v: totalSlots, c: 'var(--text-2)' },
          { l: 'Occupied', v: totalSlots - totalAvail, c: 'var(--red)' },
          { l: 'Available', v: totalAvail, c: 'var(--green)' },
          { l: 'Occupancy', v: `${Math.round((totalSlots - totalAvail)/totalSlots*100)}%`, c: 'var(--gold)' },
        ].map(s => (
          <div key={s.l} className="stat-card" style={{ textAlign: 'center', padding: '16px' }}>
            <div className="stat-value" style={{ fontSize: '30px', color: s.c }}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
        {/* Zone list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="section-title">Parking Zones</div>
          {ZONES.map(z => {
            const pct = Math.round((z.total - z.available) / z.total * 100)
            const c = pct > 90 ? 'var(--red)' : pct > 75 ? 'var(--gold)' : 'var(--green)'
            const Icon = ICON[z.type] || Car
            return (
              <div key={z.id} onClick={() => setSelected(z)}
                style={{ padding: '14px', background: selected?.id === z.id ? 'rgba(99,120,255,0.1)' : 'var(--bg-card)', border: `1px solid ${selected?.id === z.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={14} style={{ color: selected?.id === z.id ? 'var(--primary)' : 'var(--text-3)' }} />
                    <span className="mono" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-2)' }}>{z.code}</span>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', fontWeight: '800', color: c }}>{pct}%</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-1)', marginBottom: '6px', fontWeight: '600' }}>{z.name.split('—')[1]?.trim()}</div>
                <div className="occ-track">
                  <div className="occ-fill" style={{ width: `${pct}%`, background: c }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '5px' }}>
                  <span style={{ color: 'var(--green)' }}>{z.available} free</span>
                  <span style={{ color: 'var(--text-3)' }}>{z.total} total</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Slot grid */}
        <div className="card" style={{ padding: '20px' }}>
          {selected && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-1)', fontSize: '16px' }}>{selected.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> {selected.location}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'free', 'occ'].map(f => (
                    <button key={f} className="btn btn-sm" onClick={() => setSlotFilter(f)}
                      style={{ fontSize: '11px', textTransform: 'capitalize', background: slotFilter === f ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: slotFilter === f ? 'white' : 'var(--text-2)', border: '1px solid var(--border)' }}>
                      {f === 'occ' ? 'Occupied' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '11px', flexWrap: 'wrap' }}>
                {[['slot-free', 'Free'], ['slot-occ', 'Occupied'], ['slot-reserved', 'Reserved'], ['slot-handicap', 'Handicap']].map(([cls, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div className={`slot ${cls}`} style={{ width: '20px', height: '14px', fontSize: '8px', borderRadius: '3px', cursor: 'default' }} />
                    <span style={{ color: 'var(--text-3)' }}>{l}</span>
                  </div>
                ))}
              </div>

              <div className="slot-grid">
                {filteredSlots.map(slot => (
                  <div key={slot.id}
                    className={`slot ${slot.occupied ? 'slot-occ' : slot.type === 'handicap' ? 'slot-handicap' : slot.type === 'reserved' ? 'slot-reserved' : 'slot-free'}`}
                    title={`${slot.number} — ${slot.occupied ? 'Occupied' : slot.type}`}>
                    {slot.number}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(99,120,255,0.06)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Showing {filteredSlots.length} slots</span>
                <span>{selected.rate > 0 ? `₹${selected.rate}/hour` : 'Free parking'}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
