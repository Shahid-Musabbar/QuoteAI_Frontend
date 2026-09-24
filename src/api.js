const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// All product endpoints require a signed-in session, so every call here carries
// the session cookie.
async function requestWithCredentials(path, options) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options })
  } catch {
    throw new Error(
      `Could not reach the API at ${API_BASE}${path}. Is the FastAPI backend running (uvicorn main:app --reload)?`,
    )
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`)
  }

  return res.json()
}

function getJSON(path) {
  return requestWithCredentials(path, { method: 'GET' })
}

function authedPostJSON(path, body) {
  return requestWithCredentials(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
}

export function getMe() {
  return getJSON('/auth/me')
}

export function logout() {
  return authedPostJSON('/auth/logout')
}

export function listGmailMessages() {
  return getJSON('/gmail/messages')
}

export function listConversations() {
  return getJSON('/conversations')
}

export function getConversation(conversationId) {
  return getJSON(`/conversations/${conversationId}`)
}

export function createConversationFromPaste(emailText) {
  return authedPostJSON('/conversations', { source: 'manual_paste', email_text: emailText })
}

export function createConversationFromGmail(gmailMessageId) {
  return authedPostJSON('/conversations', { source: 'gmail', gmail_message_id: gmailMessageId })
}

export function createTurn(conversationId, instructionText) {
  return authedPostJSON(`/conversations/${conversationId}/turns`, { instruction_text: instructionText })
}

export { API_BASE }
