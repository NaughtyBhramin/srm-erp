import { useState } from 'react'
import { BookOpen, Download, Upload, Search, Eye, Star, Clock, FileText, Film, Image, Archive, Filter, Plus } from 'lucide-react'

const SUBJECTS = ['All', 'Data Structures', 'Machine Learning', 'DBMS', 'Networks', 'OS', 'Mathematics', 'Physics']

const MATERIALS = [
  { id: 1, title: 'DSA Complete Notes — Trees & Graphs', subject: 'Data Structures', type: 'pdf', size: '4.2 MB', author: 'Dr. Priya Nair', date: 'Feb 20', downloads: 342, rating: 4.8, starred: true },
  { id: 2, title: 'Neural Networks Lecture Slides — Week 8', subject: 'Machine Learning', type: 'ppt', size: '18.5 MB', author: 'Dr. Suresh Kumar', date: 'Feb 19', downloads: 218, rating: 4.6, starred: false },
  { id: 3, title: 'SQL Advanced Queries — Practice Set', subject: 'DBMS', type: 'pdf', size: '1.8 MB', author: 'Dr. Anitha R.', date: 'Feb 18', downloads: 189, rating: 4.5, starred: false },
  { id: 4, title: 'OS Process Scheduling — Animated Video', subject: 'OS', type: 'video', size: '245 MB', author: 'Prof. Ramesh V.', date: 'Feb 17', downloads: 156, rating: 4.9, starred: true },
  { id: 5, title: 'Computer Networks Lab Manual', subject: 'Networks', type: 'pdf', size: '6.1 MB', author: 'Dr. Kavitha M.', date: 'Feb 15', downloads: 298, rating: 4.3, starred: false },
  { id: 6, title: 'Linear Algebra Formula Sheet', subject: 'Mathematics', type: 'pdf', size: '0.9 MB', author: 'Dr. Srinivasan T.', date: 'Feb 14', downloads: 445, rating: 4.7, starred: true },
  { id: 7, title: 'ML Assignment 3 — Dataset', subject: 'Machine Learning', type: 'archive', size: '89 MB', author: 'Dr. Suresh Kumar', date: 'Feb 13', downloads: 134, rating: 4.2, starred: false },
  { id: 8, title: 'Physics Unit 4 — Quantum Mechanics', subject: 'Physics', type: 'pdf', size: '3.4 MB', author: 'Dr. Meera P.', date: 'Feb 12', downloads: 267, rating: 4.4, starred: false },
]

const typeIcon = { pdf: { icon: '📄', color: '#ff4d6d' }, ppt: { icon: '📊', color: '#f5a623' }, video: { icon: '🎬', color: '#a855f7' }, archive: { icon: '📦', color: '#22d3ee' } }

function MaterialCard({ m, onStar }) {
  const t = typeIcon[m.type]
  return (
    <div className="material-card">
      <div style={{ display: 'flex', gap: '14px' }}>
        <div className="file-icon" style={{ background: `${t.color}18`, flexShrink: 0 }}>{t.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: 'var(--text-1)', fontSize: '14px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px' }}>{m.author} · {m.date}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-blue" style={{ fontSize: '10px' }}>{m.subject}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{m.size}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '2px' }}><Download size={10} /> {m.downloads}</span>
            <span style={{ fontSize: '11px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '2px' }}>★ {m.rating}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
          <button className="btn btn-primary btn-sm btn-icon" title="Download"><Download size={13} /></button>
          <button className="btn btn-ghost btn-sm btn-icon" title="Preview"><Eye size={13} /></button>
          <button className="btn btn-sm btn-icon" style={{ background: m.starred ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)', color: m.starred ? 'var(--gold)' : 'var(--text-3)', border: '1px solid var(--border)' }} onClick={() => onStar(m.id)}>
            <Star size={13} fill={m.starred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudyMaterials() {
  const [materials, setMaterials] = useState(MATERIALS)
  const [subject, setSubject] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date')
  const [showUpload, setShowUpload] = useState(false)

  const onStar = (id) => setMaterials(materials.map(m => m.id === id ? { ...m, starred: !m.starred } : m))

  const filtered = materials
    .filter(m => (subject === 'All' || m.subject === subject) && (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sort === 'date' ? 0 : sort === 'downloads' ? b.downloads - a.downloads : b.rating - a.rating)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
      {/* Main */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Study Hub</h1>
          <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(!showUpload)}><Upload size={14} /> Upload Material</button>
        </div>

        {showUpload && (
          <div className="card fade-up" style={{ padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '14px' }}>Upload Study Material</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input className="input" placeholder="Title" />
              <select className="input">{SUBJECTS.slice(1).map(s => <option key={s}>{s}</option>)}</select>
              <div style={{ gridColumn: '1/-1', border: '2px dashed var(--border)', borderRadius: '10px', padding: '24px', textAlign: 'center', color: 'var(--text-3)', cursor: 'pointer' }} onMouseOver={e => e.target.style.borderColor = 'var(--primary)'} onMouseOut={e => e.target.style.borderColor = 'var(--border)'}>
                <Upload size={24} style={{ margin: '0 auto 8px', color: 'var(--primary)' }} />
                <div style={{ fontSize: '14px' }}>Drop files here or <span style={{ color: 'var(--primary)' }}>browse</span></div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, PPT, Video, ZIP — Max 500MB</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-primary btn-sm">Upload</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Search & filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div className="input-icon-wrap" style={{ flex: 1 }}>
            <Search size={15} className="icon" />
            <input className="input" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" style={{ width: '140px' }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date">Latest</option>
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Subject pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(s)} className="btn btn-sm"
              style={{ fontSize: '12px', background: subject === s ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: subject === s ? 'white' : 'var(--text-2)', border: '1px solid var(--border)' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Materials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(m => <MaterialCard key={m.id} m={m} onStar={onStar} />)}
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>No materials found</div>}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Stats */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '14px' }}>📊 Library Stats</div>
          {[
            { label: 'Total Materials', value: '2,847', color: 'var(--primary)' },
            { label: 'Total Downloads', value: '45,231', color: 'var(--gold)' },
            { label: 'Top Subject', value: 'Data Structures', color: 'var(--green)' },
            { label: 'Contributors', value: '124 Faculty', color: 'var(--purple)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>{s.label}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Starred */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-1)', marginBottom: '14px' }}>⭐ My Starred</div>
          {materials.filter(m => m.starred).map(m => (
            <div key={m.id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>{typeIcon[m.type].icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12.5px', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{m.subject}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
