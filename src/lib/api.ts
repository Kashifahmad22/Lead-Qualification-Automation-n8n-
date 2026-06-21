import { MOCK_RESPONSE, USE_MOCK_FALLBACK, WEBHOOK_URL } from '../config'
import type { LeadFormData, QualificationResponse } from '../types'

/**
 * n8n responses come back in a few shapes depending on how the workflow is
 * built (a bare object, an array of items, or wrapped under `json` / `output`).
 * This pulls the { qualified, score, message } fields out of any of them.
 */
function normalize(raw: unknown): QualificationResponse {
  let data: any = raw

  if (Array.isArray(data)) data = data[0]
  if (data && typeof data === 'object') {
    if ('json' in data) data = data.json
    else if ('output' in data) data = data.output
    else if ('body' in data) data = data.body
  }
  data = data ?? {}

  const score = Number(data.score)

  return {
    qualified: Boolean(data.qualified),
    score: Number.isFinite(score) ? score : 0,
    message: typeof data.message === 'string' ? data.message : 'Recommendation unavailable.',
  }
}

/**
 * Sends the lead to the webhook and returns a normalized response.
 * Falls back to a mock response when USE_MOCK_FALLBACK is enabled and the
 * request fails — keeps the demo flowing even before n8n is connected.
 */
export async function qualifyLead(form: LeadFormData): Promise<QualificationResponse> {
  const payload: LeadFormData = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    businessType: form.businessType,
    monthlyRevenue: form.monthlyRevenue,
    challenge: form.challenge,
    timeline: form.timeline,
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error(`Webhook responded with ${res.status}`)

    // Some n8n "Respond to Webhook" setups return an empty body.
    const text = await res.text()
    if (!text) {
      if (USE_MOCK_FALLBACK) return { ...MOCK_RESPONSE }
      throw new Error('Webhook returned an empty response.')
    }

    return normalize(JSON.parse(text))
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
      // eslint-disable-next-line no-console
      console.warn('[Dev2Scale] Webhook unreachable, using mock response.', err)
      return { ...MOCK_RESPONSE }
    }
    throw err
  }
}
