import axios from 'axios'

// Use environment variable for API URL, fallback to relative path for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
      } catch {}
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  }
)

export default api


