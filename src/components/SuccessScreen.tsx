import { motion } from 'framer-motion'
import { CALENDLY_URL, HOME_URL } from '../config'
import type { QualificationResponse } from '../types'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const SESSION_BENEFITS = [
  'Discuss your growth goals',
  'Identify current bottlenecks',
  'Explore automation opportunities',
  'Get personalized recommendations',
]

function ResetLink({ onReset }: { onReset: () => void }) {
  return (
    <motion.button
      variants={item}
      onClick={onReset}
      className="mt-5 text-[13px] font-medium text-white/40 transition-colors hover:text-white/70"
    >
      ← Start over
    </motion.button>
  )
}

/**
 * Applicant-facing result. Branches on the qualification signal from the
 * workflow, but never surfaces internal metrics (score, status, "AI", etc.).
 */
export default function SuccessScreen({
  response,
  onReset,
}: {
  response: QualificationResponse
  onReset: () => void
}) {
  // Application received (not qualified) — polite, no internal signals
  if (!response.qualified) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center text-center">
        <motion.div variants={item} className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/[0.06] blur-md" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-ink-700/60">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="text-white/70">
              <path d="M4 7.5l8 5 8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </div>
        </motion.div>

        <motion.h2 variants={item} className="text-2xl font-bold tracking-tight text-white">
          Application Received
        </motion.h2>
        <motion.p variants={item} className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
          Thank you for your interest. We'll review your information and reach out if it looks like there's a strong fit.
        </motion.p>

        <motion.a
          variants={item}
          href={HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[15px] font-semibold text-white/90 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
        >
          Return Home
        </motion.a>

        <ResetLink onReset={onReset} />
      </motion.div>
    )
  }

  // Great fit (qualified) — invite to book
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center text-center">
      <motion.div variants={item} className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-brand-gradient opacity-60 blur-lg"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25 }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.h2 variants={item} className="text-[26px] font-bold leading-tight tracking-tight text-white">
        You're A Great Fit <span className="align-middle">🎉</span>
      </motion.h2>
      <motion.p variants={item} className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
        Based on your application, we'd love to learn more about your business. The next step is booking a strategy
        session.
      </motion.p>

      {/* Session benefits */}
      <motion.div variants={item} className="mt-6 grid w-full grid-cols-2 gap-2.5">
        {SESSION_BENEFITS.map((b) => (
          <div
            key={b}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[12.5px] font-medium leading-snug text-white/80">{b}</span>
          </div>
        ))}
      </motion.div>

      {/* Premium booking card */}
      <motion.div
        variants={item}
        className="mt-5 w-full rounded-2xl border border-brand-blue/25 bg-gradient-to-br from-brand-blue/[0.10] to-brand-orange/[0.05] p-5 text-left"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue-light">Your Next Step</p>
        <h3 className="mt-1.5 text-[19px] font-bold tracking-tight text-white">Book Your Strategy Session</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">
          Pick a time that works for you. We'll review your business live and map out the highest-impact next steps
          together.
        </p>

        <motion.a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative mt-4 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-brand-gradient px-6 py-3.5 text-[15.5px] font-semibold text-white shadow-glow transition-shadow duration-300 hover:shadow-[0_0_50px_-8px_rgba(46,144,255,0.7)]"
        >
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            aria-hidden
          />
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="relative">
            <path
              d="M8 2v3M16 2v3M3.5 9h17M5 5h14a1.5 1.5 0 011.5 1.5V19A1.5 1.5 0 0119 20.5H5A1.5 1.5 0 013.5 19V6.5A1.5 1.5 0 015 5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="relative">Book Strategy Session</span>
        </motion.a>

        <p className="mt-3 text-center text-[12px] text-white/40">Free 30-minute session · No obligation</p>
      </motion.div>

      <ResetLink onReset={onReset} />
    </motion.div>
  )
}
