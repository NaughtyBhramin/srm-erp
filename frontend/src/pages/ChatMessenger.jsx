import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const ROOMS = [
  { id:'r1', name:'Kalam College — General', type:'college', college:'KC', color:'#5b6ef5', icon:'🏛', members:342, preview:'Rahul: Anyone free for CN study?', unread:3 },
  { id:'r2', name:'All Campus Notices',       type:'campus',  college:null, color:'#ef4444', icon:'📢', members:1820, preview:'Admin: Fee deadline tomorrow',  unread:1 },
  { id:'r3', name:'CSE — Year 3 Batch',       type:'batch',   college:'KC', color:'#5b6ef5', icon:'📚', members:58,   preview:'Priya: Lab tomorrow 9AM?',     unread:2 },
  { id:'r4', name:'Inter-College Council',    type:'campus',  college:null, color:'#e8b400', icon:'⬡', members:48,   preview:'VC: Sports meet next week',    unread:0 },
  { id:'r5', name:'Tagore College — General', type:'college', college:'TC', color:'#00c896', icon:'🏛', members:280,  preview:'TC Warden: All hands 6PM',    unread:0 },
  { id:'r6', name:'Dr. Priya Nair',          type:'direct',  college:'TC', color:'#00c896', icon:'👩‍🏫', members:null, preview:'Sure, submit by Friday',       unread:0 },
  { id:'r7', name:'Arjun Menon',             type:'direct',  college:'KC', color:'#5b6ef5', icon:'🧑‍💻', members:null, preview:'Bro send the cheat sheet 🙏', unread:0 },
  { id:'r8', name:'Bose College — General',  type:'college', college:'BC', color:'#e8b400', icon:'🏛', members:220,  preview:'BC: Hackathon winners!',       unread:0 },
]

const MSG_HISTORY = {
  r1: [
    { id:1, sender:'Arjun M.', senderId:'arjun', college:'KC', color:'#5b6ef5', content:'Anyone free for a CN study session tonight in the common room?', time:'8:02 PM', mine:false },
    { id:2, sender:'Priya V.', senderId:'priya', college:'TC', color:'#00c896', content:'I can join! What time are you thinking? After dinner around 9?', time:'8:04 PM', mine:false },
    { id:3, sender:'Arjun M.', senderId:'arjun', college:'KC', color:'#5b6ef5', content:'Yeah 9 works. I\'ll bring the printed notes for Unit 3.', time:'8:05 PM', mine:false },
    { id:4, sender:'You', senderId:'me', college:'KC', color:'#5b6ef5', content:'Count me in! Should we book the study room or just use the common area?', time:'8:07 PM', mine:true },
    { id:5, sender:'You', senderId:'me', college:'KC', color:'#5b6ef5', content:'Also I uploaded the mind map to Study Hub earlier — check it out!', time:'8:07 PM', mine:true },
    { id:6, sender:'Arjun M.', senderId:'arjun', college:'KC', color:'#5b6ef5', content:'Study room B is usually free after 8:30. Let me check the booking portal.', time:'8:09 PM', mine:false },
    { id:7, sender:'Ravi P.', senderId:'ravi', college:'KC', color:'#5b6ef5', content:'Can I join too? I\'m really struggling with shortest path algorithms 😅', time:'8:12 PM', mine:false },
    { id:8, sender:'Priya V.', senderId:'priya', college:'TC', color:'#00c896', content:'Of course! The more the merrier. See you all at 9!', time:'8:13 PM', mine:false },
  ],
  r2: [
    { id:1, sender:'Administration', senderId:'admin', college:null, color:'#ef4444', content:'📢 IMPORTANT: Semester fee payment deadline is TOMORROW (March 5). Students with pending fees will not be allowed to sit for end-semester examinations. Please pay immediately via the fee portal.', time:'9:00 AM', mine:false },
    { id:2, sender:'Administration', senderId:'admin', college:null, color:'#ef4444', content:'Library fines must also be cleared. Books overdue for more than 2 weeks have a ₹10/day fine.', time:'9:01 AM', mine:false },
    { id:3, sender:'Transport Dept.', senderId:'transport', college:null, color:'#14b8e0', content:'🚌 Route R02 (Velachery) will depart 15 minutes earlier starting next week — 5:15 PM instead of 5:30 PM.', time:'11:30 AM', mine:false },
  ],
  r3: [
    { id:1, sender:'Priya V.', senderId:'priya', college:'TC', color:'#00c896', content:'Hey everyone, lab tomorrow is at 9AM sharp. Dr. Rajan said no late entries.', time:'7:00 PM', mine:false },
    { id:2, sender:'Vikram S.', senderId:'vikram', college:'KC', color:'#5b6ef5', content:'Which lab? The OS one or Networks?', time:'7:02 PM', mine:false },
    { id:3, sender:'Priya V.', senderId:'priya', college:'TC', color:'#00c896', content:'OS. Bring your own pen drives too — the ones in the lab are all infected lol', time:'7:03 PM', mine:false },
    { id:4, sender:'You', senderId:'me', college:'KC', color:'#5b6ef5', content:'Thanks for the heads up! See you all there.', time:'7:15 PM', mine:true },
  ],
  r6: [
    { id:1, sender:'Dr. Priya Nair', senderId:'priya_fac', college:'TC', color:'#00c896', content:'Hi Rahul, just checking in on your ML project progress. How\'s the dataset preprocessing coming along?', time:'Mon 10:00 AM', mine:false },
    { id:2, sender:'You', senderId:'me', college:'KC', color:'#5b6ef5', content:'Good morning Dr. Nair! I\'ve completed the EDA and feature engineering. Working on the model selection now — going with Random Forest vs XGBoost comparison.', time:'Mon 11:30 AM', mine:true },
    { id:3, sender:'Dr. Priya Nair', senderId:'priya_fac', college:'TC', color:'#00c896', content:'That\'s a great approach! Make sure you document your hyperparameter tuning process. The rubric gives extra marks for reproducibility.', time:'Mon 12:15 PM', mine:false },
    { id:4, sender:'You', senderId:'me', college:'KC', color:'#5b6ef5', content:'Will do! Should I submit the Jupyter notebook along with the report?', time:'Mon 2:00 PM', mine:true },
    { id:5, sender:'Dr. Priya Nair', senderId:'priya_fac', college:'TC', color:'#00c896', content:'Sure, submit by Friday.', time:'Mon 2:45 PM', mine:false },
  ],
}

const ROOM_TYPE_LABEL = { college:'College', batch:'Batch', campus:'Campus-wide', direct:'Direct' }

export default function ChatMessenger() {
  const { user } = useAuth()
  const [activeRoom, setActiveRoom] = useState('r1')
  const [messages, setMessages] = useState(MSG_HISTORY)
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  const room = ROOMS.find(r=>r.id===activeRoom)
  const msgs = messages[activeRoom] || []

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [activeRoom, msgs.length])

  const send = () => {
    if (!input.trim()) return
    const m = { id:Date.now(), sender:'You', senderId:'me', college:user?.collegeCode, color:user?.collegeColor||'#5b6ef5', content:input.trim(), time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}), mine:true }
    setMessages(prev=>({ ...prev, [activeRoom]:[...(prev[activeRoom]||[]), m] }))
    setInput('')
  }

  // Group consecutive messages from same sender
  const grouped = msgs.reduce((acc, m, i) => {
    const prev = msgs[i-1]
    const showAv = !prev || prev.senderId !== m.senderId
    acc.push({ ...m, showAv })
    return acc
  }, [])

  const SECTION_TYPES = [
    { key:'college', label:'College Channels' },
    { key:'campus',  label:'Campus-wide' },
    { key:'batch',   label:'Batch Groups' },
    { key:'direct',  label:'Direct Messages' },
  ]

  return (
    <Layout title="Chat Messenger">
      <div className="chat-layout">
        {/* Rooms list */}
        <div className="chat-rooms-list">
          <div className="chat-rooms-header">
            <div style={{ fontFamily:'var(--font-display)', fontSize:'14px', fontWeight:700, color:'var(--t1)', marginBottom:'8px' }}>Messages</div>
            <div className="input-wrap">
              <span className="input-icon">🔍</span>
              <input className="input" placeholder="Search rooms..." style={{ fontSize:'12px', padding:'7px 12px 7px 32px' }}/>
            </div>
          </div>

          <div className="chat-rooms-scroll">
            {SECTION_TYPES.map(st=>{
              const roomsInSection = ROOMS.filter(r=>r.type===st.key)
              if (!roomsInSection.length) return null
              return (
                <div key={st.key}>
                  <div style={{ fontSize:'9px', fontWeight:800, letterSpacing:'0.14em', color:'var(--t3)', textTransform:'uppercase', padding:'10px 8px 4px' }}>{st.label}</div>
                  {roomsInSection.map(r=>(
                    <div key={r.id} className={`chat-room-item ${activeRoom===r.id?'active':''}`} onClick={()=>setActiveRoom(r.id)} style={{ background:activeRoom===r.id?`${r.color}12`:'' }}>
                      <div className="chat-room-av" style={{ background:`${r.color}18`, border:`1px solid ${r.color}33` }}>
                        {r.icon}
                        {r.college && <span style={{ position:'absolute', bottom:-2, right:-2, fontSize:'7px', fontWeight:800, background:r.color, color:'#fff', borderRadius:'3px', padding:'0 2px' }}>{r.college}</span>}
                        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%' }}>
                          <span style={{ fontSize:'16px' }}>{r.icon}</span>
                          {r.college && <div style={{ position:'absolute', bottom:'-4px', right:'-6px', fontSize:'7px', fontWeight:800, background:r.color, color:'#fff', borderRadius:'3px', padding:'0 3px', lineHeight:'11px' }}>{r.college}</div>}
                        </div>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div className="chat-room-name" style={{ color:activeRoom===r.id?r.color:'var(--t1)' }}>{r.name}</div>
                          {r.unread>0 && <div className="chat-room-unread" style={{ background:r.color }}>{r.unread}</div>}
                        </div>
                        <div className="chat-room-preview">{r.preview}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Message Area */}
        <div className="chat-area">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-room-av" style={{ background:`${room?.color}18`, border:`1px solid ${room?.color}33`, width:'36px', height:'36px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0, position:'relative' }}>
              {room?.icon}
              {room?.college && <div style={{ position:'absolute', bottom:'-3px', right:'-5px', fontSize:'7px', fontWeight:800, background:room.color, color:'#fff', borderRadius:'3px', padding:'0 3px', lineHeight:'12px' }}>{room.college}</div>}
            </div>
            <div>
              <div style={{ fontSize:'14px', fontWeight:700, color:'var(--t1)' }}>{room?.name}</div>
              <div style={{ fontSize:'11px', color:'var(--t3)' }}>
                {room?.type==='direct' ? (room?.college ? `${room.college} College` : 'Direct Message') : `${ROOM_TYPE_LABEL[room?.type]} · ${room?.members?.toLocaleString()} members`}
              </div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'8px' }}>
              <button className="topbar-icon-btn" title="Search">🔍</button>
              <button className="topbar-icon-btn" title="Members">👥</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {grouped.map((m, i) => {
              const isFirst = i===0 || grouped[i-1].senderId !== m.senderId
              const isLast  = i===grouped.length-1 || grouped[i+1].senderId !== m.senderId
              return (
                <div key={m.id} className={`msg-row ${m.mine?'mine':''}`} style={{ alignItems: isFirst?'flex-start':'flex-end' }}>
                  {/* Avatar */}
                  {!m.mine && (
                    <div className={`msg-av ${!isLast?'hidden':''}`} style={{ background:m.color+'22', border:`1px solid ${m.color}44`, color:m.color, fontSize:'10px', fontWeight:800, flexShrink:0, position:'relative' }}>
                      {m.sender.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      {m.college && <div style={{ position:'absolute', bottom:'-3px', right:'-3px', fontSize:'6px', fontWeight:800, background:m.color, color:'#fff', borderRadius:'2px', padding:'0 2px', lineHeight:'10px' }}>{m.college}</div>}
                    </div>
                  )}

                  <div style={{ maxWidth:'65%' }}>
                    {/* Sender name (only first in group, only for others) */}
                    {!m.mine && isFirst && (
                      <div className="msg-sender" style={{ paddingLeft:'2px', color:m.color }}>
                        {m.sender}
                        {m.college && <span className="msg-college-badge" style={{ background:m.color+'22', color:m.color, border:`1px solid ${m.color}40` }}>{m.college}</span>}
                      </div>
                    )}
                    <div className={`msg-bubble ${m.mine?'mine':'theirs'}`} style={{
                      borderRadius: m.mine
                        ? `14px 14px ${isLast?'4px':'14px'} 14px`
                        : `14px 14px 14px ${isLast?'4px':'14px'}`,
                      background: m.mine ? `linear-gradient(135deg, ${user?.collegeColor||'#5b6ef5'}, ${user?.collegeColor||'#5b6ef5'}cc)` : undefined
                    }}>
                      {m.content}
                      {isLast && <div className="msg-time">{m.time}</div>}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <button className="topbar-icon-btn" style={{ flexShrink:0 }}>📎</button>
            <input
              className="chat-input"
              placeholder={`Message ${room?.name}...`}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())}
            />
            <button className="topbar-icon-btn" style={{ flexShrink:0 }}>😊</button>
            <button className="send-btn" onClick={send} style={{ background:`linear-gradient(135deg,${user?.collegeColor||'#5b6ef5'},${user?.collegeColor||'#5b6ef5'}aa)` }}>➤</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
