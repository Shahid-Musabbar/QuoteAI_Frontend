const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function postJSON(path, body) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
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

export function checkMailbox() {
  return postJSON('/start')
}

export function runRfpSimulation(emailText) {
  return postJSON('/rfp-simulation', { email_text: emailText })
}

// Auth/Gmail calls carry the session cookie, so they need `credentials: 'include'`
// (the calls above don't require a session, so they're left as-is).
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

export function processGmailMessage(messageId) {
  return authedPostJSON(`/gmail/messages/${messageId}/process`)
}

export { API_BASE }
