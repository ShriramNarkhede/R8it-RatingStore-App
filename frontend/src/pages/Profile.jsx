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
    <div className="account-info-container">
      <h1 className="account-info-title">
        User Profile
      </h1>
      <div className="account-info-grid">
        {/* User Info Card */}
        <div className="account-info-card">
          <h2>Account Information</h2>
          <div className="account-info-grid-inner">
            <div className="account-info-item">
              <div className="account-info-label">Full Name</div>
              <div className="account-info-value">{user?.name}</div>
            </div>
            <div className="account-info-item">
              <div className="account-info-label">Email Address</div>
              <div className="account-info-value">{user?.email}</div>
            </div>
            <div className="account-info-item">
              <div className="account-info-label">Account Role</div>
              <div className="account-info-value role">{user?.role}</div>
            </div>
          </div>
        </div>
        {/* Password Change Card */}
        <div className="account-info-card">
          <h2>Change Password</h2>
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


