import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/solutions', label: 'Solutions' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/demo', label: 'Live demo' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, login, logout } = useAuth()
  // The conversation workspace is a full-bleed app view (sidebar flush to the
  // viewport edge), not a marketing page, so it skips the centered `.wrap`
  // container and footer that every other route gets.
  const isWorkspace = location.pathname.startsWith('/demo')

  return (
    <div>
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
        <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
          Run the simulation
        </button>
      </nav>

      {isWorkspace ? (
        <Outlet />
      ) : (
        <>
          <div className="wrap">
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
