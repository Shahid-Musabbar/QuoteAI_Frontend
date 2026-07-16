import { useNavigate } from 'react-router-dom'
import { goHomeContact } from '../utils/navigation.js'

const FAQS = [
  {
    q: 'Does QuoteAI send quotes automatically?',
    a: 'No. Every quote is a recommendation until a human approves it. The CFO / sales review step is built into the pipeline and cannot be switched off.',
  },
  {
    q: 'Which inboxes and ERPs does it connect to?',
    a: 'Mail: IMAP, Microsoft Graph (Outlook / M365), and the Gmail API. ERP: SAP, Dynamics, Odoo and NetSuite connectors on Enterprise; CSV and API ingestion on every plan.',
  },
  {
    q: 'How accurate is the classifier?',
    a: 'The classifier only routes — it never prices. A false positive costs you one glance at the review queue; a false negative stays in your inbox where it already was. Misclassifications can be corrected with one click, and corrections tune future routing.',
  },
  {
    q: 'Can I override the recommended price?',
    a: "Yes — at review you can accept, adjust, or replace the price. The override and its reason are kept in the audit trail beside the agents' original rationale.",
  },
  {
    q: 'Where does my data go?',
    a: 'Emails and ERP data are processed in your region, encrypted in transit and at rest, and never used to train shared models. Enterprise plans can pin processing to a private deployment.',
  },
  {
    q: "What happens if an email isn't an RFP?",
    a: 'Nothing. It is marked "not an RFP" and left alone. QuoteAI never replies to, moves, or deletes mail.',
  },
  {
    q: 'How long does setup take?',
    a: 'Connecting an inbox takes minutes. Wiring the ERP costing agent to your item master is the real work — typically one to two weeks with our team, less if your cost data is clean.',
  },
]

export default function FaqPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="page-hero" style={{ paddingBottom: '42px' }}>
        <span className="kicker">FAQ</span>
        <h1 className="page-title">Fair questions, plain answers.</h1>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <div className="faq-footer">
        <p>
          Something we didn&apos;t answer?{' '}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              goHomeContact(navigate)
            }}
          >
            Book a demo
          </a>{' '}
          and ask it in person.
        </p>
      </div>
    </>
  )
}
