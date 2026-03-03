/**
 * SRM ERP Auth Service
 * Handles login, MFA verification, token refresh, logout
 */

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TOKEN_KEY   = 'srm_access_token'
const REFRESH_KEY = 'srm_refresh_token'
const SESSION_KEY = 'srm_session_id'
const USER_KEY    = 'srm_user'

export const authService = {
  // ── Token management ──
  getToken:   () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getSession: () => localStorage.getItem(SESSION_KEY),
  getUser:    () => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },

  saveSession(data) {
    localStorage.setItem(TOKEN_KEY,   data.access_token)
    localStorage.setItem(REFRESH_KEY, data.refresh_token)
    localStorage.setItem(SESSION_KEY, data.session_id)
    localStorage.setItem(USER_KEY,    JSON.stringify(data.user))
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch { return false }
  },

  getTokenPayload() {
    const token = this.getToken()
    if (!token) return null
    try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
  },

  // ── API calls ──
  async login(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, device_info: navigator.userAgent })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Login failed')
    return data  // { status: 'success'|'mfa_required', ... }
  },

  async verifyMFA(tempToken, totpCode) {
    const res = await fetch(`${API}/api/auth/mfa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temp_token: tempToken, totp_code: totpCode })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'MFA verification failed')
    return data
  },

  async refreshToken() {
    const refresh = this.getRefresh()
    if (!refresh) throw new Error('No refresh token')
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    })
    const data = await res.json()
    if (!res.ok) { this.clearSession(); throw new Error('Session expired') }
    localStorage.setItem(TOKEN_KEY, data.access_token)
    return data.access_token
  },

  async logout() {
    const token   = this.getToken()
    const session = this.getSession()
    const refresh = this.getRefresh()
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ session_id: session, refresh_token: refresh })
      })
    } catch {}
    this.clearSession()
  },

  async requestPasswordReset(email) {
    const res = await fetch(`${API}/api/auth/password/reset-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return res.json()
  },

  async confirmPasswordReset(token, newPassword) {
    const res = await fetch(`${API}/api/auth/password/reset-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Reset failed')
    return data
  },

  // Authenticated fetch with auto-refresh
  async fetch(url, options = {}) {
    let token = this.getToken()
    if (!token) throw new Error('Not authenticated')

    const payload = this.getTokenPayload()
    if (payload && payload.exp * 1000 < Date.now() + 60000) {
      token = await this.refreshToken()
    }

    const res = await fetch(`${API}${url}`, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if (res.status === 401) { this.clearSession(); throw new Error('Session expired') }
    return res
  }
}

export default authService
