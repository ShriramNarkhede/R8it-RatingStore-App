import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Spinner, ErrorMessage, Stars } from '../components/ui.jsx';
import { useAuth } from '../state/AuthContext';

// Stores Listing Page
export default function Stores() {
  // State
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect store owners away from this page
  useEffect(() => {
    if (user && user.role === 'store-owner') {
      navigate('/owner');
    }
  }, [user, navigate]);

  // Don't render if user is store-owner
  if (user && user.role === 'store-owner') return null;

  // Load stores from API
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      const { data } = await api.get('/user/stores', { params });
      setStores(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  // Debounced load for filters
  const debouncedLoad = useMemo(() => {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(load, 300);
    };
  }, [filters.name, filters.address]);

  useEffect(() => { load(); }, []);
  useEffect(() => { debouncedLoad(); }, [filters.name, filters.address]);

  // Rate a store
  const rate = async (storeId, rating) => {
    if (user && user.role === 'store-owner') {
      alert('Store owners cannot rate stores');
      return;
    }
    try {
      await api.post('/user/rating', { storeId, rating });
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to rate');
    }
  };

  // Render
  return (
    <div className="container" style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: 'clamp(24px, 6vw, 32px)',
        color: 'var(--text-primary)',
        fontSize: 'clamp(24px, 5vw, 32px)'
      }}>
        Browse Stores
      </h1>

      {/* Search Section */}
      <div className="glass-card" style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 32px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        marginBottom: 'clamp(24px, 6vw, 32px)',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: 'var(--text-primary)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '600',
          marginBottom: 'clamp(16px, 4vw, 24px)',
        }}>
          Search Stores
        </h2>
        <div style={{
          display: 'grid',
          gap: 'clamp(12px, 3vw, 16px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          alignItems: 'end',
        }}>
          {/* Store Name */}
          <div>
            <label htmlFor="store-name" style={{
              display: 'block', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '6px',
            }}>Store Name</label>
            <input
              id="store-name"
              className="input"
              placeholder="e.g. D Mart"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', transition: 'border 0.2s ease' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary-color)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>
          {/* Address */}
          <div>
            <label htmlFor="address" style={{
              display: 'block', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '6px',
            }}>Address</label>
            <input
              id="address"
              className="input"
              placeholder="e.g. Karenagar, Pune"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', transition: 'border 0.2s ease' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary-color)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn" onClick={load} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', height: 'fit-content' }}>
              Search
            </button>
            {(filters.name || filters.address) && (
              <button
                onClick={() => { setFilters({ name: '', address: '' }); load(); }}
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div style={{
          display: 'grid',
          gap: 'clamp(16px, 4vw, 20px)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}>
          {stores.map(store => (
            <div key={store.id} className="glass-card" style={{
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '18px' }}>{store.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>{store.address}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'grid', gap: '4px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Average Rating: <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{store.rating || 0}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Your Rating: <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{store.userRating ?? 'Not rated'}</span>
                  </div>
                </div>
                <div>
                  <Stars value={store.userRating || 0} onChange={n => rate(store.id, n)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No stores found message */}
      {stores.length === 0 && !loading && !error && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No stores found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}


