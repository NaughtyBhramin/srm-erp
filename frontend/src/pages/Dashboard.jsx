import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import AdminDash    from './dashboards/AdminDash'
import StudentDash  from './dashboards/StudentDash'
import FacultyDash  from './dashboards/FacultyDash'
import AccountsDash from './dashboards/AccountsDash'
import SecurityDash from './dashboards/SecurityDash'
import TransportDash from './dashboards/TransportDash'
import MedicalDash  from './dashboards/MedicalDash'
import ParentDash   from './dashboards/ParentDash'

const DASH_MAP = {
  admin:     <AdminDash/>,
  student:   <StudentDash/>,
  faculty:   <FacultyDash/>,
  accounts:  <AccountsDash/>,
  security:  <SecurityDash/>,
  transport: <TransportDash/>,
  medical:   <MedicalDash/>,
  parent:    <ParentDash/>,
}

const TITLES = {
  admin:'System Overview', student:'My Campus', faculty:'Faculty Portal',
  accounts:'Finance & Accounts', security:'Security Operations',
  transport:'Transport Control', medical:'Medical Centre', parent:'Parent Portal',
}

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Layout title={TITLES[user.role] || 'Dashboard'}>
      {DASH_MAP[user.role] || <div style={{color:'var(--t2)',padding:'40px',textAlign:'center'}}>Dashboard for {user.role}</div>}
    </Layout>
  )
}
