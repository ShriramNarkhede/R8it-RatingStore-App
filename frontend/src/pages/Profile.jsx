import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../state/AuthContext';

// User Profile Page
export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle password update
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/user/password', { currentPassword, newPassword });
      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(16px, 4vw, 24px)'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: 'clamp(24px, 6vw, 32px)',
        color: 'var(--text-primary)',
        fontSize: 'clamp(24px, 5vw, 32px)'
      }}>
        User Profile
      </h1>
      <div style={{
        display: 'grid',
        gap: 'clamp(16px, 4vw, 20px)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
      }}>
        {/* User Info Card */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Account Information
          </h2>
          <div style={{ display: 'grid', gap: '16px', minWidth: '0', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', minWidth: '0' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Full Name</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.name}</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', minWidth: '0' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Email Address</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.email}</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', minWidth: '0' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Account Role</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: '600', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </div>
        {/* Password Change Card */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Change Password
          </h2>
          {message && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#16a34a'
            }}>{message}</div>
          )}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#dc2626'
            }}>{error}</div>
          )}
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <input
                className="input"
                placeholder="Current Password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn" type="submit" style={{ marginTop: '8px' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


