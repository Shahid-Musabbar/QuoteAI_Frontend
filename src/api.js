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

export { API_BASE }
