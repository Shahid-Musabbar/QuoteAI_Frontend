import { useNavigate } from 'react-router-dom'
import { goHomeContact } from '../utils/navigation.js'

const CUSTOMIZATIONS = [
  {
    title: 'Inboxes & volume',
    desc: 'Connect one mailbox or many, and scale from a handful of RFPs a month to however many your pipeline actually sends.',
  },
  {
    title: 'Specialist agents',
    desc: 'Turn on just ERP costing and market analysis, or run the full desk — cost, market, cash flow, and sales targets working together.',
  },
  {
    title: 'Approvals & audit',
    desc: 'A single human review step by default, or a full approval workflow with role-based sign-off and a complete audit trail.',
  },
  {
    title: 'ERP & integrations',
    desc: 'CSV and API ingestion out of the box, with on-prem connectors for SAP, Dynamics, Odoo, and NetSuite when you need them.',
  },
  {
    title: 'Support & rollout',
    desc: 'Email support to get started, or a dedicated success manager helping wire the ERP costing agent to your item master.',
  },
]

export default function PricingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="page-hero">
        <span className="kicker">Pricing</span>
        <h1 className="page-title">Built around your desk, not a tier chart.</h1>
        <p className="page-lead">
          Every deployment is shaped around your inboxes, your ERP, and how many specialists you
          actually need running. Human review on every quote is never optional, on every plan.
        </p>
      </div>

      <hr className="rule" />

      <div className="specialists-grid" style={{ paddingTop: '56px' }}>
        {CUSTOMIZATIONS.map((item) => (
          <div className="card" key={item.title}>
            <h3 className="card-title" style={{ marginTop: 0 }}>
              {item.title}
            </h3>
            <p className="card-body">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="accent-panel contact-panel">
        <div>
          <h3>Tell us how you price</h3>
          <p>
            Bring your inbox volume, your ERP, and your review process — we&apos;ll shape a plan
            around them instead of the other way around.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => goHomeContact(navigate)}
          >
            Talk to sales
          </button>
        </div>
      </div>
    </>
  )
}
