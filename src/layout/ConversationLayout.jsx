import { Outlet } from 'react-router-dom'
import ConversationSidebar from '../components/ConversationSidebar.jsx'
import { useAuth } from '../auth.jsx'

export default function ConversationLayout() {
  const { user, loading, login } = useAuth()

  if (!loading && !user) {
    return (
      <div className="wrap page-main">
        <div className="demo-hero">
          <span className="kicker">Live workspace</span>
          <h1 className="page-title">Sign in to open your quotes.</h1>
          <p className="page-lead">
            RFQ conversations are tied to your Google account so your quote history and Gmail
            drafts stay together.
          </p>
          <button type="button" className="btn btn-primary signin-btn" onClick={login}>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="conversation-shell">
      <ConversationSidebar />
      <div className="conversation-main">
        <div className="wrap conversation-main-wrap">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
