import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTurn } from '../api.js'

export default function ChatComposer({ conversationId }) {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (instructionText) => createTurn(conversationId, instructionText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', String(conversationId)] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setText('')
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || mutation.isPending) return
    mutation.mutate(trimmed)
  }

  return (
    <div className="chat-composer">
      {mutation.isError && (
        <div className="alert alert-danger" style={{ marginBottom: '10px' }}>
          <span>{mutation.error.message}</span>
        </div>
      )}
      <form className="chat-composer-form" onSubmit={onSubmit}>
        <textarea
          className="input chat-composer-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Talk to this conversation — “change the price a bit”, “explain this to the client”…"
          aria-label="Message"
          disabled={mutation.isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit(e)
            }
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending || !text.trim()}>
          {mutation.isPending ? 'Thinking…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
