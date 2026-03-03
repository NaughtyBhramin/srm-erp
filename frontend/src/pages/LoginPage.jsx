import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

// ── Role display metadata ──────────────────────────────
const ROLES = [
  { key:'admin',     label:'Administrator',    color:'#ff6b35', icon:'⬡', hint:'admin@srmist.edu.in / Admin@2024' },
  { key:'student',   label:'Student',          color:'#5b6ef5', icon:'◈', hint:'rahul@srmist.edu.in / Student@2024' },
  { key:'faculty',   label:'Faculty',          color:'#00c896', icon:'◆', hint:'priya@srmist.edu.in / Faculty@2024' },
  { key:'accounts',  label:'Accounts Officer', color:'#e8b400', icon:'◉', hint:'accounts@srmist.edu.in / Accounts@2024' },
  { key:'security',  label:'Security Officer', color:'#ef4444', icon:'⬟', hint:'security@srmist.edu.in / Security@2024' },
  { key:'transport', label:'Transport Officer',color:'#14b8e0', icon:'⬡', hint:'transport@srmist.edu.in / Transport@2024' },
  { key:'medical',   label:'Medical Officer',  color:'#e879c0', icon:'✦', hint:'medical@srmist.edu.in / Medical@2024' },
  { key:'parent',    label:'Parent/Guardian',  color:'#9b87f5', icon:'◇', hint:'parent@srmist.edu.in / Parent@2024' },
]

// ── Steps ─────────────────────────────────────────────
const STEP_LOGIN = 'login'
const STEP_MFA   = 'mfa'
const STEP_RESET = 'reset'
const STEP_DONE  = 'done'

// ── OTP Input component ───────────────────────────────
function OTPInput({ length = 6, value, onChange, disabled }) {
  const inputs = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, j) => j === i ? '' : d).join('')
      onChange(next)
      if (i > 0 && !digits[i]) inputs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handleChange = (i, v) => {
    const char = v.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, j) => j === i ? char : d).join('')
    onChange(next)
    if (char && i < length - 1) inputs.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(text.padEnd(length, '').slice(0, length).trimEnd())
    inputs.current[Math.min(text.length, length - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: '46px', height: '54px',
            textAlign: 'center', fontSize: '22px', fontWeight: '800',
            fontFamily: "'JetBrains Mono', monospace",
            background: d ? 'rgba(91,110,245,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${d ? 'rgba(91,110,245,0.6)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '12px', color: '#eef2ff', outline: 'none',
            transition: 'all 0.15s',
            boxShadow: d ? '0 0 0 3px rgba(91,110,245,0.15)' : 'none',
            opacity: disabled ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  )
}

// ── Timer component ───────────────────────────────────
function OTPTimer({ onExpire }) {
  const [secs, setSecs] = useState(30)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => { if (s <= 1) { onExpire?.(); return 30 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [])
  const pct = (secs / 30) * 100
  const color = secs > 10 ? '#00c896' : secs > 5 ? '#e8b400' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5"/>
        <circle cx="14" cy="14" r="11" fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={`${2 * Math.PI * 11}`}
          strokeDashoffset={`${2 * Math.PI * 11 * (1 - pct / 100)}`}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color, fontWeight: 700 }}>
        {String(secs).padStart(2, '0')}s
      </span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>next code</span>
    </div>
  )
}

// ── Password strength ─────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ chars',   ok: password.length >= 8 },
    { label: 'Uppercase',  ok: /[A-Z]/.test(password) },
    { label: 'Number',     ok: /\d/.test(password) },
    { label: 'Symbol',     ok: /[!@#$%^&*]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['#ef4444', '#e8b400', '#14b8e0', '#00c896']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {checks.map((c, i) => (
            <span key={i} style={{ fontSize: '10px', color: c.ok ? '#00c896' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
              {c.ok ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: colors[score - 1] }}>{labels[score - 1]}</span>}
      </div>
    </div>
  )
}

// ── MAIN LOGIN PAGE ───────────────────────────────────
export default function LoginPage() {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]           = useState(STEP_LOGIN)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [otp, setOtp]             = useState('')
  const [tempToken, setTempToken] = useState('')
  const [mfaUser, setMfaUser]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [selectedHint, setHint]   = useState(null)
  const [shakeForm, setShake]     = useState(false)
  const [attempts, setAttempts]   = useState(0)
  const emailRef = useRef(null)

  // Demo: use API if available, fallback to mock
  const USE_REAL_API = false // flip to true when backend is running

  useEffect(() => { emailRef.current?.focus() }, [])
  useEffect(() => { setError(''); setSuccess('') }, [step])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  // ── Handlers ─────────────────────────────────────────
  const handleLogin = async (e) => {
    e?.preventDefault()
    if (!email || !password) { setError('Please enter both email and password.'); return }
    setLoading(true); setError('')
    try {
      let result
      if (USE_REAL_API) {
        result = await authService.login(email, password)
      } else {
        // Demo mock
        result = await mockLogin(email, password)
      }

      if (result.status === 'mfa_required') {
        setTempToken(result.temp_token)
        setMfaUser({ name: result.user_name, role: result.user_role })
        setStep(STEP_MFA)
      } else if (result.status === 'success') {
        if (USE_REAL_API) authService.saveSession(result)
        loginWithToken(result)
        navigate('/dashboard')
      }
    } catch (err) {
      setAttempts(a => a + 1)
      setError(err.message)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleMFA = async (e) => {
    e?.preventDefault()
    if (otp.length !== 6) { setError('Enter the 6-digit code from your authenticator app.'); return }
    setLoading(true); setError('')
    try {
      let result
      if (USE_REAL_API) {
        result = await authService.verifyMFA(tempToken, otp)
      } else {
        result = await mockMFAVerify(tempToken, otp)
      }
      if (USE_REAL_API) authService.saveSession(result)
      loginWithToken(result)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setOtp('')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e?.preventDefault()
    if (!resetEmail) { setError('Enter your email address.'); return }
    setLoading(true); setError('')
    try {
      const result = await authService.requestPasswordReset(resetEmail)
      setSuccess('Reset link sent! Check your email. (Demo token: ' + (result.demo_token?.slice(0,12) || 'N/A') + '…)')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (hint) => {
    const [e, p] = hint.split(' / ')
    setEmail(e); setPassword(p); setHint(null)
  }

  // ── Render helpers ────────────────────────────────────
  const InputField = ({ label, type = 'text', value, onChange, placeholder, autoFocus, icon, right, error: fieldErr }) => (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none', opacity: 0.5 }}>{icon}</span>}
        <input
          ref={label === 'Email Address' ? emailRef : undefined}
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoFocus={autoFocus}
          style={{
            width: '100%', padding: `11px ${right ? '44px' : '14px'} 11px ${icon ? '40px' : '14px'}`,
            background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${fieldErr ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '11px', color: '#eef2ff', fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(91,110,245,0.6)'}
          onBlur={e => e.target.style.borderColor = fieldErr ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
        />
        {right}
      </div>
    </div>
  )

  const Btn = ({ children, onClick, type = 'button', loading: btnLoading, disabled, secondary, style: s }) => (
    <button type={type} onClick={onClick} disabled={disabled || btnLoading}
      style={{
        width: '100%', padding: '13px', borderRadius: '11px', border: 'none',
        fontSize: '14px', fontWeight: 700, cursor: disabled || btnLoading ? 'not-allowed' : 'pointer',
        background: secondary ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(91,110,245,0.9), rgba(91,110,245,0.7))',
        color: secondary ? 'rgba(255,255,255,0.5)' : '#fff',
        border: secondary ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(91,110,245,0.4)',
        boxShadow: secondary ? 'none' : '0 4px 20px rgba(91,110,245,0.3)',
        transition: 'all 0.2s', opacity: disabled ? 0.6 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        ...(s || {})
      }}
    >
      {btnLoading ? (
        <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/> Verifying…</>
      ) : children}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#02040a', display: 'flex', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Ambient background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '800px', height: '800px', top: '-300px', left: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,110,245,0.08) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', width: '600px', height: '600px', bottom: '-200px', right: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,150,0.05) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', width: '500px', height: '500px', top: '30%', right: '-100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)' }}/>
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.6 }}/>
      </div>

      {/* ── LEFT PANEL — Branding ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '480px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '56px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #5b6ef5, #3a4fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: '#fff', boxShadow: '0 8px 24px rgba(91,110,245,0.4)' }}>S</div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>SRM ERP</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>CAMPUS INTELLIGENCE v2.0</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(36px,4vw,56px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            One platform.<br/>
            <span style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>Every campus</span><br/>
            operation.
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: '48px', maxWidth: '380px' }}>
            Secure, role-based access for administrators, faculty, students, parents, and operations teams across all residential colleges.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px' }}>
            {['🔐 MFA Security','🏛 4 Colleges','📱 Real-time','🚌 GPS Tracking','🏥 Medical','💬 Social Feed'].map(f => (
              <div key={f} style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{f}</div>
            ))}
          </div>

          {/* Role hints */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: '12px' }}>Demo Credentials</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {ROLES.map(r => (
                <button key={r.key} onClick={() => { setHint(r.key); fillDemo(r.hint) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 11px', borderRadius: '9px', cursor: 'pointer',
                    background: selectedHint === r.key ? `${r.color}18` : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${selectedHint === r.key ? r.color + '50' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = r.color + '40'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = selectedHint === r.key ? r.color + '50' : 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: r.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: r.color, flexShrink: 0 }}>{r.icon}</div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: selectedHint === r.key ? r.color : 'rgba(255,255,255,0.45)' }}>{r.label}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', marginTop: '10px' }}>Click a role to auto-fill credentials</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{ width: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Card */}
          <div style={{
            background: 'rgba(6,11,22,0.95)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: '22px',
            padding: '36px 32px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            animation: shakeForm ? 'shake 0.4s ease' : 'slideIn 0.4s ease',
          }}>

            {/* ══ STEP: LOGIN ══ */}
            {step === STEP_LOGIN && (
              <>
                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Sign in</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Enter your SRMIST credentials to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                  <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="yourname@srmist.edu.in" icon="✉" />

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password</label>
                      <button type="button" onClick={() => setStep(STEP_RESET)} style={{ fontSize: '11.5px', color: 'rgba(91,110,245,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Forgot password?</button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5, pointerEvents: 'none' }}>🔑</span>
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                        style={{ width: '100%', padding: '11px 44px 11px 40px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '11px', color: '#eef2ff', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", outline: 'none', letterSpacing: password ? '0.15em' : 'normal' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(91,110,245,0.6)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.5 }}>{showPw ? '🙈' : '👁'}</button>
                    </div>
                  </div>

                  {/* Rate limit warning */}
                  {attempts >= 3 && (
                    <div style={{ padding: '9px 12px', borderRadius: '9px', background: 'rgba(232,180,0,0.08)', border: '1px solid rgba(232,180,0,0.25)', fontSize: '12px', color: '#e8b400', marginBottom: '14px', display: 'flex', gap: '7px' }}>
                      ⚠️ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before 15-minute lockout
                    </div>
                  )}

                  {error && (
                    <div style={{ padding: '10px 13px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12.5px', color: '#fca5a5', marginBottom: '16px', display: 'flex', gap: '8px', lineHeight: 1.5 }}>
                      🚫 {error}
                    </div>
                  )}

                  <Btn type="submit" loading={loading}>
                    Continue →
                  </Btn>
                </form>

                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>or sign in with</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
                </div>

                {/* SSO options */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[['🎓','SRMIST SSO'],['🔵','Microsoft']].map(([ic, lb]) => (
                    <button key={lb} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.45)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontFamily: "'DM Sans',sans-serif" }}>
                      <span>{ic}</span>{lb}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ══ STEP: MFA ══ */}
            {step === STEP_MFA && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(91,110,245,0.15)', border: '1px solid rgba(91,110,245,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>🔐</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Two-Factor Auth</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>
                    Hi <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{mfaUser?.name}</strong>.<br/>
                    Open your authenticator app and enter the 6-digit code.
                  </p>
                </div>

                <form onSubmit={handleMFA}>
                  <OTPInput length={6} value={otp} onChange={setOtp} disabled={loading} />

                  <div style={{ margin: '20px 0' }}>
                    <OTPTimer />
                  </div>

                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(91,110,245,0.07)', border: '1px solid rgba(91,110,245,0.2)', fontSize: '11.5px', color: 'rgba(91,110,245,0.8)', marginBottom: '18px', lineHeight: 1.6 }}>
                    💡 Demo: Use code <strong style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px' }}>123456</strong> or any valid TOTP from secret <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>JBSWY3DPEHPK3PXP</code>
                  </div>

                  {error && (
                    <div style={{ padding: '10px 13px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12.5px', color: '#fca5a5', marginBottom: '14px' }}>
                      🚫 {error}
                    </div>
                  )}

                  <Btn type="submit" loading={loading} disabled={otp.length !== 6}>
                    Verify & Sign In →
                  </Btn>

                  <button type="button" onClick={() => { setStep(STEP_LOGIN); setOtp(''); setTempToken('') }} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans',sans-serif" }}>
                    ← Back to login
                  </button>
                </form>
              </>
            )}

            {/* ══ STEP: RESET ══ */}
            {step === STEP_RESET && (
              <>
                <div style={{ marginBottom: '28px' }}>
                  <button onClick={() => setStep(STEP_LOGIN)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '20px', padding: '0', marginBottom: '16px', display: 'block' }}>←</button>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Reset Password</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Enter your SRMIST email. We'll send a reset link.</p>
                </div>
                <form onSubmit={handleReset}>
                  <InputField label="Email Address" type="email" value={resetEmail} onChange={setResetEmail} placeholder="yourname@srmist.edu.in" icon="✉" autoFocus />
                  {error && <div style={{ padding: '10px 13px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12.5px', color: '#fca5a5', marginBottom: '14px' }}>🚫 {error}</div>}
                  {success && <div style={{ padding: '10px 13px', borderRadius: '10px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', fontSize: '12.5px', color: '#6ee7b7', marginBottom: '14px', lineHeight: 1.5 }}>✅ {success}</div>}
                  <Btn type="submit" loading={loading}>Send Reset Link</Btn>
                </form>
              </>
            )}

            {/* Footer */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: 'rgba(255,255,255,0.18)' }}>
                <span>🔒</span> TLS 1.3 Encrypted
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.18)' }}>SRMIST · © 2025</div>
            </div>
          </div>

          {/* Security badge below card */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {['TOTP MFA','JWT Auth','Rate Limited','Session Tracked'].map(b => (
              <div key={b} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'rgba(0,200,150,0.5)', fontSize: '9px' }}>✓</span>{b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes slideIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 100px #060b16 inset!important; -webkit-text-fill-color:#eef2ff!important; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  )
}

// ── Demo mock (no backend needed) ─────────────────────────
async function mockLogin(email, password) {
  await new Promise(r => setTimeout(r, 800))
  const MFA_REQUIRED = ['admin@srmist.edu.in','priya@srmist.edu.in','accounts@srmist.edu.in']
  const USERS = {
    'admin@srmist.edu.in':    { id:'u1', name:'Dr. V. Rajkumar',    role:'admin',    dept:'Administration', college_code:null, college_name:null, college_color:null, pw:'Admin@2024' },
    'rahul@srmist.edu.in':    { id:'u2', name:'Rahul Sharma',        role:'student',  dept:'CSE', college_code:'KC', college_name:'Kalam College', college_color:'#5b6ef5', pw:'Student@2024' },
    'priya@srmist.edu.in':    { id:'u3', name:'Dr. Priya Nair',      role:'faculty',  dept:'CSE', college_code:'TC', college_name:'Tagore College', college_color:'#00c896', pw:'Faculty@2024' },
    'accounts@srmist.edu.in': { id:'u4', name:'Kavitha Subramanian', role:'accounts', dept:'Finance', college_code:null, college_name:null, college_color:null, pw:'Accounts@2024' },
    'security@srmist.edu.in': { id:'u5', name:'Ram Kumar',           role:'security', dept:'Security', college_code:null, college_name:null, college_color:null, pw:'Security@2024' },
    'transport@srmist.edu.in':{ id:'u6', name:'Suresh Pandian',      role:'transport',dept:'Transport', college_code:null, college_name:null, college_color:null, pw:'Transport@2024' },
    'medical@srmist.edu.in':  { id:'u7', name:'Dr. Anitha Krishnan', role:'medical',  dept:'Medical', college_code:null, college_name:null, college_color:null, pw:'Medical@2024' },
    'parent@srmist.edu.in':   { id:'u8', name:'Mr. S. Krishnaswamy', role:'parent',   dept:null, college_code:'KC', college_name:'Kalam College', college_color:'#5b6ef5', pw:'Parent@2024' },
  }
  const user = USERS[email.toLowerCase()]
  if (!user || user.pw !== password) throw new Error('Invalid credentials. Check email and password.')
  if (MFA_REQUIRED.includes(email.toLowerCase())) {
    return { status:'mfa_required', temp_token:`tmp_${email}`, user_name:user.name, user_role:user.role }
  }
  return {
    status:'success', access_token:'demo_token', refresh_token:'demo_refresh', session_id:'demo_session',
    user:{ id:user.id, name:user.name, email, role:user.role, dept:user.dept, college_code:user.college_code, college_name:user.college_name, college_color:user.college_color }
  }
}

async function mockMFAVerify(tempToken, code) {
  await new Promise(r => setTimeout(r, 600))
  // Accept 123456 as demo code
  if (code !== '123456' && !/^\d{6}$/.test(code)) throw new Error('Invalid code. Use 123456 for demo.')
  const email = tempToken.replace('tmp_','')
  const USERS = {
    'admin@srmist.edu.in':    { id:'u1', name:'Dr. V. Rajkumar',    role:'admin',    dept:'Administration', college_code:null, college_name:null, college_color:null },
    'priya@srmist.edu.in':    { id:'u3', name:'Dr. Priya Nair',      role:'faculty',  dept:'CSE', college_code:'TC', college_name:'Tagore College', college_color:'#00c896' },
    'accounts@srmist.edu.in': { id:'u4', name:'Kavitha Subramanian', role:'accounts', dept:'Finance', college_code:null, college_name:null, college_color:null },
  }
  const user = USERS[email]
  if (!user) throw new Error('Session expired. Please log in again.')
  return {
    status:'success', access_token:'demo_token', refresh_token:'demo_refresh', session_id:'demo_session',
    user:{ id:user.id, name:user.name, email, role:user.role, dept:user.dept, college_code:user.college_code, college_name:user.college_name, college_color:user.college_color }
  }
}
