import { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { ErrorMessage, Spinner } from '../components/ui.jsx';
import { Link } from 'react-router-dom';

// Admin Dashboard Page
export default function Admin() {
  // State: stats, users, stores, filters, forms
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Filters & sorting
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'ASC' });

  // Create forms
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [assign, setAssign] = useState({ storeId: '', ownerId: '' });

  // Debounce refs
  const userSearchTimeout = useRef(null);
  const storeSearchTimeout = useRef(null);

  // Validation helpers
  const validateName = (v) => v && v.length >= 20 && v.length <= 60;
  const validateAddress = (v) => v && v.length <= 400;
  const validatePassword = (v) => /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(v);
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Load dashboard data
  const load = async (isSearch = false) => {
    if (isSearch) setSearchLoading(true);
    else setLoading(true);
    setError('');
    try {
      const [{ data: s }, { data: u }, { data: st }] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users', { params: { ...userFilters, ...userSort } }),
        api.get('/admin/stores', { params: { ...storeFilters, ...storeSort } }),
      ]);
      setStats(s);
      setUsers(u);
      setStores(st);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load admin data');
    } finally {
      if (isSearch) setSearchLoading(false);
      else setLoading(false);
    }
  };

  // Debounced search for users
  const debouncedUserSearch = (filters, sort) => {
    clearTimeout(userSearchTimeout.current);
    userSearchTimeout.current = setTimeout(() => {
      setUserFilters(filters);
      setUserSort(sort);
    }, 300);
  };
  // Debounced search for stores
  const debouncedStoreSearch = (filters, sort) => {
    clearTimeout(storeSearchTimeout.current);
    storeSearchTimeout.current = setTimeout(() => {
      setStoreFilters(filters);
      setStoreSort(sort);
    }, 300);
  };

  // Effects: load data and search
  useEffect(() => { load(); }, []);
  useEffect(() => { load(true); }, [userFilters, userSort]);
  useEffect(() => { load(true); }, [storeFilters, storeSort]);

  // Create user handler
  const submitNewUser = async (e) => {
    e.preventDefault();
    setFormMsg(''); setFormErr('');
    if (!validateName(newUser.name)) return setFormErr('Name must be 20-60 chars');
    if (!validateEmail(newUser.email)) return setFormErr('Invalid email');
    if (!validateAddress(newUser.address)) return setFormErr('Address max 400 chars');
    if (!validatePassword(newUser.password)) return setFormErr('Password 8-16, 1 uppercase, 1 special');
    try {
      await api.post('/admin/users', newUser);
      setFormMsg('User created');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      await load();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Failed to create user');
    }
  };

  // Create store handler
  const submitNewStore = async (e) => {
    e.preventDefault();
    setFormMsg(''); setFormErr('');
    if (!validateName(newStore.name)) return setFormErr('Name must be 20-60 chars');
    if (!validateEmail(newStore.email)) return setFormErr('Invalid email');
    if (!validateAddress(newStore.address)) return setFormErr('Address max 400 chars');
    try {
      await api.post('/admin/stores', newStore);
      setFormMsg('Store created');
      setNewStore({ name: '', email: '', address: '' });
      await load();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Failed to create store');
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
        Admin Dashboard
      </h1>
      <ErrorMessage message={error} />

      {/* Statistics Cards */}
      {stats && (
        <div className="glass-card" style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <h2 style={{
            marginBottom: 'clamp(16px, 4vw, 20px)',
            color: 'var(--text-primary)',
            fontSize: 'clamp(18px, 4vw, 24px)'
          }}>
            System Statistics
          </h2>
          <div style={{
            display: 'grid',
            gap: 'clamp(16px, 4vw, 20px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
          }}>
            <div style={{
              padding: '20px',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              minWidth: '0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalUsers}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Users</div>
            </div>
            <div style={{
              padding: '20px',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              minWidth: '0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalStores}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Stores</div>
            </div>
            <div style={{
              padding: '20px',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              minWidth: '0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalRatings}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Ratings</div>
            </div>
          </div>
        </div>
      )}

      {/* Management Forms */}
      <div style={{
        display: 'grid',
        gap: 'clamp(20px, 5vw, 24px)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        marginBottom: 'clamp(24px, 6vw, 32px)'
      }}>
        {/* Create User Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
            Create User
          </h3>
          {formMsg && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#16a34a'
            }}>
              {formMsg}
            </div>
          )}
          <ErrorMessage message={formErr} />
          <form onSubmit={submitNewUser} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <input
                className="input"
                placeholder="Full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div>
              <select
                className="input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store-owner">Store Owner</option>
              </select>
            </div>
            <button className="btn" type="submit">
              Create User
            </button>
          </form>
        </div>

        {/* Create Store Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
            Create Store
          </h3>
          <form onSubmit={submitNewStore} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <input
                className="input"
                placeholder="Store name"
                value={newStore.name}
                onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="Email"
                value={newStore.email}
                onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input"
                placeholder="Address"
                value={newStore.address}
                onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                required
              />
            </div>
            <button className="btn" type="submit">
              Create Store
            </button>
          </form>
        </div>

        {/* Assign Store Owner Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
            Assign Store Owner
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setFormMsg(''); setFormErr('');
              try {
                await api.put(`/admin/stores/${assign.storeId}/owner`, { ownerId: assign.ownerId });
                setFormMsg('Owner assigned successfully');
                setAssign({ storeId: '', ownerId: '' });
                await load();
              } catch (err) {
                setFormErr(err?.response?.data?.message || 'Failed to assign owner');
              }
            }}
            style={{ display: 'grid', gap: '16px' }}
          >
            <div>
              <select
                className="input"
                value={assign.storeId}
                onChange={(e) => setAssign({ ...assign, storeId: e.target.value })}
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="">Choose a store...</option>
                {stores.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <select
                className="input"
                value={assign.ownerId}
                onChange={(e) => setAssign({ ...assign, ownerId: e.target.value })}
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="">Choose a store owner...</option>
                {users.filter(u => u.role === 'store-owner').map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
              </select>
            </div>
            <button className="btn" type="submit">
              Assign Owner
            </button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
          Users Management
        </h3>
        {/* Search Filters */}
        <div style={{
          display: 'grid',
          gap: 'clamp(12px, 3vw, 16px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: 'clamp(16px, 4vw, 20px)',
          padding: '0 8px',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Search By Name
            </label>
            <input
              className="input"
              placeholder="Name..." style={{ textAlign: 'start', width: '70%' }}
              onChange={(e) => debouncedUserSearch({ ...userFilters, name: e.target.value }, userSort)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Search Email
            </label>
            <input
              className="input"
              placeholder="Filter email..." style={{ textAlign: 'start', width: '70%' }}
              onChange={(e) => debouncedUserSearch({ ...userFilters, email: e.target.value }, userSort)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Filter Role
            </label>
            <select
              className="custom-select"
              onChange={(e) => debouncedUserSearch({ ...userFilters, role: e.target.value }, userSort)}
            >
              <option value="">All roles</option>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store-owner">Store Owner</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Sort By
            </label>
            <select
              className="custom-select"
              onChange={(e) => debouncedUserSearch(userFilters, { ...userSort, sortBy: e.target.value })}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Order
            </label>
            <select
              className="custom-select"
              onChange={(e) => debouncedUserSearch(userFilters, { ...userSort, order: e.target.value })}>
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>

        {searchLoading || loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Address</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: index % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-card)'
                  }}>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', textAlign: 'start' }}>{user.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', textAlign: 'start' }}>{user.email}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'start' }}>{user.address}</td>
                    <td style={{ padding: '16px', textAlign: 'start' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' :
                          user.role === 'store-owner' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: user.role === 'admin' ? '#dc2626' :
                          user.role === 'store-owner' ? '#2563eb' : '#16a34a'
                      }}>
                        {user.role === 'admin' ? 'Admin' :
                          user.role === 'store-owner' ? 'Owner' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'start' }}>
                      <Link to={`/admin/users/${user.id}`} className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px 12px', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stores Table */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
          Stores Management
        </h3>
        {/* Search Filters */}
        <div style={{
          display: 'grid',
          gap: 'clamp(12px, 3vw, 16px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          marginBottom: 'clamp(16px, 4vw, 20px)',
          padding: '0 8px',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Search by Name
            </label>
            <input
              className="input"
              placeholder="Filter by store name..."
              onChange={(e) => debouncedStoreSearch({ ...storeFilters, name: e.target.value }, storeSort)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px', textAlign: 'center' }}>
              Search by Email
            </label>
            <input
              className="input"
              placeholder="Filter by store email..."
              onChange={(e) => debouncedStoreSearch({ ...storeFilters, email: e.target.value }, storeSort)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px'}}>
              Sort By
            </label>
            <select
              className="custom-select"
              onChange={(e) => debouncedStoreSearch(storeFilters, { ...storeSort, sortBy: e.target.value })}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px' }}>
              Order
            </label>
            <select
              className="custom-select"
              onChange={(e) => debouncedStoreSearch(storeFilters, { ...storeSort, order: e.target.value })}
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>

        {searchLoading || loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Store Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Address</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Owner</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, index) => (
                  <tr key={store.id} style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: index % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-card)'
                  }}>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'start' }}> {store.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', textAlign: 'start' }}>{store.email}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'start' }}> {store.address}</td>
                    <td style={{ padding: '16px', textAlign: 'start' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563eb'
                      }}>
                        {store.rating ?? 0}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'start' }}>
                      {store.owner?.name || 'No owner assigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


