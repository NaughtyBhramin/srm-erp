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

export const DEMO_USERS = {
  admin:     { id:'u1', name:'Dr. V. Rajkumar',      role:'admin',     dept:'Administration', college:null, collegeCode:null, collegeColor:null },
  student:   { id:'u2', name:'Rahul Sharma',          role:'student',   dept:'CSE', reg:'RA2111003010001', year:3, cgpa:8.72, streak:14, college:'Kalam College', collegeCode:'KC', collegeColor:'#5b6ef5', hostelRoom:'B-204', messPlan:'Full Board', isHosteller:true },
  faculty:   { id:'u3', name:'Dr. Priya Nair',        role:'faculty',   dept:'CSE', empId:'EMP-CSE-001', designation:'Assoc. Professor', college:'Tagore College', collegeCode:'TC', collegeColor:'#00c896' },
  accounts:  { id:'u4', name:'Kavitha Subramanian',   role:'accounts',  dept:'Finance', college:null, collegeCode:null, collegeColor:null },
  security:  { id:'u5', name:'Ram Kumar',              role:'security',  dept:'Security', college:null, collegeCode:null, collegeColor:null },
  transport: { id:'u6', name:'Suresh Pandian',         role:'transport', dept:'Transport', college:null, collegeCode:null, collegeColor:null },
  medical:   { id:'u7', name:'Dr. Anitha Krishnan',   role:'medical',   dept:'Medical', college:null, collegeCode:null, collegeColor:null },
  parent:    { id:'u8', name:'Mr. S. Krishnaswamy',   role:'parent',    college:'Kalam College', collegeCode:'KC', collegeColor:'#5b6ef5', childName:'Rahul Sharma', childReg:'RA2111003010001', childYear:3, childCGPA:8.72 },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    try { const s = localStorage.getItem('srm_v2_user'); if(s) setUser(JSON.parse(s)) } catch{}
  },[])
  const login  = (role) => { const u = DEMO_USERS[role]; localStorage.setItem('srm_v2_user', JSON.stringify(u)); setUser(u) }
  const logout = () => { localStorage.removeItem('srm_v2_user'); setUser(null) }
  return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
}
