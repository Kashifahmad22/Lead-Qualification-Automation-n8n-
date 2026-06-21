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

/** The response we expect back from the n8n workflow. */
export interface QualificationResponse {
  qualified: boolean
  score: number
  message: string
}

/** Which screen the app is currently showing. */
export type View = 'form' | 'loading' | 'success' | 'error'
