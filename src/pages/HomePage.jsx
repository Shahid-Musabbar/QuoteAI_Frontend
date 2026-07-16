import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const PIPELINE_STEPS = [
  {
    icon: 'mail',
    title: 'Mailbox',
    desc: 'Inbound emails are polled from the connected inbox (currently mocked, ready for IMAP / Graph / Gmail API).',
  },
  {
    icon: 'checkCircle',
    title: 'RFP Classifier',
    desc: 'An LLM call decides YES/NO — is this actually a request for proposal or quote, or just noise?',
  },
  {
    icon: 'cpu',
    title: 'Quote & Report Manager',
    desc: 'A tool-calling agent that consults four specialist subagents, then synthesizes a final quote.',
    highlight: true,
  },
  {
    icon: 'checkCircle',
    title: 'CFO / Sales Review',
    desc: 'Human-in-the-loop step to approve the quote or override the recommended price before it goes out.',
  },
]

const SUBAGENTS = [
  {
    icon: 'server',
    name: 'ERP Costing Agent',
    tool: 'erp_costing_agent',
    desc: 'Looks up raw material, machinery, and labor cost for the requested product from the ERP system.',
  },
  {
    icon: 'target',
    name: 'Market Analyzer Agent',
    tool: 'market_analyzer_agent',
    desc: 'Researches competitor pricing and this customer’s past quoted prices to gauge a fair market range.',
  },
  {
    icon: 'cash',
    name: 'Cash Flow Agent',
    tool: 'cash_flow_agent',
    desc: 'Checks current cash position and runway, then recommends payment terms the business can safely take on.',
  },
  {
    icon: 'dollar',
    name: 'Sales Target Agent',
    tool: 'sales_target_agent',
    desc: 'Pulls monthly/yearly targets and minimum margin, and steers pricing to help hit them.',
  },
]

const OUTPUT_FIELDS = [
  { label: 'Price', desc: 'Recommended final unit / order price' },
  { label: 'Rationale', desc: 'Why that price — cost, market, cash flow, and target reasoning' },
  { label: 'Suggested payment terms', desc: 'Deposit / milestone structure sized to cash flow risk' },
  { label: 'Risk flags', desc: 'Anything that could jeopardize margin, cash, or the deal' },
]

const STACK = ['LangChain', 'FastAPI', 'GPT-5 mini', 'Pydantic', 'React']

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero-panel">
        <span className="eyebrow">
          <Icon name="sparkles" size={14} /> Multi-agent RFP pricing
        </span>
        <h2 className="hero-title">
          Turn an inbound RFP email into a CFO-ready quote — automatically.
        </h2>
        <p className="hero-copy">
          This is a small LangChain-powered pricing desk. A classifier decides whether an email is
          really an RFP, then a manager agent calls four specialist subagents — ERP costing, market
          pricing, cash flow, and sales targets — before producing a final recommended price,
          rationale, payment terms, and risk flags for a human to review.
        </p>
        <div className="hero-actions">
          <Link to="/try" className="btn btn-primary">
            Try Now <Icon name="arrowRight" size={16} />
          </Link>
          <a
            className="btn btn-ghost"
            href="#pipeline"
          >
            See how it works
          </a>
        </div>
      </section>

      <section id="pipeline" className="section">
        <h3 className="section-title">Pipeline</h3>
        <div className="pipeline">
          {PIPELINE_STEPS.map((step, i) => (
            <div className="pipeline-step-wrap" key={step.title}>
              <div className={`pipeline-step${step.highlight ? ' highlight' : ''}`}>
                <span className="pipeline-icon">
                  <Icon name={step.icon} size={18} />
                </span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="pipeline-arrow">
                  <Icon name="arrowRight" size={16} />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">Inside the manager agent — four subagent tools</h3>
        <div className="card-grid">
          {SUBAGENTS.map((agent) => (
            <div className="card subagent-card" key={agent.tool}>
              <span className="card-icon">
                <Icon name={agent.icon} size={18} />
              </span>
              <h4>{agent.name}</h4>
              <p>{agent.desc}</p>
              <code className="tool-tag">{agent.tool}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">What you get back</h3>
        <div className="output-preview">
          {OUTPUT_FIELDS.map((field, i) => (
            <div className="output-row" key={field.label}>
              <span className="output-index">{i + 1}</span>
              <div>
                <strong>{field.label}</strong>
                <p>{field.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section stack-section">
        <h3 className="section-title">Built with</h3>
        <div className="stack-row">
          {STACK.map((item) => (
            <span className="stack-badge" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h3>Ready to see it price a real RFP?</h3>
          <p>Run a live mailbox check, or paste in an email and watch the agents work.</p>
        </div>
        <Link to="/try" className="btn btn-primary">
          Try Now <Icon name="arrowRight" size={16} />
        </Link>
      </section>
    </div>
  )
}
