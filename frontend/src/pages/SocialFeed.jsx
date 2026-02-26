import { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, Flame, Image, Plus, Send, Award, Bell, TrendingUp } from 'lucide-react'

const USERS = [
  { id: 1, name: 'Rahul Sharma', role: 'CSE · Year 3', avatar: 'R', streak: 12, color: '#6378ff' },
  { id: 2, name: 'Kavya Reddy', role: 'ECE · Year 2', avatar: 'K', streak: 28, color: '#f5a623' },
  { id: 3, name: 'Dr. Priya Nair', role: 'Faculty · CSE', avatar: 'P', streak: 45, color: '#00e5a0' },
  { id: 4, name: 'Arun Patel', role: 'MECH · Year 4', avatar: 'A', streak: 7, color: '#a855f7' },
  { id: 5, name: 'Sneha Kumar', role: 'CSE · Year 3', avatar: 'S', streak: 19, color: '#ff4d6d' },
]

const INIT_POSTS = [
  { id: 1, user: USERS[2], time: '10 min ago', content: '📢 Important: CSE Lab 4 will be under maintenance tomorrow. All practicals rescheduled to Lab 2. Please check your updated timetable on the portal.', likes: 47, comments: 12, liked: false, bookmarked: false, tag: 'Announcement', tagColor: '#6378ff' },
  { id: 2, user: USERS[0], time: '32 min ago', content: '🏆 Just cracked the SRM Hackathon! Team TechNova secured 1st place with our AI-powered campus safety system. Grateful to our mentors Dr. Priya Nair and the entire CSE dept! 🚀 #SRMHackathon2024', likes: 312, comments: 56, liked: true, bookmarked: false, tag: 'Achievement', tagColor: '#f5a623' },
  { id: 3, user: USERS[1], time: '1 hr ago', content: '📚 Study group for DSA finals forming up! Meeting this Saturday 3PM at the Central Library, 2nd floor. DM me to join. Covering Trees, Graphs & Dynamic Programming. Open to all years! 💻', likes: 89, comments: 23, liked: false, bookmarked: true, tag: 'Study', tagColor: '#00e5a0' },
  { id: 4, user: USERS[3], time: '2 hrs ago', content: '🔔 WHISTLEBLOWER: The canteen near Block-C has been charging ₹5 extra on the menu price for almost a month now. I\'ve reported this to the admin office. Anyone else facing this? Let\'s track together 👀', likes: 234, comments: 67, liked: false, bookmarked: false, tag: 'Whistleblower', tagColor: '#ff4d6d' },
  { id: 5, user: USERS[4], time: '3 hrs ago', content: '✨ The new rooftop garden near the Admin block is finally open! Great spot to study and chill between classes. Highly recommend 🌿☕', likes: 156, comments: 31, liked: false, bookmarked: false, tag: 'Campus Life', tagColor: '#22d3ee' },
]

function StreakBadge({ streak }) {
  const hot = streak >= 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '700', color: hot ? '#f5a623' : 'var(--text-3)' }}>
      <Flame size={12} style={{ color: hot ? '#f5a623' : 'var(--text-3)' }} />{streak}d
    </div>
  )
}

function PostCard({ post: p, onLike, onBookmark }) {
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')

  return (
    <div className="post-card fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ position: 'relative' }}>
          <div className="streak-ring" style={{ padding: '2px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.user.color}, ${p.user.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', color: 'white' }}>{p.user.avatar}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-1)' }}>{p.user.name}</span>
            <StreakBadge streak={p.user.streak} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{p.user.role} · {p.time}</div>
        </div>
        <span className="badge" style={{ background: `${p.tagColor}15`, color: p.tagColor, border: `1px solid ${p.tagColor}30`, fontSize: '10px' }}>{p.tag}</span>
      </div>

      {/* Content */}
      <p style={{ fontSize: '14px', color: 'var(--text-1)', lineHeight: '1.65', marginBottom: '16px' }}>{p.content}</p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <button className={`reaction-btn ${p.liked ? 'liked' : ''}`} onClick={() => onLike(p.id)}>
          <Heart size={14} fill={p.liked ? 'currentColor' : 'none'} /> {p.likes}
        </button>
        <button className="reaction-btn" onClick={() => setShowComment(!showComment)}>
          <MessageCircle size={14} /> {p.comments}
        </button>
        <button className="reaction-btn"><Share2 size={14} /> Share</button>
        <button className={`reaction-btn`} style={{ marginLeft: 'auto', color: p.bookmarked ? 'var(--primary)' : undefined }} onClick={() => onBookmark(p.id)}>
          <Bookmark size={14} fill={p.bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {showComment && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <input className="input" placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} style={{ fontSize: '13px' }} />
          <button className="btn btn-primary btn-sm" onClick={() => setComment('')}><Send size={13} /></button>
        </div>
      )}
    </div>
  )
}

export default function SocialFeed() {
  const [posts, setPosts] = useState(INIT_POSTS)
  const [newPost, setNewPost] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [postType, setPostType] = useState('post')

  const onLike = (id) => setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  const onBookmark = (id) => setPosts(posts.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))

  const submitPost = () => {
    if (!newPost.trim()) return
    const tags = { post: { tag: 'Campus Life', color: '#22d3ee' }, announcement: { tag: 'Announcement', color: '#6378ff' }, whistleblower: { tag: 'Whistleblower', color: '#ff4d6d' }, achievement: { tag: 'Achievement', color: '#f5a623' } }
    const t = tags[postType]
    setPosts([{ id: Date.now(), user: USERS[0], time: 'Just now', content: newPost, likes: 0, comments: 0, liked: false, bookmarked: false, tag: t.tag, tagColor: t.color }, ...posts])
    setNewPost('')
  }

  const tabs = ['all', 'announcements', 'whistleblower', 'achievements']
  const filtered = activeTab === 'all' ? posts : posts.filter(p => p.tag.toLowerCase().includes(activeTab.slice(0, 5)))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Compose */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['post', 'announcement', 'whistleblower', 'achievement'].map(t => (
              <button key={t} onClick={() => setPostType(t)}
                className="btn btn-sm" style={{ textTransform: 'capitalize', fontSize: '11px',
                  background: postType === t ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: postType === t ? 'white' : 'var(--text-2)', border: '1px solid var(--border)' }}>
                {t === 'whistleblower' ? '🔔 Whistle' : t}
              </button>
            ))}
          </div>
          <textarea
            className="input" placeholder={postType === 'whistleblower' ? '🔔 Report an issue anonymously...' : "What's on your mind?"}
            value={newPost} onChange={e => setNewPost(e.target.value)}
            style={{ resize: 'none', height: '80px', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm"><Image size={14} /> Photo</button>
            <button className="btn btn-primary btn-sm" onClick={submitPost}><Send size={13} /> Post</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className="btn btn-sm"
              style={{ textTransform: 'capitalize', background: activeTab === t ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: activeTab === t ? 'white' : 'var(--text-2)', border: '1px solid var(--border)', fontSize: '12px' }}>
              {t}
            </button>
          ))}
        </div>

        {filtered.map(p => <PostCard key={p.id} post={p} onLike={onLike} onBookmark={onBookmark} />)}
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Streak leaderboard */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: '700', color: 'var(--text-1)' }}>
            <Flame size={16} style={{ color: 'var(--gold)' }} /> Streak Leaders
          </div>
          {[...USERS].sort((a,b) => b.streak - a.streak).map((u, i) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <span className="mono" style={{ fontSize: '13px', color: 'var(--text-3)', width: '18px' }}>#{i+1}</span>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{u.role.split(' ')[0]}</div>
              </div>
              <StreakBadge streak={u.streak} />
            </div>
          ))}
        </div>

        {/* Trending */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: '700', color: 'var(--text-1)' }}>
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} /> Trending
          </div>
          {['#SRMHackathon2024', '#FinalsPrepration', '#CanteenIssue', '#CampusLife', '#TPCell'].map((tag, i) => (
            <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{tag}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{[312, 234, 189, 145, 98][i]} posts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
