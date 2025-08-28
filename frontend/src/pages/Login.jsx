import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
// import Lottie from 'lottie-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Local JSON
// or use a URL


export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // Redirect by role
      const storedUser = localStorage.getItem('user')
      const role = storedUser ? JSON.parse(storedUser).role : null
      if (role === 'admin') navigate('/admin')
      else if (role === 'store-owner') navigate('/owner')
      else navigate('/stores')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: 'clamp(60px, 15vw, 100px) auto',
      padding: 'clamp(16px, 4vw, 24px)'
    }}>
      <div className="glass-card">
        
        <h2 style={{
          textAlign: 'center',
          
          color: 'var(--text-primary)',
          fontSize: 'clamp(20px, 4vw, 24px)'
        }}>
          Welcome back!
        </h2>

        <p style={{
          marginBottom: 'clamp(20px, 5vw, 24px)',
            fontSize:'14px',
            fontWeight:'300'
        }}>
           Log in and join the community
        </p>



        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626'
          }}>
            {error}
            
          </div>
        )}
        

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>

            <input
              className="input"
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>

            <input
              className="input"
              placeholder="********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn"
            disabled={loading}
            type="submit"
            style={{ marginTop: '8px', marginRight: '10px', marginLeft: '10px' }}
          >
            {loading ? ' Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="link">Register here</Link>
        </p>
      </div>
    </div>
  )
}


