import './App.css';
import { Link } from 'react-router-dom';
import { useAuth } from './state/AuthContext';

// Main App Component
function App() {
  const { user } = useAuth();

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: 'clamp(40px, 10vw, 80px) auto',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6,
      }}
    >
      {/* Hero Section */}
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          borderRadius: '20px',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            lineHeight: 1.1,
          }}
        >
          R8it
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Discover top-rated stores and share your honest reviews.
        </p>
      </div>

      {/* User Greeting or CTA */}
      {user ? (
        <div
          className="glass-card"
          style={{
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h2 style={{
            marginBottom: '8px',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}>
            Welcome back, <span style={{ color: 'var(--primary-color)' }}>{user.name}</span>!
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              fontSize: '1rem',
            }}
          >
            You're logged in as <strong style={{ color: 'var(--primary-color)' }}>{user.role}</strong>.
          </p>

          {/* Role-Specific Dashboard Info */}
          <div
            style={{
              display: 'grid',
              gap: '20px',
              marginTop: '24px',
              alignItems: 'stretch',
            }}
          >
            {user.role === 'admin' && (
              <DashboardCard
                title="Admin Dashboard"
                description="Manage users, stores, and system-wide analytics with full control."
              />
            )}
            {user.role === 'store-owner' && (
              <DashboardCard
                title="Owner Dashboard"
                description="Monitor your store’s performance, reviews, and customer feedback."
              />
            )}
            {user.role === 'user' && (
              <DashboardCard
                title="Browse & Rate Stores"
                description="Discover top-rated stores and share your honest reviews."
              />
            )}
          </div>

          <p
            style={{
              marginTop: '32px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            Use the navigation menu to explore your dashboard features.
          </p>
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '40px 32px',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h2
            style={{
              marginBottom: '16px',
              color: 'var(--text-primary)',
              fontSize: '1.6rem',
              fontWeight: '600',
            }}
          >
            Welcome to R8it
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '28px',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Join our community today to discover, rate, and support great stores.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            <Link
              to="/login"
              className="btn"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '10px',
              }}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '10px',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Dashboard Card (no icon prop, clean design)
function DashboardCard({ title, description }) {
  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--bg-secondary)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
          fontWeight: '600',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          color: 'var(--text-secondary)',
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default App;