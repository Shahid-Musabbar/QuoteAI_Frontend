import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createConversationFromGmail, createConversationFromPaste, listGmailMessages } from '../api.js'

const SAMPLE_EMAIL = `Hi team, we are Acme Manufacturing and we'd like to request a formal quote/proposal for 5000 units of steel brackets for our upcoming assembly line project. Please send pricing and terms. Thanks!`

export default function NewConversationPrompt() {
  const [tab, setTab] = useState('sim')
  const [rfp, setRfp] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: gmailData,
    isFetching: gmailLoading,
    error: gmailListError,
    refetch: loadGmailMessages,
  } = useQuery({
    queryKey: ['gmail-messages'],
    queryFn: listGmailMessages,
    enabled: false,
  })

  function onConversationCreated(conversation) {
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    navigate(`/demo/${conversation.id}`)
  }

  const pasteMutation = useMutation({
    mutationFn: createConversationFromPaste,
    onSuccess: onConversationCreated,
  })

  const gmailMutation = useMutation({
    mutationFn: createConversationFromGmail,
    onSuccess: onConversationCreated,
  })

  function runSim(e) {
    e.preventDefault()
    if (pasteMutation.isPending) return
    if (!rfp.trim()) {
      setRfp(SAMPLE_EMAIL)
      return
    }
    pasteMutation.mutate(rfp)
  }

  return (
    <>
      <div className="demo-hero">
        <span className="kicker">New RFQ</span>
        <h1 className="page-title">Bring in a request.</h1>
        <p className="page-lead">
          Paste a raw RFQ email, or pull one from your connected Gmail inbox — either starts a new
          conversation you can keep talking to afterward.
        </p>
        <div className="demo-tabs">
          <button type="button" className={tab === 'poll' ? 'active' : ''} onClick={() => setTab('poll')}>
            Mail polling
          </button>
          <button type="button" className={tab === 'sim' ? 'active' : ''} onClick={() => setTab('sim')}>
            Paste an email
          </button>
        </div>
      </div>

      {tab === 'poll' && (
        <div className="demo-body mail">
          <div className="card">
            <p className="card-kicker">Mail polling</p>
            <h3 className="card-title">Check your Gmail inbox for new RFQs</h3>
            <p className="card-body">
              Calls <code>GET /gmail/messages</code> using your connected Google account, then
              lets you turn any message into a conversation.
            </p>
            <div className="mail-note">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => loadGmailMessages()}
                disabled={gmailLoading}
              >
                {gmailLoading ? 'Checking inbox…' : gmailData ? 'Check again' : 'Check my inbox'}
              </button>
            </div>
          </div>

          {(gmailListError || gmailMutation.error) && (
            <div className="alert alert-danger" style={{ marginTop: '24px' }}>
              <span>{(gmailListError || gmailMutation.error).message}</span>
            </div>
          )}

          {gmailData && (
            <div className="mail-result">
              {gmailData.messages.length === 0 && <p>No messages found in the inbox.</p>}
              {gmailData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className="mail-result-row"
                  style={{ cursor: gmailMutation.isPending ? 'default' : 'pointer', alignItems: 'flex-start' }}
                  onClick={() => !gmailMutation.isPending && gmailMutation.mutate(msg.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="label">{msg.subject}</span>
                    <span style={{ fontSize: '13px' }}>{msg.from} · {msg.date}</span>
                    <span style={{ fontSize: '13.5px' }}>{msg.snippet}</span>
                  </div>
                  <span className="badge badge-neutral">
                    {gmailMutation.isPending && gmailMutation.variables === msg.id
                      ? 'Processing…'
                      : 'Start conversation'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'sim' && (
        <div className="demo-body sim">
          <div className="card">
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
              <p className="card-kicker" style={{ margin: 0 }}>RFQ email content</p>
              <a onClick={() => setRfp(SAMPLE_EMAIL)} style={{ cursor: 'pointer', fontSize: '14px' }}>
                Load sample RFQ
              </a>
            </div>
            <form onSubmit={runSim}>
              <textarea
                className="input rfp-textarea"
                value={rfp}
                onChange={(e) => setRfp(e.target.value)}
                placeholder="Paste the raw RFQ / quote-request email here…"
                aria-label="RFQ email content"
                disabled={pasteMutation.isPending}
              />
              <div style={{ marginTop: '28px' }}>
                <button type="submit" className="btn btn-primary btn-block" disabled={pasteMutation.isPending}>
                  {pasteMutation.isPending
                    ? 'Agents working…'
                    : rfp.trim()
                      ? 'Start conversation'
                      : 'Load sample & run'}
                </button>
              </div>
            </form>
            {pasteMutation.isError && (
              <div className="alert alert-danger" style={{ marginTop: '14px' }}>
                <span>{pasteMutation.error.message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
