import { useState } from 'react'
import { checkMailbox, runRfpSimulation } from '../api.js'

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

  // mail polling state
  const [polling, setPolling] = useState(false)
  const [pollResult, setPollResult] = useState(null)
  const [pollError, setPollError] = useState('')

  // simulation state
  const [rfp, setRfp] = useState('')
  const [simStatus, setSimStatus] = useState('idle') // idle | running | ignored | quoted | error
  const [simResult, setSimResult] = useState(null)
  const [simError, setSimError] = useState('')
  const [approved, setApproved] = useState(false)
  const [showAgentDetail, setShowAgentDetail] = useState(false)

  async function runPoll() {
    if (polling) return
    setPolling(true)
    setPollError('')
    try {
      const data = await checkMailbox()
      setPollResult(data)
    } catch (err) {
      setPollError(err.message)
      setPollResult(null)
    } finally {
      setPolling(false)
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
            <h3 className="card-title">Check the connected mailbox for new RFPs</h3>
            <p className="card-body">
              Calls <code>POST /start</code> on the backend. Polls the inbox, runs the classifier
              against each new message, and routes anything that looks like an RFP into the
              pricing workflow.
            </p>
            <div className="mail-note">
              <button type="button" className="btn btn-primary" onClick={runPoll} disabled={polling}>
                {polling ? 'Checking mailbox…' : pollResult ? 'Check again' : 'Check mailbox now'}
              </button>
            </div>
          </div>

          {pollError && (
            <div className="alert alert-danger" style={{ marginTop: '24px' }}>
              <span>{pollError}</span>
            </div>
          )}

          {pollResult && (
            <div className="mail-result">
              <div className="mail-result-row">
                <span className="label">Status</span>
                <span className="badge badge-neutral">{pollResult.status}</span>
              </div>
              <div className="mail-result-row">
                <span className="label">New mail found</span>
                <span className={`badge ${pollResult.new_mail_found ? 'badge-success' : 'badge-warning'}`}>
                  {pollResult.new_mail_found ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="mail-result-row">
                <span className="label">Message</span>
                <span>{pollResult.message}</span>
              </div>
              <p style={{ fontSize: '15.5px', lineHeight: '26px', margin: '20px 0 0', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>
                Want to price a specific RFP instead? <a onClick={() => setTab('sim')} style={{ cursor: 'pointer' }}>Open it in the simulation</a>.
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
