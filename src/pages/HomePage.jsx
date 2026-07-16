import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PIPELINE_STEPS = [
  {
    n: '01',
    title: 'Mailbox',
    desc: 'Inbound mail is polled from the connected inbox — IMAP, Microsoft Graph, or the Gmail API.',
  },
  {
    n: '02',
    title: 'RFP classifier',
    desc: 'A single model call decides yes or no: is this actually a request for proposal, a quote, or just noise?',
  },
  {
    n: '03',
    title: 'Quote manager',
    desc: 'A tool-calling agent consults four specialist subagents, then synthesizes a final recommended quote.',
  },
  {
    n: '04',
    title: 'CFO review',
    desc: 'A human-in-the-loop step approves the quote — or overrides the price — before anything goes out.',
  },
]

const SPECIALISTS = [
  {
    tool: 'erp_costing_agent',
    title: 'ERP Costing',
    desc: 'Looks up raw material, machinery, and labor cost for the requested product from the ERP system — the floor beneath any price.',
  },
  {
    tool: 'market_analyzer_agent',
    title: 'Market Analyzer',
    desc: "Researches competitor pricing and this customer's past quoted prices to gauge a fair market range.",
  },
  {
    tool: 'cash_flow_agent',
    title: 'Cash Flow',
    desc: 'Checks current cash position and runway, then recommends payment terms the business can safely take on.',
  },
  {
    tool: 'sales_target_agent',
    title: 'Sales Target',
    desc: 'Pulls monthly and yearly targets with minimum margin, and steers pricing to help hit them.',
  },
]

const OUTPUTS = [
  { n: 1, title: 'Price', desc: 'The recommended final unit or order price.' },
  {
    n: 2,
    title: 'Rationale',
    desc: 'Why that price — cost, market, cash flow, and target reasoning, in writing.',
  },
  {
    n: 3,
    title: 'Payment terms',
    desc: 'A deposit and milestone structure sized to cash-flow risk.',
  },
  {
    n: 4,
    title: 'Risk flags',
    desc: 'Anything that could jeopardize margin, cash, or the deal itself.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <section className="hero">
        <h1>
          <span>Turn an inbound RFP email</span>
          <span>into a CFO-ready quote.</span>
        </h1>
        <p>
          QuoteAI is a multi-agent pricing desk. A classifier decides whether an email is really a
          request for proposal; a manager agent then consults four specialists — ERP costing,
          market pricing, cash flow, and sales targets — and returns a recommended price, its
          rationale, payment terms, and risk flags. A human approves every quote before it leaves
          the building.
        </p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
            Run the simulation
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/solutions')}>
            See how it works
          </button>
        </div>
      </section>

      <div className="stats" aria-label="QuoteAI, by the numbers">
        <div>
          <p className="stat-num gilt">4</p>
          <p className="stat-label">Specialist agents per quote</p>
        </div>
        <div>
          <p className="stat-num">2 min</p>
          <p className="stat-label">From inbox to draft quote</p>
        </div>
        <div>
          <p className="stat-num">100%</p>
          <p className="stat-label">Quotes reviewed by a human</p>
        </div>
        <div>
          <p className="stat-num">1</p>
          <p className="stat-label">Inbox to connect</p>
        </div>
      </div>

      <section className="pipeline-section">
        <span className="kicker">The pipeline</span>
        <h2 className="section-title">Four steps, one desk</h2>
        <div className="pipeline-grid">
          {PIPELINE_STEPS.map((step) => (
            <div className="pipeline-step" key={step.n}>
              <p className="num">{step.n}</p>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="specialists-section">
        <span className="kicker">Inside the manager</span>
        <h2 className="section-title">Four specialists, one recommendation</h2>
        <div className="specialists-grid">
          {SPECIALISTS.map((agent) => (
            <div className="card specialist-card" key={agent.tool}>
              <p className="card-kicker">{agent.tool}</p>
              <h3 className="card-title">{agent.title}</h3>
              <p className="card-body">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="output-section">
        <span className="kicker">What you get back</span>
        <div className="output-list">
          {OUTPUTS.map((field) => (
            <div className="output-row" key={field.n}>
              <span className="output-index">{field.n}</span>
              <h3>{field.title}</h3>
              <p>{field.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <figure className="quote-section">
        <blockquote>
          &ldquo;The quote used to take my sales lead a day and me an argument. Now it takes two
          minutes and a signature. The price is usually the one I would have fought for.&rdquo;
        </blockquote>
        <figcaption>— R. Menon, CFO, precision components manufacturer</figcaption>
      </figure>

      <hr className="rule" />

      <div className="accent-panel contact-panel" id="contact">
        <div>
          <h3>Book a demo</h3>
          <p>
            Thirty minutes with a real RFP from your inbox. We connect the mailbox, run the
            pipeline, and you watch the agents argue about your price.
          </p>
        </div>
        {!sent ? (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input className="input" type="text" placeholder="Your name" aria-label="Your name" required />
            <input className="input" type="email" placeholder="Work email" aria-label="Work email" required />
            <input className="input" type="text" placeholder="Company" aria-label="Company" required />
            <button type="submit" className="btn btn-primary">
              Request a demo
            </button>
          </form>
        ) : (
          <p className="contact-sent">Thank you — we will write back within one business day.</p>
        )}
      </div>
    </>
  )
}
