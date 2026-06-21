import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MESSAGES = [
  'Reviewing Application...',
  'Analyzing Business Goals...',
  'Checking Qualification Criteria...',
  'Preparing Recommendation...',
]

const STEP_MS = 1050

export default function LoadingState() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, STEP_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-9 py-10">
      {/* Animated analyzer */}
      <div className="relative h-32 w-32">
        {/* Outer ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#2E90FF',
            borderRightColor: '#5BB8FF',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
        />
        {/* Inner counter-ring */}
        <motion.span
          className="absolute inset-3 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#FF8A2B',
            borderLeftColor: '#FF6A00',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.9, ease: 'linear', repeat: Infinity }}
        />
        {/* Pulsing core */}
        <motion.span
          className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-brand-gradient blur-[2px]"
          animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
        />
        <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center">
          <motion.svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <path d="M9 7L4 12l5 5M15 7l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </span>
      </div>

      {/* Cycling message */}
      <div className="flex h-7 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-[17px] font-medium text-white/85"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step progress dots */}
      <div className="flex items-center gap-2.5">
        {MESSAGES.map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-full"
            animate={{
              width: i === index ? 28 : 8,
              backgroundColor: i <= index ? '#2E90FF' : 'rgba(255,255,255,0.16)',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
