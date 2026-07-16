import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { runRfpSimulation } from '../api.js'

const SAMPLE_EMAIL = `Hi team, we are Acme Manufacturing and we'd like to request a formal quote/proposal for 5000 units of steel brackets for our upcoming assembly line project. Please send pricing and terms. Thanks!`

const AGENT_LABELS = {
  erp: { title: 'ERP Costing Agent', icon: 'server' },
  analyzer: { title: 'Market Analyzer Agent', icon: 'target' },
  cashflow: { title: 'Cash Flow Agent', icon: 'cash' },
  target: { title: 'Sales Target Agent', icon: 'dollar' },
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
      raw: finalReport,
    }
  } catch {
    return { price: null, rationale: finalReport, paymentTerms: null, risks: null, raw: finalReport }
  }
}

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function SimulationPage() {
  const [emailText, setEmailText] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | ignored | quoted | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [showAgentDetail, setShowAgentDetail] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!emailText.trim() || status === 'loading') return
    setStatus('loading')
    setError('')
    try {
      const data = await runRfpSimulation(emailText)
      setResult(data)
      setStatus(data.status === 'ignored' ? 'ignored' : 'quoted')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  function handleReset() {
    setStatus('idle')
    setResult(null)
    setError('')
    setShowAgentDetail(false)
  }

  const report = status === 'quoted' && result ? parseFinalReport(result.final_report) : null

  return (
    <div className="sim-page">
      {(status === 'idle' || status === 'loading' || status === 'error') && (
        <form className="card panel" onSubmit={handleSubmit}>
          <div className="field-header">
            <label htmlFor="email_text">RFP email content</label>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setEmailText(SAMPLE_EMAIL)}
              disabled={status === 'loading'}
            >
              Load sample RFP
            </button>
          </div>
          <textarea
            id="email_text"
            className="rfp-textarea"
            placeholder="Paste the raw RFP / quote-request email here…"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            disabled={status === 'loading'}
            rows={10}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!emailText.trim() || status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Icon name="loader" size={16} className="spin" /> Running pipeline…
              </>
            ) : (
              <>
                <Icon name="sparkles" size={16} /> Run simulation
              </>
            )}
          </button>

          {status === 'loading' && (
            <p className="loading-note">
              The classifier is checking the email, then the manager agent is consulting the ERP,
              market, cash flow, and sales target subagents. This can take up to a minute.
            </p>
          )}

          {status === 'error' && (
            <div className="alert alert-danger">
              <Icon name="alertTriangle" size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>
      )}

      {status === 'ignored' && (
        <div className="card panel">
          <div className="alert alert-warning">
            <Icon name="alertTriangle" size={16} />
            <span>Not classified as an RFP — {result?.reason || 'no reason given'}.</span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Try another email
          </button>
        </div>
      )}

      {status === 'quoted' && report && (
        <div className="results">
          <div className="card result-hero">
            <span className="label">1 · Recommended price</span>
            <div className="price-value">
              {formatPrice(report.price) ?? '—'}
              {result.human_override_price != null && (
                <span className="badge badge-neutral price-override">
                  overridden to {formatPrice(result.human_override_price)}
                </span>
              )}
            </div>
            {result.approved && <span className="badge badge-success">Approved</span>}
          </div>

          <div className="card result-block-card">
            <span className="label">2 · Rationale</span>
            <p className="result-text">{report.rationale || 'No rationale returned.'}</p>
          </div>

          <div className="card result-block-card">
            <span className="label">3 · Suggested payment terms</span>
            <p className="result-text">{report.paymentTerms || 'No payment terms returned.'}</p>
          </div>

          <div className="card result-block-card risk-card">
            <span className="label">4 · Risk flags</span>
            <p className="result-text">{report.risks || 'None flagged.'}</p>
          </div>

          {result.agent_outputs && (
            <div className="agent-detail">
              <button
                type="button"
                className="btn btn-link agent-toggle"
                onClick={() => setShowAgentDetail((v) => !v)}
              >
                <Icon name="chevronDown" size={16} className={showAgentDetail ? 'rotated' : ''} />
                {showAgentDetail ? 'Hide' : 'Show'} subagent insights
              </button>

              {showAgentDetail && (
                <div className="card-grid">
                  {Object.entries(result.agent_outputs).map(([key, text]) => {
                    const meta = AGENT_LABELS[key] || { title: key, icon: 'cpu' }
                    return (
                      <div className="card subagent-card" key={key}>
                        <span className="card-icon">
                          <Icon name={meta.icon} size={18} />
                        </span>
                        <h4>{meta.title}</h4>
                        <p>{text}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Run another simulation
          </button>
        </div>
      )}
    </div>
  )
}
