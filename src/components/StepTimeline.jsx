import { useState } from 'react'

const STEP_TYPE_LABELS = {
  llm: 'LLM step',
  deterministic: 'Deterministic code',
  human: 'Human / output',
}

const AGENT_LABELS = {
  classifier: 'RFP classifier',
  extractor: 'Info extractor',
  erp_data: 'ERP data agent',
  market_data: 'Market pricing data agent',
  history_data: 'Pricing history data agent',
  cash_flow: 'Cash flow agent',
  sales_target: 'Sales target agent',
  erp: 'ERP costing agent',
  analyzer: 'Market analyzer agent',
  cashflow: 'Cash flow agent',
  target: 'Sales target agent',
  quote_manager: 'Quote & report manager',
  pricing_engine: 'Pricing engine',
  rationale_writer: 'Rationale writer',
  router: 'Reviewer / router',
  pdf_generator: 'PDF generator',
  gmail_draft: 'Gmail draft',
  human_review: 'Human review',
}

function stepOutputPreview(output) {
  if (output == null) return ''
  if (typeof output === 'string') return output
  try {
    return JSON.stringify(output, null, 2)
  } catch {
    return String(output)
  }
}

export function StepTypeLegend() {
  return (
    <div className="step-legend">
      {Object.entries(STEP_TYPE_LABELS).map(([type, label]) => (
        <span key={type} className={`step-legend-item step-type-${type}`}>
          <span className="step-legend-swatch" />
          {label}
        </span>
      ))}
    </div>
  )
}

function StepItem({ step }) {
  const [open, setOpen] = useState(false)
  const label = AGENT_LABELS[step.agent_name] || step.agent_name

  return (
    <li className={`step-item step-type-${step.step_type}`}>
      <span className="step-item-marker" />
      <div className="step-item-body">
        <button
          type="button"
          className="step-item-header"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className={`step-item-chevron${open ? ' open' : ''}`}>⌄</span>
          <span className="step-item-title">{label}</span>
        </button>
        {open && <pre className="step-item-output">{stepOutputPreview(step.output)}</pre>}
      </div>
    </li>
  )
}

export default function StepTimeline({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <ol className="step-timeline">
      {steps.map((step) => (
        <StepItem key={step.id ?? `${step.agent_name}-${step.step_index}`} step={step} />
      ))}
    </ol>
  )
}
