import { Link, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../state/AuthContext';
import { useTheme } from '../state/ThemeContext';
import logoLight from '../assets/logo3.png'; // Import the light theme logo
import logoDark from '../assets/logo4.png'; // Import the dark theme logo

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  // Determine which logo to use based on the theme
  const logo = theme === 'light' ? logoLight : logoDark;

  // Don't render navigation if no user
  if (!user) {
    return (
      <div>
        <header className="header" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 16px)', 
          padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
          borderRadius: '0 0 clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px)',
          margin: '0 clamp(8px, 2vw, 16px)',
          flexWrap: 'wrap'
        }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', marginRight: '8px', cursor: 'pointer' }} 
            onClick={() => navigate('/')} // Navigate to home on click
          />
          
          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(8px, 2vw, 12px)',
            flexWrap: 'wrap'
          }}>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </div>
        </header>
        <main style={{ 
          padding: 'clamp(16px, 4vw, 24px)', 
          minHeight: 'calc(100vh - 80px)' 
        }}>
          <Outlet />
        </main>
      </div>
    );
  }
  
  return (
    <div>
      <header className="header" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(8px, 2vw, 16px)', 
        padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
        borderRadius: '0 0 clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px)',
        margin: '0 clamp(8px, 2vw, 16px)',
        flexWrap: 'wrap'
      }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: '40px', marginRight: '8px', cursor: 'pointer' }} 
          onClick={() => navigate('/')} // Navigate to home on click
        />
       
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(4px, 1vw, 8px)',
          flexWrap: 'wrap',
          flex: 1,
          justifyContent: 'center'
        }}>
          {/* Show Stores link only to normal users */}
          {user.role === 'user' && (
            <Link to="/stores" className="nav-link">Stores</Link>
          )}
          
          {/* Show Owner Dashboard only to store-owners */}
          {user.role === 'store-owner' && (
            <Link to="/owner" className="nav-link">Owner Dashboard</Link>
          )}
          
          {/* Show Admin link only to admins */}
          {user.role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          
          {/* Show Profile to all authenticated users */}
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <span style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            display: 'none',
            '@media (min-width: 768px)': {
              display: 'block'
            }
          }}>
            {user.name} ({user.role})
          </span>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={{ 
        padding: 'clamp(16px, 4vw, 24px)', 
        minHeight: 'calc(100vh - 80px)' 
      }}>
        <Outlet />
      </main>
    </div>
  );
}
