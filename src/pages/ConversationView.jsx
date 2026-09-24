import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getConversation } from '../api.js'
import StepTimeline, { StepTypeLegend } from '../components/StepTimeline.jsx'

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function ConversationView() {
  const { conversationId } = useParams()
  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
  })

  if (isLoading) return <p className="worklog-working">Loading conversation…</p>
  if (error) return <div className="alert alert-danger"><span>{error.message}</span></div>
  if (!conversation) return null

  return (
    <div className="conversation-view">
      <div className="conversation-view-header">
        <div>
          <p className="card-kicker">Quote AI</p>
          <h1 className="conversation-view-title">{conversation.title}</h1>
        </div>
        {conversation.status === 'ignored' && <span className="badge badge-neutral">Ignored — not an RFQ</span>}
      </div>

      <StepTypeLegend />

      {conversation.turns.map((turn) => (
        <div key={turn.id} className="conversation-turn">
          {turn.turn_index > 0 && turn.instruction_text && (
            <div className="conversation-turn-instruction">{turn.instruction_text}</div>
          )}

          <StepTimeline steps={turn.steps} />

          {turn.artifacts.map((artifact) => (
            <div className="card quote-result" key={artifact.id}>
              <p className="card-kicker">
                {artifact.kind === 'quote_draft' ? 'Recommended quote · awaiting review' : artifact.kind}
              </p>
              <p className="price">{formatPrice(artifact.recommended_price) ?? '—'}</p>
              <p>{artifact.rationale || 'No rationale returned.'}</p>
              <p className="terms">
                <span>Terms</span> — {artifact.payment_terms || 'No payment terms returned.'}
              </p>
              <p className="terms">
                <span>Risk flags</span> — {artifact.risk_flags || 'None flagged.'}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
