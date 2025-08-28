import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validateName = (v) => v && v.length >= 20 && v.length <= 60
  const validateAddress = (v) => v && v.length <= 400
  const validatePassword = (v) => /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(v)
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!validateName(form.name)) throw new Error('Name must be 20-60 chars')
      if (!validateEmail(form.email)) throw new Error('Invalid email')
      if (!validateAddress(form.address)) throw new Error('Address max 400 chars')
      if (!validatePassword(form.password)) throw new Error('Password 8-16, 1 uppercase, 1 special')
      await register(form)
      navigate('/stores')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: 'clamp(40px, 10vw, 50px) auto', 
      padding: 'clamp(16px, 4vw, 24px)' 
    }}>
      <div className="glass-card">
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: 'clamp(20px, 5vw, 24px)', 
          color: 'var(--text-primary)',
          fontSize: 'clamp(20px, 4vw, 24px)'
        }}>
          Create Account
        </h2>
        
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
              name="name" 
              placeholder="Full Name" 
              value={form.name} 
              onChange={onChange}
              required
            />
          </div>
          
          <div>
           
            <input 
              className="input"
              name="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={onChange}
              required
            />
          </div>
          
          <div>
            
            <input 
              className="input"
              name="address" 
              placeholder="Address" 
              value={form.address} 
              onChange={onChange}
              required
            />
          </div>
          
          <div>
           
            <input 
              className="input"
              name="password" 
              placeholder="Password" 
              type="password" 
              value={form.password} 
              onChange={onChange}
              required
            />
          </div>
          
          <button 
            className="btn" 
            disabled={loading} 
            type="submit"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  )
}


