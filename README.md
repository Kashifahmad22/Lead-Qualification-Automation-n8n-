# Free Business Growth Strategy Session

A single-page React **lead-capture funnel** a coach, consultant, or agency can put in
front of their own prospects. A lead applies for a free strategy session; their answers
POST to an **n8n webhook** that qualifies them; then a premium, application-style result
either invites a qualified lead to book a session or politely confirms the application was
received. Built to look polished enough to record in a Loom sales demo — a real prospect
should believe it's a genuine application form, not an AI demo.

> The person filling this out is the **lead**, not the coach. Internal signals (score,
> qualification status) are never shown to them. One focused flow — application form →
> review → result. Not a website, landing page, or dashboard.

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** (dark theme, Dev2Scale blue/orange brand palette)
- **Framer Motion** (entrance, state transitions, loading + score animations)

---

## Quick start

```bash
npm install
npm run dev
```

Vite prints a local URL (default http://localhost:5173) and opens it automatically.

To build for production:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

---

## Configuration — `src/config.ts`

Everything you need to wire up the demo lives in one file:

| Constant | What it does |
| --- | --- |
| `WEBHOOK_URL` | Your n8n **Webhook** node Production URL. The form POSTs the lead here. |
| `CALENDLY_URL` | Where the **Book Strategy Session** button sends a strong-fit applicant (placeholder Calendly link). |
| `HOME_URL` | Where the "Application Received" screen's **Return Home** button points (placeholder). |
| `USE_MOCK_FALLBACK` | When `true`, if the webhook is unreachable the app falls back to a mock response so the demo always reaches the results screen on camera. Set `false` once the webhook is live and you want real errors surfaced. |
| `MOCK_RESPONSE` | The response used by the fallback above. |

The dropdown option lists (`BUSINESS_TYPE_OPTIONS`, `MONTHLY_REVENUE_OPTIONS`,
`TIMELINE_OPTIONS`) live in the same file — edit them freely.

---

## Webhook contract

**Request** — `POST {WEBHOOK_URL}`, `Content-Type: application/json`:

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "phone": "(555) 123-4567",
  "businessType": "Agency Owner",
  "monthlyRevenue": "$20k+",
  "challenge": "Scaling client delivery without burning out my team.",
  "timeline": "This Week"
}
```

**Expected response** — JSON:

```json
{
  "qualified": true,
  "score": 12,
  "reason": "Strong revenue and an urgent timeline.",
  "bookingLink": "https://calendly.com/your-handle/strategy"
}
```

The results screen branches on `qualified`: `true` → the "You're A Great Fit" booking
screen, `false` → the "Application Received" screen. The **Book Strategy Session** button
uses the returned `bookingLink` (falling back to `CALENDLY_URL` when the response omits
it). `score` and `reason` are received but treated as internal and are never shown to the
lead.

The mapper in `src/lib/api.ts` is **shape- and case-tolerant**: it extracts `qualified`,
`score`, `reason`, and `bookingLink` whether they arrive as a bare object, an array of
items (`[ { ... } ]`), or nested under `json` / `data` / `result` / `body` envelopes, and
whether keys are lowercase or capitalized. `qualified` accepts `true`, `"true"`, `1`, or
`"yes"`. This is why a correct 200 response always drives the right screen.

### n8n setup notes

1. Add a **Webhook** node (HTTP method `POST`). Copy its Production URL into `WEBHOOK_URL`.
2. Do your scoring/qualification logic in the workflow.
3. End with a **Respond to Webhook** node that returns the JSON above.
4. **CORS:** the browser calls the webhook directly. Make sure the webhook response
   includes `Access-Control-Allow-Origin` (e.g. `*` for the demo). In n8n you can set
   response headers on the *Respond to Webhook* node. While `USE_MOCK_FALLBACK` is `true`,
   the demo still works on camera even if CORS/connectivity isn't set up yet.

**Intended pipeline (what the front end is designed around):**

```
Lead submits form → Webhook → AI qualification → lead scoring →
Google Sheet / CRM → coach notification → qualified? → reveal booking link
```

The front end only needs the `qualified` flag back to decide which screen to show. All
scoring, storage, and notifications happen inside n8n — the lead never sees any of it.

---

## Project structure

```
dev2scale-lead-demo/
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ vite.config.ts
├─ public/
│  └─ favicon.png
└─ src/
   ├─ main.tsx                 # React entry
   ├─ App.tsx                  # state machine: form → loading → success/error
   ├─ index.css                # Tailwind + base styles, brand keyframes
   ├─ config.ts                # WEBHOOK_URL, CALENDLY_URL, HOME_URL, options, mock
   ├─ types.ts                 # LeadFormData, QualificationResponse, View
   ├─ lib/
   │  └─ api.ts                # POST + response normalization + mock fallback
   ├─ assets/
   │  └─ dev2scale-logo.png    # brand logo (shown via mix-blend-mode: screen)
   └─ components/
      ├─ Background.tsx         # ambient brand glows + grid
      ├─ Logo.tsx
      ├─ Dropdown.tsx           # custom animated select
      ├─ LeadForm.tsx           # the 7-field application form
      ├─ ProcessSteps.tsx       # "What Happens Next?" 3-step section below the form
      ├─ LoadingState.tsx       # animated "reviewing application" sequence
      ├─ SuccessScreen.tsx      # branching result (great fit / received) + booking card
      └─ ErrorScreen.tsx        # shown only when fallback is off and webhook fails
```

---

## Demo behavior notes

- The loading sequence plays for a minimum of ~4.3s so all four messages
  (`Reviewing Application…`, `Analyzing Business Goals…`,
  `Checking Qualification Criteria…`, `Preparing Recommendation…`) are visible, even if the
  webhook responds instantly.
- The results screen branches on the webhook's `qualified` flag; internal metrics are
  never shown to the lead.
- Branding (blue `#2E90FF`, orange `#FF8A2B`, gradient accents) is defined in
  `tailwind.config.js` and `src/index.css`.
