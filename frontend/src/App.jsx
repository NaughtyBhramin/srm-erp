import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage     from './pages/LoginPage'
import Dashboard     from './pages/Dashboard'
import SocialFeed    from './pages/SocialFeed'
import ChatMessenger from './pages/ChatMessenger'
import StudyMaterials from './pages/StudyMaterials'
import Transport     from './pages/Transport'
import Accounts      from './pages/Accounts'
import Analytics     from './pages/Analytics'
import ParkingDashboard from './pages/ParkingDashboard'
import VehicleManagement from './pages/VehicleManagement'
import ParkingZones  from './pages/ParkingZones'
import ParkingPermits from './pages/ParkingPermits'
import ParkingViolations from './pages/ParkingViolations'
import StudentManagement from './pages/StudentManagement'

function Guard({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<LoginPage/>}/>
          <Route path="/dashboard" element={<Guard><Dashboard/></Guard>}/>
          <Route path="/social"    element={<Guard><SocialFeed/></Guard>}/>
          <Route path="/chat"      element={<Guard><ChatMessenger/></Guard>}/>
          <Route path="/study"     element={<Guard><StudyMaterials/></Guard>}/>
          <Route path="/transport" element={<Guard><Transport/></Guard>}/>
          <Route path="/accounts"  element={<Guard><Accounts/></Guard>}/>
          <Route path="/analytics" element={<Guard><Analytics/></Guard>}/>
          <Route path="/parking"   element={<Guard><ParkingDashboard/></Guard>}/>
          <Route path="/vehicles"  element={<Guard><VehicleManagement/></Guard>}/>
          <Route path="/violations"element={<Guard><ParkingViolations/></Guard>}/>
          <Route path="/students"  element={<Guard><StudentManagement/></Guard>}/>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
