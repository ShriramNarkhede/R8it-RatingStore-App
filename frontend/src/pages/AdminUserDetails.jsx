import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import { ErrorMessage, Spinner } from '../components/ui.jsx'

export default function AdminUserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [storeData, setStoreData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        // Get user details
        const { data: users } = await api.get('/admin/users', { params: { } })
        const found = users.find((u) => String(u.id) === String(id))
        setUser(found || null)

        // If user is store-owner, get their store data
        if (found && found.role === 'store-owner') {
          try {
            const { data: stores } = await api.get('/admin/stores', { params: { } })
            // Find store where ownerId matches the user's id
            const userStore = stores.find(s => s.ownerId === found.id || (s.owner && String(s.owner.id) === String(found.id)))
            if (userStore) {
              setStoreData(userStore)
            }
          } catch (storeErr) {
            console.error('Failed to load store data:', storeErr)
          }
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Spinner />
    </div>
  )
  if (error) return <ErrorMessage message={error} />
  if (!user) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>User Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The requested user could not be found.</p>
        <Link to="/admin" className="btn">← Back to Admin Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="container" style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: 'clamp(16px, 4vw, 24px)' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(12px, 3vw, 16px)', 
        marginBottom: 'clamp(24px, 6vw, 32px)',
        flexWrap: 'wrap'
      }}>
        <Link to="/admin" className="btn btn-secondary" style={{ 
          fontSize: 'clamp(12px, 2.5vw, 14px)', 
          padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)' 
        }}>
          ← Back to Admin
        </Link>
        <h1 style={{ 
          color: 'var(--text-primary)', 
          margin: 0,
          fontSize: 'clamp(20px, 4vw, 24px)'
        }}>
          User Details
        </h1>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: 'clamp(20px, 5vw, 24px)', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
      }}>
        {/* User Information Card */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            User Information
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)' 
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Full Name</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)' 
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Email Address</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.email}</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)' 
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Address</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.address}</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)' 
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Account Role</div>
              <div style={{ 
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: '500',
                display: 'inline-block',
                background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 
                           user.role === 'store-owner' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: user.role === 'admin' ? '#dc2626' : 
                       user.role === 'store-owner' ? '#2563eb' : '#16a34a'
              }}>
                {user.role === 'admin' ? 'Admin' : 
                 user.role === 'store-owner' ? 'Store Owner' : ' Normal User'}
              </div>
            </div>
          </div>
        </div>

        {/* Store Information Card (for store owners) */}
        {user.role === 'store-owner' && (
          <div className="glass-card">
            <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Store Information
            </h2>
            
            {storeData ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Store Name</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{storeData.name}</div>
                </div>
                
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Store Email</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{storeData.email}</div>
                </div>
                
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Store Address</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{storeData.address}</div>
                </div>
                
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Average Rating</div>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    display: 'inline-block',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#2563eb'
                  }}>
                    {storeData.rating || 0}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '20px', 
                background: 'rgba(245, 158, 11, 0.1)', 
                border: '1px solid rgba(245, 158, 11, 0.3)', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#d97706', marginBottom: '12px' }}>No Store Assigned</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  This store owner doesn't have a store assigned yet.
                </p>
                <Link to="/admin" className="btn btn-secondary" style={{ fontSize: '14px' }}>
                  Assign Store Owner
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Additional Info Card (for non-store owners) */}
        {user.role !== 'store-owner' && (
          <div className="glass-card">
           
            
            <div style={{ 
              padding: '20px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
                {user.role === 'admin' ? 'Administrator Account' : 'Normal User Account'}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {user.role === 'admin' 
                  ? 'This user has administrative privileges and can manage the entire system.'
                  : 'This user can browse stores and submit ratings.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


