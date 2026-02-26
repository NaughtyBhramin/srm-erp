import { useState } from 'react'
import { Search, GraduationCap } from 'lucide-react'

const STUDENTS = [
  { id:'1', reg:'RA2111003010001', name:'Rahul Sharma', dept:'CSE', year:3, sem:5, cgpa:8.72, batch:'2021-25', email:'rahul.s@srmist.edu.in' },
  { id:'2', reg:'RA2111003010002', name:'Kavya Reddy', dept:'CSE', year:3, sem:5, cgpa:9.15, batch:'2021-25', email:'kavya.r@srmist.edu.in' },
  { id:'3', reg:'RA2111004020001', name:'Arun Patel', dept:'ECE', year:2, sem:3, cgpa:7.88, batch:'2022-26', email:'arun.p@srmist.edu.in' },
  { id:'4', reg:'RA2011003010005', name:'Priya Nair', dept:'CSE', year:4, sem:7, cgpa:9.43, batch:'2020-24', email:'priya.n@srmist.edu.in' },
  { id:'5', reg:'RA2111005030001', name:'Vikram Singh', dept:'MECH', year:3, sem:5, cgpa:7.21, batch:'2021-25', email:'vikram.s@srmist.edu.in' },
  { id:'6', reg:'RA2111003010089', name:'Sneha Kumar', dept:'CSE', year:3, sem:5, cgpa:8.94, batch:'2021-25', email:'sneha.k@srmist.edu.in' },
  { id:'7', reg:'RA2211003010001', name:'Arjun Menon', dept:'CSE', year:2, sem:3, cgpa:8.10, batch:'2022-26', email:'arjun.m@srmist.edu.in' },
  { id:'8', reg:'RA2111006010001', name:'Deepika Rajesh', dept:'CIVIL', year:3, sem:5, cgpa:8.56, batch:'2021-25', email:'deepika.r@srmist.edu.in' },
]
const cgpaColor = (c) => c>=9?'var(--green)':c>=8?'var(--primary)':c>=7?'var(--gold)':'var(--red)'

export default function StudentManagement() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('all')
  const [year, setYear] = useState('all')
  const depts = [...new Set(STUDENTS.map(s => s.dept))]

  const filtered = STUDENTS.filter(s => {
    const ms = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.reg.includes(search)
    const md = dept==='all'||s.dept===dept
    const my = year==='all'||s.year===parseInt(year)
    return ms&&md&&my
  })

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontWeight:'700', fontSize:'20px', color:'var(--text-1)' }}>Student Management</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[{l:'Total Students',v:'18,452',c:'var(--primary)'},{l:'CSE',v:'4,234',c:'var(--gold)'},{l:'Avg CGPA',v:'8.32',c:'var(--green)'},{l:'Active Sem',v:'3,891',c:'var(--purple)'}].map(s=>(
          <div key={s.l} className="stat-card">
            <div className="stat-value" style={{fontSize:'28px',color:s.c}}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
        <div className="input-icon-wrap" style={{ flex:1,maxWidth:'300px' }}>
          <Search size={15} className="icon" />
          <input className="input" placeholder="Search name or reg number..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="input" style={{width:'130px'}} value={dept} onChange={e=>setDept(e.target.value)}>
          <option value="all">All Depts</option>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
        <select className="input" style={{width:'120px'}} value={year} onChange={e=>setYear(e.target.value)}>
          <option value="all">All Years</option>
          {[1,2,3,4].map(y=><option key={y} value={y}>Year {y}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Reg Number</th><th>Name</th><th>Dept</th><th>Year</th><th>Sem</th><th>CGPA</th><th>Batch</th><th>Email</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td className="mono" style={{color:'var(--gold)',fontWeight:'700',fontSize:'12px'}}>{s.reg}</td>
                  <td style={{fontWeight:'600',color:'var(--text-1)'}}>{s.name}</td>
                  <td><span className="badge badge-blue" style={{fontSize:'10px'}}>{s.dept}</span></td>
                  <td style={{textAlign:'center'}}>{s.year}</td>
                  <td style={{textAlign:'center'}}>{s.sem}</td>
                  <td className="mono" style={{fontWeight:'800',color:cgpaColor(s.cgpa)}}>{s.cgpa}</td>
                  <td className="mono" style={{fontSize:'12px'}}>{s.batch}</td>
                  <td style={{fontSize:'12px',color:'var(--text-3)'}}>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
