import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { checkMailbox } from '../api.js'

export default function MailPollingPage() {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleCheck() {
    setStatus('loading')
    setError('')
    try {
      const data = await checkMailbox()
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="mail-page">
      <div className="card panel">
        <p className="section-lead">
          Calls <code>POST /start</code> on the backend. This is a placeholder for real inbox
          polling — it will later run <code>classify_rfp()</code> against each new message and
          kick off the pricing workflow automatically.
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCheck}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Icon name="loader" size={16} className="spin" /> Checking mailbox…
            </>
          ) : (
            <>
              <Icon name="mail" size={16} /> Check mailbox now
            </>
          )}
        </button>

        {status === 'done' && result && (
          <div className="result-block">
            <div className="result-row">
              <span className="label">Status</span>
              <span className="badge badge-neutral">{result.status}</span>
            </div>
            <div className="result-row">
              <span className="label">New mail found</span>
              <span className={`badge ${result.new_mail_found ? 'badge-success' : 'badge-warning'}`}>
                {result.new_mail_found ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="result-row">
              <span className="label">Message</span>
              <span className="value">{result.message}</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="alert alert-danger">
            <Icon name="alertTriangle" size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="secondary-cta">
        <p>Want to run the pricing pipeline directly against an email?</p>
        <Link to="/simulate" className="btn btn-ghost">
          Go to RFP Simulation <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </div>
  )
}
