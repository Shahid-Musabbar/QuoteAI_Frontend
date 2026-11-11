import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/solutions', label: 'Solutions' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/data', label: 'Data sources' },
  { to: '/demo', label: 'Live demo' },
]

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function AppLayout() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme'))
  const isDark = theme ? theme === 'dark' : systemPrefersDark()
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('quoteai-theme', next)
    } catch {
      /* storage unavailable; theme still applies for this session */
    }
    setTheme(next)
  }
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, login, logout } = useAuth()
  // The conversation workspace is a full-bleed app view (sidebar flush to the
  // viewport edge), not a marketing page, so it skips the centered `.wrap`
  // container and footer that every other route gets.
  const isWorkspace = location.pathname.startsWith('/demo')

  return (
    <div className="app-shell">
      <nav className="nav">
        <span className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          QuoteAI
        </span>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        {!loading && (
          user ? (
            <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.picture && (
                <img
                  src={user.picture}
                  alt=""
                  className="nav-avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                />
              )}
              <span>{user.name || user.email}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Sign out
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={login}>
              Sign in with Google
            </button>
          )
        )}
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
          Run the simulation
        </button>
      </nav>

      {isWorkspace ? (
        <Outlet />
      ) : (
        <>
          <div className="wrap page-main">
            <Outlet />
          </div>

          <footer className="site-footer">
            <div className="wrap">
              <div className="footer-brand">
                <p>QuoteAI</p>
                <p>Multi-agent pricing — configure, price, quote.</p>
              </div>
              <div className="footer-links">
                <NavLink to="/solutions">Solutions</NavLink>
                <NavLink to="/pricing">Pricing</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Security</a>
              </div>
              <p className="footer-copy">© 2026 QuoteAI</p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
