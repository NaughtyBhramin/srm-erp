import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ParkingDashboard from './pages/ParkingDashboard'
import VehicleManagement from './pages/VehicleManagement'
import ParkingZones from './pages/ParkingZones'
import ParkingPermits from './pages/ParkingPermits'
import ParkingViolations from './pages/ParkingViolations'
import StudentManagement from './pages/StudentManagement'
import Analytics from './pages/Analytics'
import SocialFeed from './pages/SocialFeed'
import StudyMaterials from './pages/StudyMaterials'
import Transport from './pages/Transport'
import MeetingRooms from './pages/MeetingRooms'
import Accounts from './pages/Accounts'

function Guard({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Guard><Layout /></Guard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="social" element={<SocialFeed />} />
            <Route path="study" element={<StudyMaterials />} />
            <Route path="transport" element={<Transport />} />
            <Route path="rooms" element={<MeetingRooms />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="parking" element={<ParkingDashboard />} />
            <Route path="parking/vehicles" element={<VehicleManagement />} />
            <Route path="parking/zones" element={<ParkingZones />} />
            <Route path="parking/permits" element={<ParkingPermits />} />
            <Route path="parking/violations" element={<ParkingViolations />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
