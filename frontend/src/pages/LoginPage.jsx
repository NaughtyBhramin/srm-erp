import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const demoLogin = (role) => {
    const users = {
      admin: { id: 'demo-1', email: 'admin@srmist.edu.in', full_name: 'Dr. V. Rajkumar', role: 'admin' },
      student: { id: 'demo-2', email: 'ra2111@srmist.edu.in', full_name: 'Rahul Sharma', role: 'student' },
      security: { id: 'demo-3', email: 'sec@srmist.edu.in', full_name: 'Ram Kumar', role: 'security' },
      faculty: { id: 'demo-4', email: 'faculty@srmist.edu.in', full_name: 'Dr. Priya Nair', role: 'faculty' },
    }
    const u = users[role]
    localStorage.setItem('srm_user', JSON.stringify(u))
    localStorage.setItem('srm_token', `demo-${role}`)
    window.location.href = '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Use a demo role below.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient */}
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />

      {/* Left — Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }}>
        <div className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
            <div className="logo-mark" style={{ width: '52px', height: '52px', fontSize: '24px' }}>S</div>
            <div>
              <div className="heading" style={{ fontSize: '28px', color: 'var(--text-1)' }}>SRM ERP</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>SRM Institute of Science & Technology</div>
            </div>
          </div>
          <h1 className="heading" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1, color: 'var(--text-1)', marginBottom: '20px' }}>
            CAMPUS<br />
            <span style={{ color: 'var(--primary)' }}>INTELLIGENCE</span><br />
            PLATFORM
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', maxWidth: '420px', lineHeight: 1.7 }}>
            One unified system for students, faculty, administration, and staff — managing everything from vehicle parking to social connections.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
            {['Vehicle Parking', 'Social Feed', 'Transport Tracking', 'Meeting Rooms', 'Accounts', 'Study Hub'].map(f => (
              <span key={f} className="badge badge-blue">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{ width: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1, borderLeft: '1px solid var(--border)' }}>
        <div style={{ width: '100%' }} className="fade-up fade-up-2">
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '6px' }}>Sign in</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '28px' }}>Access your SRM account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email</label>
              <div className="input-icon-wrap">
                <Mail size={15} className="icon" />
                <input className="input" type="email" placeholder="you@srmist.edu.in" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Lock size={15} className="icon" />
                <input className="input" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: '10px', fontSize: '13px', color: 'var(--red)' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '4px' }}>
              {loading ? <span className="spin-anim" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block' }} /> : <><Zap size={15} /> Sign In</>}
            </button>
          </form>

          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Demo Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['admin', 'student', 'faculty', 'security'].map(role => (
                <button key={role} className="btn btn-ghost" onClick={() => demoLogin(role)}
                  style={{ justifyContent: 'center', fontSize: '12px', textTransform: 'capitalize' }}>
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
