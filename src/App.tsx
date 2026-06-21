import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import Logo from './components/Logo'
import LeadForm from './components/LeadForm'
import ProcessSteps from './components/ProcessSteps'
import LoadingState from './components/LoadingState'
import SuccessScreen from './components/SuccessScreen'
import ErrorScreen from './components/ErrorScreen'
import { qualifyLead } from './lib/api'
import type { LeadFormData, QualificationResponse, View } from './types'

// Minimum time the loading animation plays so all four messages breathe,
// even if the webhook responds instantly.
const MIN_LOADING_MS = 4300

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const viewTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
}

export default function App() {
  const [view, setView] = useState<View>('form')
  const [response, setResponse] = useState<QualificationResponse | null>(null)
  const [lastData, setLastData] = useState<LeadFormData | null>(null)

  async function runQualification(data: LeadFormData) {
    setLastData(data)
    setView('loading')
    const started = performance.now()
    try {
      const result = await qualifyLead(data)
      const elapsed = performance.now() - started
      if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed)
      setResponse(result)
      setView('success')
    } catch {
      const elapsed = performance.now() - started
      if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed)
      setView('error')
    }
  }

  const reset = () => {
    setResponse(null)
    setView('form')
  }

  return (
    <>
      <Background />

      <main className="flex min-h-screen w-full items-center justify-center px-4 py-10 sm:py-14">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[480px]"
        >
          {/* Gradient hairline frame */}
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/15 via-white/[0.04] to-transparent" aria-hidden />

          <div className="relative rounded-[28px] border border-white/10 bg-ink-800/70 p-7 shadow-card backdrop-blur-2xl sm:p-9">
            {/* Persistent brand header */}
            <Logo className="mx-auto h-9 w-auto sm:h-10" />

            <div className="relative mt-8">
              <AnimatePresence mode="wait">
                {view === 'form' && (
                  <motion.div key="form" {...viewTransition}>
                    <header className="mb-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-orange-light">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                        Limited Spots Available
                      </span>
                      <h1 className="mt-3.5 text-[25px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[28px]">
                        Apply For A Free Growth <span className="gradient-text">Strategy Session</span>
                      </h1>
                      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/55">
                        Answer a few questions so we can understand your business and determine whether we're a good fit
                        to work together.
                      </p>
                    </header>

                    <div className="mb-6 flex items-center justify-center gap-1.5 text-[12.5px] text-white/45">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Takes less than 60 seconds.
                    </div>

                    <LeadForm onSubmit={runQualification} />

                    <ProcessSteps />
                  </motion.div>
                )}

                {view === 'loading' && (
                  <motion.div key="loading" {...viewTransition}>
                    <LoadingState />
                  </motion.div>
                )}

                {view === 'success' && response && (
                  <motion.div key="success" {...viewTransition}>
                    <SuccessScreen response={response} onReset={reset} />
                  </motion.div>
                )}

                {view === 'error' && (
                  <motion.div key="error" {...viewTransition}>
                    <ErrorScreen onRetry={() => lastData && runQualification(lastData)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[12px] text-white/30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Your information is secure &amp; never shared.
          </p>
        </motion.section>
      </main>
    </>
  )
}
