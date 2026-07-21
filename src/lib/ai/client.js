/**
 * Browser-side AI client. Talks to the /api/ai serverless proxy so the API key
 * stays server-side. Every call is best-effort: on timeout, network error, or
 * an unconfigured backend it resolves to null and callers fall back to
 * templates. Keeps the typewriter snappy via a short abort timeout.
 */

const ENDPOINT = '/api/ai'
const CLIENT_TIMEOUT_MS = 4000

// Runtime kill switch so a flaky/absent backend stops adding latency after it
// has already failed once in this session.
let aiDisabled = false

export function isAIDisabled() {
  return aiDisabled
}

export function resetAIState() {
  aiDisabled = false
}

/**
 * @param {{ system?: string, user: string, maxTokens?: number, temperature?: number, timeoutMs?: number }} req
 * @returns {Promise<string|null>} model text, or null to signal fallback
 */
export async function requestAI(req) {
  if (aiDisabled) return null
  if (!req?.user) return null

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    req.timeoutMs ?? CLIENT_TIMEOUT_MS,
  )

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: req.system,
        user: req.user,
        maxTokens: req.maxTokens,
        temperature: req.temperature,
      }),
      signal: controller.signal,
    })

    // 503 = backend not configured (e.g. local dev). Disable for the session.
    if (res.status === 503) {
      aiDisabled = true
      return null
    }
    if (!res.ok) return null

    const data = await res.json()
    const text = typeof data?.text === 'string' ? data.text.trim() : ''
    return text || null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
