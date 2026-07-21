/**
 * Vercel serverless proxy for Google Gemini.
 *
 * Same key convention as ai-tutor:
 *   GOOGLE_API_KEY  required
 *   AI_MODEL        optional, default gemini-2.5-flash
 *
 * Request  (POST JSON): { system, user, maxTokens?, temperature? }
 * Response (200 JSON):  { text }
 * On any failure returns non-200 so the client falls back to templates.
 */

const DEFAULT_MODEL = 'gemini-2.5-flash'
const UPSTREAM_TIMEOUT_MS = 8000

function parseBody(req) {
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return null
    }
  }
  return body || {}
}

async function callGemini({ apiKey, model, system, user, maxTokens, temperature, signal }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
  const payload = {
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      // gemini-2.5-flash 預設會把 token 花在 thinking，短回覆容易變空字串
      thinkingConfig: { thinkingBudget: 0 },
    },
  }
  if (system) {
    payload.systemInstruction = { parts: [{ text: system }] }
  }

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!upstream.ok) {
    const err = new Error(`upstream_${upstream.status}`)
    err.status = upstream.status
    throw err
  }

  const data = await upstream.json()
  const parts = data?.candidates?.[0]?.content?.parts
  const text = Array.isArray(parts)
    ? parts
        .map((p) => p?.text || '')
        .join('')
        .trim()
    : ''
  return text
}

export async function runAiRequest(body, getApiKey = () => process.env.GOOGLE_API_KEY) {
  const apiKey = getApiKey()
  if (!apiKey) {
    const err = new Error('ai_not_configured')
    err.status = 503
    throw err
  }

  const { system, user, maxTokens = 160, temperature = 0.8 } = body || {}
  if (!user) {
    const err = new Error('missing_user_prompt')
    err.status = 400
    throw err
  }

  const model = process.env.AI_MODEL || DEFAULT_MODEL
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const text = await callGemini({
      apiKey,
      model,
      system,
      user,
      maxTokens,
      temperature,
      signal: controller.signal,
    })
    if (!text) {
      const err = new Error('empty_completion')
      err.status = 502
      throw err
    }
    return { text }
  } catch (err) {
    if (err?.name === 'AbortError') {
      const timeout = new Error('upstream_timeout')
      timeout.status = 504
      throw timeout
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const body = parseBody(req)
  if (body === null) {
    res.status(400).json({ error: 'bad_json' })
    return
  }

  try {
    const result = await runAiRequest(body)
    res.status(200).json(result)
  } catch (err) {
    const status = err?.status || (err?.message === 'ai_not_configured' ? 503 : 502)
    res.status(status).json({ error: err?.message || 'proxy_error' })
  }
}
