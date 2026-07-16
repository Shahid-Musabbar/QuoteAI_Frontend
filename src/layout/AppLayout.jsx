import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: 'home', end: true },
  { to: '/try', label: 'Try Now', icon: 'flask' },
  { to: '/mail-polling', label: 'Mail Polling', icon: 'mail' },
  { to: '/simulate', label: 'RFP Simulation', icon: 'sparkles' },
]

const PAGE_META = {
  '/': { title: 'Overview', subtitle: 'How the RFP pricing multi-agent system works' },
  '/try': { title: 'Try Now', subtitle: 'Run the pipeline against a live mailbox check or a simulated RFP' },
  '/mail-polling': { title: 'Mail Polling', subtitle: 'Check the connected mailbox for new RFPs' },
  '/simulate': { title: 'RFP Simulation', subtitle: 'Paste an RFP email and run the full pricing pipeline' },
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? { title: '', subtitle: '' }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">
            <Icon name="cpu" size={18} />
          </span>
          <div className="brand-text">
            <strong>QuoteAI</strong>
            <span>Multi-Agent AI Configure,Price,Quote</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Backend expected at :8000</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">{meta.title}</h1>
            <p className="topbar-subtitle">{meta.subtitle}</p>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
