import { useState } from 'react'
import Layout from '../components/Layout'

const COLLEGES = [
  { code:'VC', name:'Vivekananda', color:'#ff6b35' },
  { code:'KC', name:'Kalam',       color:'#5b6ef5' },
  { code:'TC', name:'Tagore',      color:'#00c896' },
  { code:'BC', name:'Bose',        color:'#e8b400' },
]
const POST_TYPES = ['all','post','announcement','achievement','whistleblower','event','study']
const TYPE_META = {
  post:          { icon:'💬', color:'#7b8ab8', label:'Post' },
  announcement:  { icon:'📢', color:'#00c896', label:'Announcement' },
  achievement:   { icon:'🏆', color:'#e8b400', label:'Achievement' },
  whistleblower: { icon:'🔔', color:'#ef4444', label:'Whistleblower' },
  event:         { icon:'🎉', color:'#e879c0', label:'Event' },
  study:         { icon:'📚', color:'#5b6ef5', label:'Study' },
}
const INIT_POSTS = [
  { id:1, author:'Arjun Menon',   role:'Student',   college:'KC', color:'#5b6ef5', type:'study',         content:'🧵 Just uploaded a comprehensive CN Unit 3 mind map covering Dijkstra, Bellman-Ford, and Floyd-Warshall. Check the Study Hub! Took me 3 days to compile this — hope it helps for the end-sem. Tag anyone who might need it! #ComputerNetworks #CSE',                  likes:42, comments:8, time:'1h',  liked:false, saved:false },
  { id:2, author:'Tanvi Sharma',  role:'Faculty',   college:'TC', color:'#00c896', type:'announcement',  content:'📢 Important: CS6002 Machine Learning end-semester project submission deadline extended to March 20th. All groups must submit the GitHub repo link + 10-page report. No further extensions will be granted. Contact your batch representative for any queries.',         likes:118, comments:23, time:'2h', liked:false, saved:false },
  { id:3, author:'Anonymous',     role:null,        college:'VC', color:'#ff6b35', type:'whistleblower',  content:'🔔 The canteen in Block C has been charging ₹60 for meals that are listed as ₹45 on the official menu board. This has been happening for 3 weeks. Photos attached. Administration please look into this — we\'re already paying high mess fees.',               likes:203, comments:47, time:'3h', liked:false, saved:false },
  { id:4, author:'Keerthana V.',  role:'Student',   college:'BC', color:'#e8b400', type:'achievement',   content:'🏆 Beyond proud! Our team (Bose College, CSE-B) just won 1st place at the Hackathon organized by the CS Dept! 36 hours, zero sleep, 3 Red Bulls and a lot of debugging later — we built a real-time campus parking optimizer. Huge thanks to Dr. Rajkumar for mentoring us! 🎉',  likes:347, comments:62, time:'5h', liked:false, saved:false },
  { id:5, author:'Ravi Prakash',  role:'Student',   college:'KC', color:'#5b6ef5', type:'event',         content:'🎉 Inter-College Cultural Night is happening THIS Friday at 7 PM in the Open Air Theatre! All 4 colleges performing. Kalam College is presenting a fusion dance — "Roots & Routes". Free entry for all SRM students. Come support! Passes at the common room.',          likes:89, comments:15, time:'6h',  liked:false, saved:false },
  { id:6, author:'Dr. S. Raman',  role:'Faculty',   college:'TC', color:'#00c896', type:'post',          content:'Interesting paper out of MIT on transformer architectures for code generation. The efficiency gains over GPT-4 are substantial — roughly 40% faster inference with comparable quality. If anyone is working on their final year project in NLP/ML, this is worth reading. Sharing the link in the Study Hub.',  likes:56, comments:9, time:'8h',  liked:false, saved:false },
  { id:7, author:'Priya Nair',    role:'Student',   college:'VC', color:'#ff6b35', type:'study',         content:'📚 Anyone have good resources for OS Unit 5 — Memory Management? Specifically paging vs segmentation trade-offs. Our end-sem is in 3 weeks and I\'m struggling with the numericals. #OS #Help',  likes:28, comments:14, time:'10h', liked:false, saved:false },
]
const STREAKS = [
  { name:'Keerthana V.', college:'BC', color:'#e8b400', streak:21, posts:47, rank:1 },
  { name:'Arjun Menon',  college:'KC', color:'#5b6ef5', streak:14, posts:38, rank:2 },
  { name:'Tanvi Sharma', college:'TC', color:'#00c896', streak:12, posts:29, rank:3 },
  { name:'Ravi Prakash', college:'KC', color:'#5b6ef5', streak:9,  posts:22, rank:4 },
  { name:'Priya Nair',   college:'VC', color:'#ff6b35', streak:7,  posts:18, rank:5 },
]
const COLLEGE_ACTIVITY = [
  { code:'VC', name:'Vivekananda', color:'#ff6b35', posts:234, pct:88 },
  { code:'KC', name:'Kalam',       color:'#5b6ef5', posts:201, pct:75 },
  { code:'TC', name:'Tagore',      color:'#00c896', posts:178, pct:67 },
  { code:'BC', name:'Bose',        color:'#e8b400', posts:156, pct:58 },
]

export default function SocialFeed() {
  const [posts, setPosts]         = useState(INIT_POSTS)
  const [activeCollege, setAC]    = useState('all')
  const [activeType, setAT]       = useState('all')
  const [showCompose, setCompose] = useState(false)
  const [draft, setDraft]         = useState({ content:'', type:'post', anonymous:false })

  const filtered = posts.filter(p =>
    (activeCollege==='all' || p.college===activeCollege) &&
    (activeType==='all'    || p.type===activeType)
  )

  const toggleLike = (id) => setPosts(prev=>prev.map(p=>p.id===id?{...p, liked:!p.liked, likes:p.likes+(p.liked?-1:1)}:p))
  const toggleSave = (id) => setPosts(prev=>prev.map(p=>p.id===id?{...p, saved:!p.saved}:p))

  const submitPost = () => {
    if (!draft.content.trim()) return
    const newPost = {
      id: Date.now(), author:draft.anonymous?'Anonymous':'You', role:'Student',
      college:'KC', color:'#5b6ef5', type:draft.type,
      content:draft.content, likes:0, comments:0, time:'now', liked:false, saved:false
    }
    setPosts([newPost, ...posts])
    setDraft({ content:'', type:'post', anonymous:false })
    setCompose(false)
  }

  return (
    <Layout title="College Social Feed">
      <div className="feed-col-layout">

        {/* ── LEFT SIDEBAR ── */}
        <div className="feed-sidebar">
          {/* Filter by College */}
          <div className="card card-p" style={{ marginBottom:'14px' }}>
            <div className="card-title" style={{ marginBottom:'12px' }}>🏛 Filter by College</div>
            <div onClick={()=>setAC('all')} style={{ padding:'8px 12px', borderRadius:'9px', marginBottom:'6px', cursor:'pointer', background:activeCollege==='all'?'var(--glass)':'transparent', border:activeCollege==='all'?'1px solid var(--border2)':'1px solid transparent', color:activeCollege==='all'?'var(--t1)':'var(--t3)', fontSize:'13px', fontWeight:activeCollege==='all'?700:400 }}>
              All Colleges
            </div>
            {COLLEGES.map(c=>(
              <div key={c.code} onClick={()=>setAC(activeCollege===c.code?'all':c.code)} style={{
                display:'flex', alignItems:'center', gap:'9px', padding:'9px 12px',
                borderRadius:'9px', marginBottom:'4px', cursor:'pointer',
                background:activeCollege===c.code?`${c.color}14`:'transparent',
                border:activeCollege===c.code?`1px solid ${c.color}40`:'1px solid transparent',
                transition:'all 0.15s'
              }}>
                <div style={{ width:'9px', height:'9px', borderRadius:'3px', background:c.color, flexShrink:0 }}/>
                <span style={{ fontSize:'13px', fontWeight:activeCollege===c.code?700:500, color:activeCollege===c.code?c.color:'var(--t2)' }}>{c.name}</span>
                <span style={{ marginLeft:'auto', fontSize:'10px', color:'var(--t3)' }}>{COLLEGE_ACTIVITY.find(a=>a.code===c.code)?.posts}</span>
              </div>
            ))}
          </div>

          {/* Post type filter */}
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'12px' }}>🏷 Post Type</div>
            {POST_TYPES.map(pt=>{
              const meta = pt==='all'?{icon:'◈',color:'var(--t2)',label:'All Posts'}:TYPE_META[pt]
              return (
                <div key={pt} onClick={()=>setAT(pt)} style={{
                  display:'flex', alignItems:'center', gap:'9px', padding:'8px 10px',
                  borderRadius:'9px', marginBottom:'4px', cursor:'pointer',
                  background:activeType===pt?`${meta.color}14`:'transparent',
                  transition:'all 0.15s'
                }}>
                  <span style={{ fontSize:'14px' }}>{meta.icon}</span>
                  <span style={{ fontSize:'12.5px', fontWeight:activeType===pt?700:400, color:activeType===pt?meta.color:'var(--t2)' }}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CENTER FEED ── */}
        <div className="feed-main">
          {/* Compose button */}
          {!showCompose ? (
            <div className="card card-p" style={{ marginBottom:'14px', cursor:'text' }} onClick={()=>setCompose(true)}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(91,110,245,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:800, color:'#5b6ef5', border:'1px solid rgba(91,110,245,0.4)' }}>KC</div>
                <div style={{ flex:1, padding:'9px 14px', borderRadius:'20px', background:'var(--bg3)', border:'1px solid var(--border2)', fontSize:'13px', color:'var(--t3)' }}>Share something with your college...</div>
                <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();setCompose(true)}}>Post</button>
              </div>
            </div>
          ) : (
            <div className="card card-p" style={{ marginBottom:'14px' }}>
              {/* Type picker */}
              <div style={{ display:'flex', gap:'6px', marginBottom:'12px', flexWrap:'wrap' }}>
                {Object.entries(TYPE_META).map(([k,v])=>(
                  <button key={k} onClick={()=>setDraft(d=>({...d,type:k}))} style={{
                    padding:'4px 10px', borderRadius:'20px', border:'none', cursor:'pointer',
                    fontSize:'11px', fontWeight:700,
                    background:draft.type===k?v.color:v.color+'18',
                    color:draft.type===k?'#fff':v.color
                  }}>{v.icon} {v.label}</button>
                ))}
              </div>
              <textarea
                autoFocus
                placeholder={`Share a ${draft.type}...`}
                value={draft.content}
                onChange={e=>setDraft(d=>({...d,content:e.target.value}))}
                style={{ width:'100%', minHeight:'100px', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'10px', padding:'12px', color:'var(--t1)', fontFamily:'var(--font-body)', fontSize:'13.5px', outline:'none', resize:'vertical', lineHeight:1.6 }}
              />
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'10px' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12.5px', color:'var(--t2)', cursor:'pointer' }}>
                  <input type="checkbox" checked={draft.anonymous} onChange={e=>setDraft(d=>({...d,anonymous:e.target.checked}))} style={{ accentColor:'var(--student)' }}/>
                  Post anonymously
                </label>
                <div style={{ marginLeft:'auto', display:'flex', gap:'8px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setCompose(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={submitPost} disabled={!draft.content.trim()}>Post</button>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {filtered.map((p, pi) => {
            const tm = TYPE_META[p.type]
            return (
              <div key={p.id} className="post-card" style={{ animationDelay:`${pi*0.04}s`, animation:'fadeUp 0.35s ease both' }}>
                <div className="post-college-bar" style={{ background:p.color }}/>
                <div className="post-body">
                  {/* Author row */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                    <div className="post-avatar-wrap">
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${p.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:800, color:p.color, border:`1.5px solid ${p.color}55` }}>
                        {p.author==='Anonymous'?'?':p.author.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div className="post-college-badge" style={{ background:p.color }}>{p.college}</div>
                    </div>
                    <div>
                      <div className="post-author">{p.author}</div>
                      <div className="post-role" style={{ color:p.color+'aa' }}>{p.role || 'Anonymous'} · {p.college}</div>
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:'11px', color:'var(--t3)' }}>{p.time}</span>
                  </div>
                  {/* Type pill */}
                  <div className="post-type-pill" style={{ background:`${tm.color}15`, color:tm.color, border:`1px solid ${tm.color}30` }}>
                    {tm.icon} {tm.label}
                  </div>
                  {/* Content */}
                  <p className="post-content">{p.content}</p>
                  {/* Actions */}
                  <div className="post-actions">
                    <button className={`reaction-btn ${p.liked?'liked':''}`} onClick={()=>toggleLike(p.id)}>
                      {p.liked?'❤️':'🤍'} {p.likes}
                    </button>
                    <button className="reaction-btn">💬 {p.comments}</button>
                    <button className="reaction-btn">↗ Share</button>
                    <button className={`reaction-btn`} style={{ marginLeft:'auto', color:p.saved?'var(--accounts)':'var(--t3)' }} onClick={()=>toggleSave(p.id)}>
                      {p.saved?'🔖':'🏷'} {p.saved?'Saved':'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length===0 && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--t3)' }}>
              <div style={{ fontSize:'36px', marginBottom:'12px' }}>🔍</div>
              <div style={{ fontSize:'14px' }}>No posts match this filter</div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="feed-right">
          {/* Streak leaderboard */}
          <div className="card card-p" style={{ marginBottom:'14px' }}>
            <div className="card-title" style={{ marginBottom:'12px' }}>🔥 Streak Leaderboard</div>
            {STREAKS.map((s,i)=>(
              <div key={i} className="streak-item">
                <div className="streak-rank">#{s.rank}</div>
                <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:800, color:s.color, border:`1px solid ${s.color}44`, flexShrink:0 }}>{s.college}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize:'10px', color:'var(--t3)' }}>{s.posts} posts total</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div className="streak-fire">🔥</div>
                  <div className="streak-count" style={{ color:s.color }}>{s.streak}</div>
                </div>
              </div>
            ))}
          </div>

          {/* College Activity bars */}
          <div className="card card-p">
            <div className="card-title" style={{ marginBottom:'12px' }}>📊 College Activity (This Week)</div>
            {COLLEGE_ACTIVITY.map(c=>(
              <div key={c.code} style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'2px', background:c.color }}/>
                    <span style={{ fontSize:'12px', fontWeight:600, color:'var(--t2)' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize:'11px', color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{c.posts}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${c.pct}%`, background:c.color }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Trending tags */}
          <div className="card card-p" style={{ marginTop:'14px' }}>
            <div className="card-title" style={{ marginBottom:'12px' }}>🔥 Trending</div>
            {['#EndSemPrep','#SRMHackathon','#CanteenIssue','#MLProject','#FYP2025','#InterCollege'].map((t,i)=>(
              <div key={i} style={{ padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--student)', cursor:'pointer' }}>
                {t} <span style={{ float:'right', fontSize:'10px', color:'var(--t3)' }}>{Math.floor(20+Math.random()*60)} posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
