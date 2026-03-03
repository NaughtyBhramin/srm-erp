import { createContext, useContext, useState, useEffect } from 'react'
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export const ROLE_META = {
  admin:     { label:'Administrator',      color:'#ff6b35', icon:'⬡', bg:'rgba(255,107,53,0.12)'  },
  student:   { label:'Student',            color:'#5b6ef5', icon:'◈', bg:'rgba(91,110,245,0.12)'  },
  faculty:   { label:'Faculty',            color:'#00c896', icon:'◆', bg:'rgba(0,200,150,0.12)'   },
  accounts:  { label:'Accounts Officer',   color:'#e8b400', icon:'◉', bg:'rgba(232,180,0,0.12)'   },
  security:  { label:'Security Officer',   color:'#ef4444', icon:'⬟', bg:'rgba(239,68,68,0.12)'   },
  transport: { label:'Transport Officer',  color:'#14b8e0', icon:'⬡', bg:'rgba(20,184,224,0.12)'  },
  medical:   { label:'Medical Officer',    color:'#e879c0', icon:'✦', bg:'rgba(232,121,192,0.12)' },
  parent:    { label:'Parent / Guardian',  color:'#9b87f5', icon:'◇', bg:'rgba(155,135,245,0.12)' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    try {
      const s = localStorage.getItem('srm_v2_user')
      if (s) setUser(JSON.parse(s))
    } catch {}
  }, [])

  // Called after successful login (from LoginPage)
  const loginWithToken = (authResult) => {
    const u = authResult.user
    localStorage.setItem('srm_v2_user', JSON.stringify(u))
    setUser(u)
  }

  // Legacy demo quick-login (kept for backwards compat)
  const login = (role) => {
    const DEMO = {
      admin:     { id:'u1', name:'Dr. V. Rajkumar',      role:'admin',     dept:'Administration',  college_code:null, college_name:null,        college_color:null     },
      student:   { id:'u2', name:'Rahul Sharma',          role:'student',   dept:'CSE',             college_code:'KC', college_name:'Kalam College',    college_color:'#5b6ef5' },
      faculty:   { id:'u3', name:'Dr. Priya Nair',        role:'faculty',   dept:'CSE',             college_code:'TC', college_name:'Tagore College',   college_color:'#00c896' },
      accounts:  { id:'u4', name:'Kavitha Subramanian',   role:'accounts',  dept:'Finance',         college_code:null, college_name:null,        college_color:null     },
      security:  { id:'u5', name:'Ram Kumar',              role:'security',  dept:'Security',        college_code:null, college_name:null,        college_color:null     },
      transport: { id:'u6', name:'Suresh Pandian',         role:'transport', dept:'Transport',       college_code:null, college_name:null,        college_color:null     },
      medical:   { id:'u7', name:'Dr. Anitha Krishnan',   role:'medical',   dept:'Medical',         college_code:null, college_name:null,        college_color:null     },
      parent:    { id:'u8', name:'Mr. S. Krishnaswamy',   role:'parent',    dept:null,              college_code:'KC', college_name:'Kalam College',    college_color:'#5b6ef5' },
    }
    const u = DEMO[role]
    if (!u) return
    localStorage.setItem('srm_v2_user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('srm_v2_user')
    localStorage.removeItem('srm_access_token')
    localStorage.removeItem('srm_refresh_token')
    localStorage.removeItem('srm_session_id')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
