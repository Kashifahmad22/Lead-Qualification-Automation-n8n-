import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Step = { label: string; title: string; icon: ReactNode }

const STEPS: Step[] = [
  {
    label: 'Step 1',
    title: 'Submit Your Application',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Step 2',
    title: 'We Review Your Information',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Step 3',
    title: 'Qualified Applicants Receive A Strategy Session',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 2v3M16 2v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/** "What Happens Next?" — a 3-step process timeline shown below the form. */
export default function ProcessSteps() {
  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <h3 className="text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-white/45">
        What Happens Next?
      </h3>
      <motion.ol
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-4 flex flex-col gap-2.5"
      >
        {STEPS.map((s) => (
          <motion.li
            key={s.label}
            variants={item}
            className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange/25 to-brand-blue/25 text-white ring-1 ring-white/10">
              {s.icon}
            </span>
            <div className="text-left">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-brand-blue-light">{s.label}</p>
              <p className="text-[13.5px] font-medium leading-snug text-white/85">{s.title}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
