import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/solutions', label: 'Solutions' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/demo', label: 'Live demo' },
]

export default function AppLayout() {
  const navigate = useNavigate()

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
        <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
          Run the simulation
        </button>
      </nav>

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
    </div>
  )
}
