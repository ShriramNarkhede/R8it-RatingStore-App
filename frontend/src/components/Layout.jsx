import { Link, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../state/AuthContext';
import { useTheme } from '../state/ThemeContext';
import logoLight from '../assets/logo3.png'; // Import the light theme logo
import logoDark from '../assets/logo4.png'; // Import the dark theme logo

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine which logo to use based on the theme
  const logo = theme === 'light' ? logoLight : logoDark;
  const menuIconColor = theme === 'light' ? '#000' : '#fff';

  // Responsive breakpoint detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setMenuOpen(false);
      }
    };
    setIsMobile(mql.matches);
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && menuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isMobile, menuOpen]);

  // Toggle sticky header only after scrolling
  useEffect(() => {
    let visibilityTimeout;
    const onScroll = () => {
      const shouldStick = window.scrollY > 0;
      if (shouldStick && !isSticky) {
        setIsSticky(true);
        // delay adding visible class to allow slide-in animation
        requestAnimationFrame(() => {
          visibilityTimeout = setTimeout(() => setStickyVisible(true), 0);
        });
      } else if (!shouldStick && isSticky) {
        setStickyVisible(false);
        setIsSticky(false);
      }
      // Toggle body padding to offset fixed header
      if (shouldStick) {
        document.body.classList.add('has-sticky');
      } else {
        document.body.classList.remove('has-sticky');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(visibilityTimeout);
      document.body.classList.remove('has-sticky');
    };
  }, []);

  // Don't render navigation if no user
  if (!user) {
    return (
      <div>
        <header className={`header ${isSticky ? 'is-sticky' : ''} ${stickyVisible ? 'is-visible' : ''}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
          borderRadius: isSticky ? '0' : 'clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px)',
          margin: isSticky ? '0' : 'clamp(8px, 2vw, 16px) auto 0',
          width: isSticky ? '100%' : 'min(1200px, calc(100% - clamp(16px, 6vw, 48px)))',
          flexWrap: 'wrap'
        }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '40px', marginRight: '8px', cursor: 'pointer' }}
            onClick={() => navigate('/')} // Navigate to home on click
          />
          {isMobile && (
            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                className="menu-btn"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle navigation menu"
                style={{ display: 'inline-flex', background: 'transparent', border: 'none', fontSize: '22px' }}
              >
                <span style={{ color: menuIconColor }}>
                  {menuOpen ? '✕' : '☰'}
                </span>
              </button>
            </div>
          )}

          {isMobile && createPortal(
            (
              <div
                className={`nav-overlay ${menuOpen ? 'overlay-enter' : 'overlay-exit'}`}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 2000,
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  overflowY: 'auto',
                  pointerEvents: menuOpen ? 'auto' : 'none'
                }}
              >
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '28px',
                    color: menuIconColor,
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
                <ul style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  width: '100%'
                }}>
                  <li>
                    <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '20px' }}>Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '20px' }}>Register</Link>
                  </li>
                  
                </ul>
              </div>
            ),
            document.body
          )}
          {!isMobile && (
            <div className="nav-desktop" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>

              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn">Register</Link>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          )}
        </header>
        <main style={{
          padding: 'clamp(8px, 3vw, 16px)',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div>
      <header className={`header ${isSticky ? 'is-sticky' : ''} ${stickyVisible ? 'is-visible' : ''}`} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(8px, 2vw, 16px)',
        padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
        borderRadius: isSticky ? '0' : 'clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px)',
        margin: isSticky ? '0' : 'clamp(8px, 2vw, 16px) auto 0',
        width: isSticky ? '100%' : 'min(1200px, calc(100% - clamp(16px, 6vw, 48px)))',
        flexWrap: 'wrap'
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: '40px', marginRight: '8px', cursor: 'pointer' }}
          onClick={() => navigate('/')} // Navigate to home on click
        />
        {isMobile && (
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation menu"
              style={{ display: 'inline-flex', background: 'transparent', border: 'none', fontSize: '22px' }}
            >
              <span style={{ color: menuIconColor }}>
                {menuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        )}

        {isMobile && createPortal((
          <div
            className={`nav-overlay ${menuOpen ? 'overlay-enter' : 'overlay-exit'}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 2000,
              background: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              overflowY: 'auto',
              pointerEvents: menuOpen ? 'auto' : 'none'
            }}
          >
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                color: menuIconColor,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              width: '100%'
            }}>
              {/* Show Stores link only to normal users */}
              {user.role === 'user' && (
                <li><Link to="/stores" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '22px' }}>Stores</Link></li>
              )}
              {/* Show Owner Dashboard only to store-owners */}
              {user.role === 'store-owner' && (
                <li><Link to="/owner" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '22px' }}>Owner Dashboard</Link></li>
              )}
              {/* Show Admin link only to admins */}
              {user.role === 'admin' && (
                <li><Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '22px' }}>Admin</Link></li>
              )}
              {/* Show Profile to all authenticated users */}
              <li><Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '22px' }}>Profile</Link></li>
              <li>
                <button className="btn btn-secondary" onClick={() => { setMenuOpen(false); logout(); }} style={{ fontSize: '18px' }}>Logout</button>
              </li>
            </ul>
          </div>
        ), document.body)}

        {!isMobile && (
          <>
            <div className={`nav-links-desktop`} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', marginRight: '12px' }}>
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
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
            <div className={`nav-actions-desktop`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

            </div>
          </>
        )}
      </header>
      <main style={{
        padding: 'clamp(4px, 2vw, 12px)',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <Outlet />
      </main>
    </div>
  );
}
