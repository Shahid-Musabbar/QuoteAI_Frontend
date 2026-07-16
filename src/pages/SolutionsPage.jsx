import { useNavigate } from 'react-router-dom'

const INDUSTRIES = [
  {
    title: 'Manufacturing',
    desc: 'Custom fabrication lives and dies on material and machine-hour costing. The ERP agent prices the bill of materials line by line; the sales-target agent protects the minimum margin your quarter depends on.',
    path: 'RFQ → BOM costing → margin-safe quote',
  },
  {
    title: 'Distribution & wholesale',
    desc: "Volume deals turn on market position and the customer's own history. The market analyzer compares competitor ranges and past accepted prices, so bulk discounts stop being guesswork.",
    path: 'Volume RFP → market range → tiered pricing',
  },
  {
    title: 'Industrial services',
    desc: "Long projects strain cash before they pay. The cash-flow agent sizes deposits and milestone payments to your runway, so the deal you win doesn't become the deal that sinks the quarter.",
    path: 'Tender → payment terms → protected runway',
  },
]

export default function SolutionsPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="page-hero">
        <span className="kicker">Solutions</span>
        <h1 className="page-title">Every industry prices differently. The agents learn yours.</h1>
        <p className="page-lead">
          The four specialists read from your systems — your ERP, your quote history, your cash
          position, your targets — so the recommendation reflects your economics, not an industry
          average.
        </p>
      </div>

      <hr className="rule" />

      <div className="solutions-grid">
        {INDUSTRIES.map((item) => (
          <div key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <p className="path">{item.path}</p>
          </div>
        ))}
      </div>

      <hr className="rule" />

      <div className="accent-panel audience-panel">
        <div>
          <span className="kicker">For CFOs</span>
          <h2>Nothing leaves without your signature</h2>
          <p>
            Every quote arrives with its full rationale: the cost floor, the market range, the
            cash-flow terms, and the risk flags. Approve it, override the price, or send it back —
            the audit trail keeps every decision.
          </p>
        </div>
        <div>
          <span className="kicker">For sales teams</span>
          <h2>Answer the RFP the day it lands</h2>
          <p>
            No more waiting on finance for a number. The draft quote is ready in minutes, priced
            inside the guardrails finance already set — so the fastest response in the deal is
            yours.
          </p>
          <div style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
              Try the live demo
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
