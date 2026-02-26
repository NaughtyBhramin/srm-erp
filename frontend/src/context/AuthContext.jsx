import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('srm_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('srm_token') || null)

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { access_token, user: userData } = res.data
    setToken(access_token)
    setUser(userData)
    localStorage.setItem('srm_token', access_token)
    localStorage.setItem('srm_user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return userData
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('srm_token')
    localStorage.removeItem('srm_user')
    delete api.defaults.headers.common['Authorization']
  }, [])

  // Set token on initial load
  if (token && !api.defaults.headers.common['Authorization']) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
