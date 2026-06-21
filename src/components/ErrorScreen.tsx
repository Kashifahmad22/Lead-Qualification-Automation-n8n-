import { motion } from 'framer-motion'

export default function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-red-400">
          <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Couldn't reach the workflow</h2>
        <p className="mt-1.5 text-[14px] text-white/55">
          The webhook didn't respond. Check your WEBHOOK_URL and try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[14px] font-medium text-white/85 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
      >
        Try again
      </button>
    </motion.div>
  )
}
