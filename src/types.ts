// Shared types for the lead qualification flow.

/** The exact payload shape POSTed to the webhook. */
export interface LeadFormData {
  name: string
  email: string
  phone: string
  businessType: string
  monthlyRevenue: string
  challenge: string
  timeline: string
}

/** The response we expect back from the n8n workflow.
 *  `score` and `reason` are internal signals (never shown to the lead);
 *  `bookingLink` is the Calendly URL the webhook returns for qualified leads. */
export interface QualificationResponse {
  qualified: boolean
  score: number
  reason: string
  bookingLink: string | null
}

/** Which screen the app is currently showing. */
export type View = 'form' | 'loading' | 'success' | 'error'
