import { MOCK_RESPONSE, USE_MOCK_FALLBACK, WEBHOOK_URL } from '../config'
import type { LeadFormData, QualificationResponse } from '../types'

/** Case-insensitive lookup of any of `keys` on a plain object. */
function pickCI(obj: Record<string, any>, keys: string[]): unknown {
  for (const k of Object.keys(obj)) if (keys.includes(k.toLowerCase())) return obj[k]
  return undefined
}

/**
 * Finds the first (case-insensitive) scalar value for any of `keys`, searching
 * nested objects/arrays. This lets us read the fields no matter how n8n wraps
 * the response — top-level, an array of items, or values nested under
 * `json` / `data` / `result` / `body` envelopes, with any key casing.
 */
function deepFind(node: any, keys: string[], depth = 0): unknown {
  if (node == null || typeof node !== 'object' || depth > 6) return undefined
  const direct = pickCI(node, keys)
  if (direct !== undefined && (typeof direct !== 'object' || direct === null)) return direct
  for (const v of Object.values(node)) {
    if (v && typeof v === 'object') {
      const found = deepFind(v, keys, depth + 1)
      if (found !== undefined) return found
    }
  }
  return undefined
}

/** Coerce assorted truthy encodings: true / "true" / "yes" / 1 / "qualified". */
function coerceBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v > 0
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    return s === 'true' || s === 'yes' || s === 'y' || s === '1' || s === 'qualified'
  }
  return false
}

const BOOKING_KEYS = [
  'bookinglink', 'booking_link', 'bookingurl', 'booking_url',
  'calendlyurl', 'calendly_url', 'calendlylink', 'calendly',
]

/** Pull the booking URL out of the response, by key or by URL shape. */
function findBookingLink(obj: any): string | null {
  const specific = deepFind(obj, BOOKING_KEYS)
  if (typeof specific === 'string' && specific.trim()) return specific.trim()
  // Last resort: any string that clearly looks like a booking URL.
  let found: string | null = null
  const scan = (node: any, depth: number) => {
    if (found || node == null || typeof node !== 'object' || depth > 6) return
    for (const v of Object.values(node)) {
      if (typeof v === 'string' && /^https?:\/\//i.test(v) && /calendly|cal\.com|book/i.test(v)) {
        found = v.trim()
        return
      }
      if (v && typeof v === 'object') scan(v, depth + 1)
    }
  }
  scan(obj, 0)
  return found
}

/**
 * Maps any reasonable n8n response shape into our QualificationResponse.
 * Exported so it can be unit-tested against real payloads.
 */
export function normalize(raw: unknown): QualificationResponse {
  // Peel arrays and single-key envelopes down to the data object.
  let root: any = raw
  for (let i = 0; i < 6; i++) {
    if (Array.isArray(root)) {
      root = root[0]
      continue
    }
    if (root && typeof root === 'object') {
      const keys = Object.keys(root)
      if (keys.length === 1 && root[keys[0]] && typeof root[keys[0]] === 'object') {
        root = root[keys[0]]
        continue
      }
    }
    break
  }
  const obj = root && typeof root === 'object' ? root : {}

  const score = Number(deepFind(obj, ['score', 'leadscore', 'lead_score']))
  const reason = deepFind(obj, ['reason', 'message', 'recommendation', 'summary'])

  return {
    qualified: coerceBool(deepFind(obj, ['qualified', 'isqualified', 'is_qualified'])),
    score: Number.isFinite(score) ? score : 0,
    reason: typeof reason === 'string' ? reason : '',
    bookingLink: findBookingLink(obj),
  }
}

/**
 * Sends the lead to the webhook and returns a normalized response.
 * Falls back to a mock response ONLY when the request itself fails and
 * USE_MOCK_FALLBACK is enabled — a successful (200 + body) response is always
 * used as-is, never overridden by the mock.
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

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('Webhook response was not valid JSON.')
    }

    const result = normalize(parsed)
    // Diagnostics: see exactly what the webhook sent vs. what the UI will use.
    // eslint-disable-next-line no-console
    console.info('[Dev2Scale] webhook raw:', parsed, '→ normalized:', result)
    return result
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
      // eslint-disable-next-line no-console
      console.warn('[Dev2Scale] Webhook unreachable — using mock response.', err)
      return { ...MOCK_RESPONSE }
    }
    throw err
  }
}
