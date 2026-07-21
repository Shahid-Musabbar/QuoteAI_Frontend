import { useEffect, useState } from 'react'
import { listGmailMessages, processGmailMessage, runRfpSimulation } from '../api.js'
import { useAuth } from '../auth.jsx'

const SAMPLE_EMAIL = `Hi team, we are Acme Manufacturing and we'd like to request a formal quote/proposal for 5000 units of steel brackets for our upcoming assembly line project. Please send pricing and terms. Thanks!`

const AGENT_LABELS = {
  erp: 'ERP costing agent',
  analyzer: 'Market analyzer agent',
  cashflow: 'Cash flow agent',
  target: 'Sales target agent',
}

function parseFinalReport(finalReport) {
  if (!finalReport) return null
  try {
    const parsed = JSON.parse(finalReport)
    return {
      price: parsed.recommended_price,
      rationale: parsed.rationale,
      paymentTerms: parsed.suggested_payment_terms,
      risks: parsed.risk_flags,
    }
  } catch {
    return { price: null, rationale: finalReport, paymentTerms: null, risks: null }
  }
}

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function DemoPage() {
  const [tab, setTab] = useState('sim')
  const { user, loading: authLoading, login } = useAuth()

  // gmail inbox state
  const [gmailLoading, setGmailLoading] = useState(false)
  const [gmailMessages, setGmailMessages] = useState(null)
  const [gmailError, setGmailError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  // simulation state
  const [rfp, setRfp] = useState('')
  const [simStatus, setSimStatus] = useState('idle') // idle | running | ignored | quoted | error
  const [simResult, setSimResult] = useState(null)
  const [simError, setSimError] = useState('')
  const [approved, setApproved] = useState(false)
  const [showAgentDetail, setShowAgentDetail] = useState(false)

  useEffect(() => {
    if (!user) {
      setGmailMessages(null)
      setGmailError('')
      setProcessingId(null)
    }
  }, [user])

  async function loadGmailMessages() {
    if (gmailLoading) return
    setGmailLoading(true)
    setGmailError('')
    try {
      const data = await listGmailMessages()
      setGmailMessages(data.messages)
    } catch (err) {
      setGmailError(err.message)
      setGmailMessages(null)
    } finally {
      setGmailLoading(false)
    }
  }

  async function pickGmailMessage(messageId) {
    if (processingId) return
    setProcessingId(messageId)
    setGmailError('')
    try {
      const data = await processGmailMessage(messageId)
      setSimResult(data)
      setSimStatus(data.status === 'ignored' ? 'ignored' : 'quoted')
      setApproved(false)
      setShowAgentDetail(false)
      setTab('sim')
    } catch (err) {
      setGmailError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function runSim(e) {
    e.preventDefault()
    if (simStatus === 'running') return
    if (!rfp.trim()) {
      setRfp(SAMPLE_EMAIL)
      return
    }
    setSimStatus('running')
    setSimError('')
    setApproved(false)
    try {
      const data = await runRfpSimulation(rfp)
      setSimResult(data)
      setSimStatus(data.status === 'ignored' ? 'ignored' : 'quoted')
    } catch (err) {
      setSimError(err.message)
      setSimStatus('error')
    }
  }

  function resetSim() {
    setSimStatus('idle')
    setSimResult(null)
    setSimError('')
    setApproved(false)
    setShowAgentDetail(false)
  }

  const report = simStatus === 'quoted' && simResult ? parseFinalReport(simResult.final_report) : null

  return (
    <>
      <div className="demo-hero">
        <span className="kicker">Live demo</span>
        <h1 className="page-title">Watch the desk work.</h1>
        <p className="page-lead">
          Poll the mailbox for new RFPs, or paste one in and run the full pricing pipeline. Both
          panels call the FastAPI backend directly.
        </p>
        <div className="demo-tabs">
          <button
            type="button"
            className={tab === 'poll' ? 'active' : ''}
            onClick={() => setTab('poll')}
          >
            Mail polling
          </button>
          <button
            type="button"
            className={tab === 'sim' ? 'active' : ''}
            onClick={() => setTab('sim')}
          >
            RFP simulation
          </button>
        </div>
      </div>

      {tab === 'poll' && (
        <div className="demo-body mail">
          <div className="card">
            <p className="card-kicker">Mail polling</p>
            <h3 className="card-title">Check your Gmail inbox for new RFPs</h3>
            <p className="card-body">
              {user
                ? <>Calls <code>GET /gmail/messages</code> on the backend using your connected Google account, then lets you run any message through the pricing workflow.</>
                : <>Sign in with Google to grant read-only Gmail access, then pull recent inbox messages straight into the pricing workflow.</>}
            </p>
            <div className="mail-note">
              {!authLoading && (
                user ? (
                  <button type="button" className="btn btn-primary" onClick={loadGmailMessages} disabled={gmailLoading}>
                    {gmailLoading ? 'Checking inbox…' : gmailMessages ? 'Check again' : 'Check my inbox'}
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={login}>
                    Sign in with Google
                  </button>
                )
              )}
            </div>
          </div>

          {gmailError && (
            <div className="alert alert-danger" style={{ marginTop: '24px' }}>
              <span>{gmailError}</span>
            </div>
          )}

          {gmailMessages && (
            <div className="mail-result">
              {gmailMessages.length === 0 && <p>No messages found in the inbox.</p>}
              {gmailMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="mail-result-row"
                  style={{ cursor: processingId ? 'default' : 'pointer', alignItems: 'flex-start' }}
                  onClick={() => pickGmailMessage(msg.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="label">{msg.subject}</span>
                    <span style={{ fontSize: '13px' }}>{msg.from} · {msg.date}</span>
                    <span style={{ fontSize: '13.5px' }}>{msg.snippet}</span>
                  </div>
                  <span className="badge badge-neutral">
                    {processingId === msg.id ? 'Processing…' : 'Run pricing'}
                  </span>
                </div>
              ))}
              <p style={{ fontSize: '15.5px', lineHeight: '26px', margin: '20px 0 0', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>
                Want to price a pasted email instead? <a onClick={() => setTab('sim')} style={{ cursor: 'pointer' }}>Open it in the simulation</a>.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'sim' && (
        <div className="demo-body sim">
          {(simStatus === 'idle' || simStatus === 'running' || simStatus === 'error') && (
            <div className="card">
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <p className="card-kicker" style={{ margin: 0 }}>
                  RFP email content
                </p>
                <a
                  onClick={() => setRfp(SAMPLE_EMAIL)}
                  style={{ cursor: 'pointer', fontSize: '14px' }}
                >
                  Load sample RFP
                </a>
              </div>
              <form onSubmit={runSim}>
                <textarea
                  className="input rfp-textarea"
                  value={rfp}
                  onChange={(e) => setRfp(e.target.value)}
                  placeholder="Paste the raw RFP / quote-request email here…"
                  aria-label="RFP email content"
                  disabled={simStatus === 'running'}
                />
                <div style={{ marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary btn-block" disabled={simStatus === 'running'}>
                    {simStatus === 'running'
                      ? 'Agents working…'
                      : rfp.trim()
                        ? 'Run simulation'
                        : 'Load sample & run'}
                  </button>
                </div>
              </form>
              {simStatus === 'error' && (
                <div className="alert alert-danger" style={{ marginTop: '14px' }}>
                  <span>{simError}</span>
                </div>
              )}
            </div>
          )}

          <div>
            {simStatus === 'idle' && (
              <p className="worklog-empty">
                The agents&apos; worklog appears here — classifier verdict first, then each
                specialist, then the final quote for review.
              </p>
            )}

            {simStatus === 'running' && <p className="worklog-working">Working…</p>}

            {simStatus === 'ignored' && (
              <div className="alert alert-warning">
                <span>Not classified as an RFP — {simResult?.reason || 'no reason given'}.</span>
              </div>
            )}

            {simStatus === 'quoted' && report && (
              <div className="card quote-result">
                <p className="card-kicker">Recommended quote · awaiting review</p>
                <p className="price">
                  {formatPrice(report.price) ?? '—'}
                  {simResult.human_override_price != null && (
                    <span className="unit"> · overridden to {formatPrice(simResult.human_override_price)}</span>
                  )}
                </p>
                <p>{report.rationale || 'No rationale returned.'}</p>
                <p className="terms">
                  <span>Terms</span> — {report.paymentTerms || 'No payment terms returned.'}
                </p>
                <p className="terms">
                  <span>Risk flags</span> — {report.risks || 'None flagged.'}
                </p>
                {simResult.approved && (
                  <div className="tags">
                    <span className="badge badge-success">Approved</span>
                  </div>
                )}
                <div className="actions">
                  <button type="button" className="btn btn-primary" onClick={() => setApproved(true)}>
                    {approved ? 'Approved ✓' : 'Approve quote'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={resetSim}>
                    Run another
                  </button>
                </div>
              </div>
            )}

            {simStatus === 'quoted' && simResult?.agent_outputs && (
              <>
                <button
                  type="button"
                  className="agent-toggle"
                  onClick={() => setShowAgentDetail((v) => !v)}
                >
                  <span className={`chevron${showAgentDetail ? ' open' : ''}`}>⌄</span>
                  {showAgentDetail ? 'Hide' : 'Show'} subagent insights
                </button>

                {showAgentDetail && (
                  <div className="agent-grid">
                    {Object.entries(simResult.agent_outputs).map(([key, text]) => (
                      <div className="card agent-card" key={key}>
                        <p className="card-kicker">{key}</p>
                        <h3 className="card-title">{AGENT_LABELS[key] || key}</h3>
                        <p className="card-body">{text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {(simStatus === 'ignored') && (
              <div style={{ marginTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={resetSim}>
                  Try another email
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
