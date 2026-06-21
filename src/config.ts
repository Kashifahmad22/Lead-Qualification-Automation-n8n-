// ============================================================
//  DEV2SCALE — AI LEAD QUALIFICATION DEMO
//  Configuration
// ============================================================
//  Everything you need to wire up the demo lives in this file.
// ------------------------------------------------------------

/**
 * 1. Your n8n webhook.
 *    On submit, the form sends a POST request with the lead payload here.
 *    Replace this with your n8n "Webhook" node Production URL.
 */
export const WEBHOOK_URL = 'https://bizzrow.app.n8n.cloud/webhook-test/lead-qualification'

/**
 * 2. Booking link.
 *    Where the "Book Strategy Session" button sends a strong-fit applicant.
 *    (Placeholder — swap in your real Calendly link.)
 */
export const CALENDLY_URL = 'https://calendly.com/mkkashif2002/30min'

/**
 * 2b. "Return Home" link.
 *     Where the "Application Received" screen's Return Home button points
 *     (your homepage). Placeholder — swap in your real link.
 */
export const HOME_URL = 'https://dev2scale.com'

/**
 * 3. Demo safety net.
 *    When true, if the webhook is unreachable (not wired up yet, CORS,
 *    offline, etc.) the app falls back to a realistic mock response so the
 *    demo ALWAYS reaches the success screen on camera.
 *    Set to false once your webhook is live and you want real errors surfaced.
 */
export const USE_MOCK_FALLBACK = true

/** Response used by the fallback above + when previewing the success screen. */
export const MOCK_RESPONSE = {
  qualified: true,
  score: 8,
  message: 'Great fit. Book a strategy call.',
} as const

// ------------------------------------------------------------
//  Dropdown options (edit freely)
// ------------------------------------------------------------

export const BUSINESS_TYPE_OPTIONS = [
  'Business Coach',
  'Marketing Coach',
  'Sales Coach',
  'Consultant',
  'Agency Owner',
  'Other',
] as const

export const MONTHLY_REVENUE_OPTIONS = ['Under $5k', '$5k-$20k', '$20k+'] as const

export const TIMELINE_OPTIONS = ['This Week', 'This Month', 'Just Exploring'] as const
