// Shared UI primitives for all dashboards

export const P = ({ children, style={} }) => (
  <div style={{ padding:'24px', ...style }}>{children}</div>
)

export const Row = ({ children, gap=16, style={} }) => (
  <div style={{ display:'flex', gap, ...style }}>{children}</div>
)

export const Col = ({ children, style={} }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:16, ...style }}>{children}</div>
)

export const Grid = ({ cols=4, gap=16, children, style={} }) => (
  <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap, ...style }}>{children}</div>
)

export const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{
    background:'rgba(255,255,255,0.03)',
    border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'16px', transition:'border-color 0.2s',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}
  >{children}</div>
)

export function StatCard({ label, value, sub, icon, accent='#6378ff', trend, style={} }) {
  return (
    <Card style={{ padding:'20px', ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
        <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.06em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase' }}>{label}</div>
        <div style={{ fontSize:'20px' }}>{icon}</div>
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'32px', fontWeight:800, color:'#fff', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginTop:'6px' }}>{sub}</div>}
      {trend && (
        <div style={{ fontSize:'11px', marginTop:'8px', color: trend.startsWith('+') ? '#00d4aa' : '#ff4757', fontWeight:600 }}>
          {trend.startsWith('+') ? '↑' : '↓'} {trend}
        </div>
      )}
    </Card>
  )
}

export function SectionTitle({ children, action, accent='#fff' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:700, color:'#fff' }}>{children}</div>
      {action && <div style={{ fontSize:'12px', color:accent, cursor:'pointer', fontWeight:600 }}>{action}</div>}
    </div>
  )
}

export function Badge({ children, color='#6378ff', style={} }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'2px 8px', borderRadius:'20px',
      background:`${color}20`, border:`1px solid ${color}40`,
      color, fontSize:'10px', fontWeight:700, ...style
    }}>{children}</span>
  )
}

export function Pill({ children, active, color='#6378ff', onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'5px 14px', borderRadius:'20px', cursor:'pointer', fontSize:'12px', fontWeight:600,
      border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
      background: active ? `${color}20` : 'transparent',
      color: active ? color : 'rgba(255,255,255,0.4)',
      transition:'all 0.15s'
    }}>{children}</button>
  )
}

export function Avatar({ name, color='#6378ff', size=36 }) {
  const initials = name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:`linear-gradient(135deg, ${color}, ${color}80)`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight:800, fontSize: size*0.33 + 'px', color:'#fff', flexShrink:0
    }}>{initials}</div>
  )
}

export const MiniBar = ({ value, max=100, color='#6378ff', height=6 }) => (
  <div style={{ height, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
    <div style={{ height:'100%', width:`${Math.min(100,(value/max)*100)}%`, background:color, borderRadius:99, transition:'width 0.6s ease' }} />
  </div>
)
