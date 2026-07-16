import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function TryPage() {
  return (
    <div className="try-page">
      <p className="section-lead">
        Pick how you want to trigger the pricing pipeline. Both call the same FastAPI backend.
      </p>

      <div className="try-grid">
        <Link to="/mail-polling" className="try-card">
          <span className="try-icon">
            <Icon name="mail" size={22} />
          </span>
          <h3>Mailbox Polling</h3>
          <p>
            Trigger a mailbox check (<code>POST /start</code>). In production this polls IMAP /
            Outlook Graph / Gmail for new mail and classifies each message. Currently mocked to
            always report no new mail.
          </p>
          <span className="try-cta">
            Check mailbox <Icon name="arrowRight" size={15} />
          </span>
        </Link>

        <Link to="/simulate" className="try-card try-card-primary">
          <span className="try-icon">
            <Icon name="sparkles" size={22} />
          </span>
          <h3>RFP Simulation</h3>
          <p>
            Paste in a raw RFP email (<code>POST /rfp-simulation</code>) and run the full
            classifier → manager agent → subagent pipeline live, end to end.
          </p>
          <span className="try-cta">
            Run a simulation <Icon name="arrowRight" size={15} />
          </span>
        </Link>
      </div>
    </div>
  )
}
