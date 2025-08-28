import { useEffect, useState } from 'react';
import api from '../lib/api';
import { ErrorMessage, Spinner } from '../components/ui.jsx';

// Store Owner Dashboard Page
export default function Owner() {
  // State
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load dashboard data
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/store/dashboard');
      setData(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: 'clamp(24px, 6vw, 32px)',
        color: 'var(--text-primary)',
        fontSize: 'clamp(24px, 5vw, 32px)'
      }}>
        Store Owner Dashboard
      </h1>
      {error && <ErrorMessage message={error} />}
      {data && (
        <div style={{ display: 'grid', gap: 'clamp(20px, 5vw, 24px)' }}>
          {/* Store Statistics */}
          <div className="glass-card">
            <h2 style={{
              marginBottom: 'clamp(16px, 4vw, 20px)',
              color: 'var(--text-primary)',
              fontSize: 'clamp(18px, 4vw, 24px)'
            }}>
              Store Statistics
            </h2>
            <div style={{
              display: 'grid',
              gap: 'clamp(16px, 4vw, 20px)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              <div style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.storeName}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Store Name</div>
              </div>
              <div style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.averageRating}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Average Rating</div>
              </div>
              <div style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.totalRatings}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Total Ratings</div>
              </div>
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="glass-card">
            <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
              Customer Ratings
            </h2>
            {data.raters.length === 0 ? (
              <div style={{
                padding: '40px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>No Ratings Yet</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Your store hasn't received any ratings yet. Encourage customers to rate your store!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {data.raters.map((rater, idx) => (
                  <div key={idx} style={{
                    padding: '20px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{rater.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{rater.email}</div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', width: '50px', height: '50px', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#2563eb', textTransform: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <span style={{ color: '#2563eb', fontWeight: '600', fontSize: '12px' }}>
                        {rater.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card">
            <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
              Quick Actions
            </h2>
            <div style={{
              display: 'grid',
              gap: 'clamp(12px, 3vw, 16px)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              <button
                className="btn"
                onClick={load}
                style={{ padding: '16px', fontSize: '16px' }}
              >
                Refresh Data
              </button>
              <div style={{
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Analytics</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Coming Soon</div>
              </div>
              <div style={{
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Reports</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


