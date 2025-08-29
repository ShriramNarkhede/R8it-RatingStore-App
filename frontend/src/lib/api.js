import axios from 'axios'

// Use environment variable for API URL, fallback to relative path for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: API_BASE_URL })

// Initialize auth header from any persisted token to survive page refreshes
try {
  const persistedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  if (persistedToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${persistedToken}`
    api.defaults.headers.common.Authorization = `Bearer ${persistedToken}`
  }
} catch {}

// Ensure Authorization header is set on every request (avoids initialization race conditions)
api.interceptors.request.use((config) => {
  try {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    if (currentToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${currentToken}`
    }
  } catch {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
        delete api.defaults.headers.common.Authorization
      } catch {}
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  }
)

export default api


