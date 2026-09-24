import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { listConversations } from '../api.js'

const STORAGE_KEY = 'qai-sidebar-collapsed'

function readStoredCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeStoredCollapsed(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // ignore — private browsing / blocked storage
  }
}

function formatUpdatedAt(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ConversationSidebar() {
  const [collapsed, setCollapsed] = useState(readStoredCollapsed)
  const { data, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: listConversations,
  })

  const conversations = data?.conversations ?? []

  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v
      writeStoredCollapsed(next)
      return next
    })
  }

  if (collapsed) {
    return (
      <aside className="conversation-sidebar collapsed">
        <button
          type="button"
          className="conversation-sidebar-toggle"
          onClick={toggleCollapsed}
          aria-label="Open conversation list"
          title="Open conversation list"
        >
          »
        </button>
        <NavLink
          to="/demo"
          end
          className="conversation-sidebar-toggle"
          aria-label="New conversation"
          title="New conversation"
        >
          +
        </NavLink>
      </aside>
    )
  }

  return (
    <aside className="conversation-sidebar">
      <div className="conversation-sidebar-head">
        <NavLink to="/demo" end className="btn btn-primary btn-block conversation-sidebar-new">
          New conversation
        </NavLink>
        <button
          type="button"
          className="conversation-sidebar-toggle"
          onClick={toggleCollapsed}
          aria-label="Collapse conversation list"
          title="Collapse conversation list"
        >
          «
        </button>
      </div>

      {isLoading && <p className="conversation-sidebar-note">Loading…</p>}
      {error && <p className="conversation-sidebar-note">{error.message}</p>}
      {!isLoading && !error && conversations.length === 0 && (
        <p className="conversation-sidebar-note">
          No RFQs yet — paste one or pull from Gmail to get started.
        </p>
      )}

      <nav className="conversation-sidebar-list">
        {conversations.map((c) => (
          <NavLink
            key={c.id}
            to={`/demo/${c.id}`}
            className={({ isActive }) =>
              `conversation-sidebar-item${isActive ? ' active' : ''}`
            }
          >
            <span className="conversation-sidebar-item-title">{c.title}</span>
            <span className="conversation-sidebar-item-meta">
              {c.status === 'ignored' ? (
                <span className="badge badge-neutral">Ignored</span>
              ) : c.latest_price != null ? (
                <span className="badge badge-success">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    c.latest_price,
                  )}
                </span>
              ) : null}
              <span className="conversation-sidebar-item-date">{formatUpdatedAt(c.updated_at)}</span>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
