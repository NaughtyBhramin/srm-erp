import { useState, useEffect, useRef } from 'react'
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Plus, Send, Hash, Lock, Globe, MessageCircle, BookOpen, Coffee, Gamepad2 } from 'lucide-react'

const ROOMS = [
  { id: 1, name: 'DSA Study Group', type: 'study', icon: '📚', members: 12, maxMembers: 20, isLive: true, host: 'Rahul S.', topic: 'Dynamic Programming — Week 5', color: '#6378ff' },
  { id: 2, name: 'CSE General Hangout', type: 'social', icon: '☕', members: 34, maxMembers: 50, isLive: true, host: 'Open Room', topic: 'Just chatting!', color: '#f5a623' },
  { id: 3, name: 'ML Paper Review', type: 'study', icon: '🤖', members: 8, maxMembers: 15, isLive: true, host: 'Dr. Priya N.', topic: 'Attention Is All You Need — Discussion', color: '#00e5a0' },
  { id: 4, name: 'Friday Gaming Night', type: 'fun', icon: '🎮', members: 23, maxMembers: 30, isLive: false, host: 'Arun P.', topic: 'Among Us & Valorant', color: '#a855f7' },
  { id: 5, name: 'Campus Issues Forum', type: 'discussion', icon: '💬', members: 67, maxMembers: 100, isLive: true, host: 'Student Council', topic: 'Canteen prices & infrastructure', color: '#ff4d6d' },
  { id: 6, name: 'Placement Prep', type: 'study', icon: '💼', members: 45, maxMembers: 60, isLive: true, host: 'TPO Cell', topic: 'Mock interviews — Aptitude round', color: '#22d3ee' },
]

const INIT_MSGS = [
  { id: 1, user: 'Rahul S.', avatar: 'R', color: '#6378ff', text: 'Hey everyone! Starting with memoization basics today', time: '2:01 PM', mine: false },
  { id: 2, user: 'Kavya R.', avatar: 'K', color: '#f5a623', text: 'Great! Can we also cover coin change problem?', time: '2:03 PM', mine: false },
  { id: 3, user: 'You', avatar: 'Y', color: '#00e5a0', text: 'Sure! I have some notes on that 📝', time: '2:04 PM', mine: true },
  { id: 4, user: 'Arun P.', avatar: 'A', color: '#a855f7', text: 'Sharing resources in a sec', time: '2:05 PM', mine: false },
]

function RoomCard({ room, onJoin }) {
  const pct = Math.round(room.members / room.maxMembers * 100)
  return (
    <div className="room-card" onClick={() => onJoin(room)}>
      <div className="room-preview" style={{ background: `linear-gradient(135deg, ${room.color}20, ${room.color}08)` }}>
        <span style={{ fontSize: '40px', position: 'relative', zIndex: 1 }}>{room.icon}</span>
        {room.isLive && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
            <span className="live-dot" style={{ fontSize: '10px' }}>LIVE</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-1)', marginBottom: '4px' }}>{room.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px', lineHeight: '1.4' }}>{room.topic}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={11} /> {room.members}/{room.maxMembers}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{room.host}</span>
        </div>
        <div className="occ-track">
          <div className="occ-fill" style={{ width: `${pct}%`, background: room.color }} />
        </div>
        <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', background: room.isLive ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: room.isLive ? 'white' : 'var(--text-3)' }}>
          {room.isLive ? '→ Join Room' : '⏰ Scheduled'}
        </button>
      </div>
    </div>
  )
}

export default function MeetingRooms() {
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState(INIT_MSGS)
  const [msg, setMsg] = useState('')
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState('rooms')
  const chatEnd = useRef(null)

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMsg = () => {
    if (!msg.trim()) return
    setMessages([...messages, { id: Date.now(), user: 'You', avatar: 'Y', color: '#00e5a0', text: msg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), mine: true }])
    setMsg('')
  }

  const filtered = filter === 'all' ? ROOMS : ROOMS.filter(r => r.type === filter)

  if (activeRoom) return (
    <div style={{ height: 'calc(100vh - 130px)', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
      {/* Main area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header */}
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{activeRoom.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', color: 'var(--text-1)' }}>{activeRoom.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{activeRoom.topic}</div>
          </div>
          <span className="live-dot">LIVE</span>
          <span style={{ fontSize: '13px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {activeRoom.members}</span>
        </div>

        {/* Video grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {['Rahul S.', 'Kavya R.', 'Arun P.', 'Dr. Priya', 'Sneha K.', 'You'].map((name, i) => (
            <div key={name} style={{ background: `linear-gradient(135deg, ${['#6378ff','#f5a623','#a855f7','#00e5a0','#ff4d6d','#22d3ee'][i]}18, var(--bg-elevated))`, border: '1px solid var(--border)', borderRadius: '12px', aspectRatio: '16/10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${['#6378ff','#f5a623','#a855f7','#00e5a0','#ff4d6d','#22d3ee'][i]}, ${['#6378ff','#f5a623','#a855f7','#00e5a0','#ff4d6d','#22d3ee'][i]}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px', color: 'white' }}>{name[0]}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: '600' }}>{name}</div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                {i === 2 && <div style={{ background: 'rgba(255,77,109,0.8)', padding: '3px', borderRadius: '4px' }}><MicOff size={9} color="white" /></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className={`btn ${muted ? 'btn-danger' : 'btn-ghost'}`} onClick={() => setMuted(!muted)}>{muted ? <MicOff size={16} /> : <Mic size={16} />}</button>
          <button className={`btn ${videoOff ? 'btn-danger' : 'btn-ghost'}`} onClick={() => setVideoOff(!videoOff)}>{videoOff ? <VideoOff size={16} /> : <Video size={16} />}</button>
          <button className="btn btn-danger" onClick={() => setActiveRoom(null)}><PhoneOff size={16} /> Leave</button>
        </div>
      </div>

      {/* Chat */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '14px', color: 'var(--text-1)' }}>
          <MessageCircle size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--primary)' }} />Room Chat
        </div>
        <div style={{ flex: 1, overflow: 'y-auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start', gap: '4px' }}>
              {!m.mine && <div style={{ fontSize: '11px', color: 'var(--text-3)', paddingLeft: '4px' }}>{m.user}</div>}
              <div className={`chat-bubble ${m.mine ? 'mine' : 'theirs'}`}>{m.text}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{m.time}</div>
            </div>
          ))}
          <div ref={chatEnd} />
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
          <input className="input" style={{ fontSize: '13px' }} placeholder="Type a message..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
          <button className="btn btn-primary btn-icon" onClick={sendMsg}><Send size={14} /></button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-1)' }}>Meeting & Study Rooms</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Connect, study, and socialize — all in one place</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Create Room</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'study', 'social', 'discussion', 'fun'].map(f => (
          <button key={f} className="btn btn-sm" style={{ textTransform: 'capitalize', background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: filter === f ? 'white' : 'var(--text-2)', border: '1px solid var(--border)' }} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-3)' }}>
          <Users size={14} />{ROOMS.reduce((s,r) => s + r.members, 0)} online now
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {filtered.map(r => <RoomCard key={r.id} room={r} onJoin={setActiveRoom} />)}
      </div>
    </div>
  )
}
