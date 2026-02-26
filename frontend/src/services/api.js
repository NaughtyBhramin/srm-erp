import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('srm_token')
      localStorage.removeItem('srm_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
