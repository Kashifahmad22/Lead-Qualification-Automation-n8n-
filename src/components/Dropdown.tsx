import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DropdownProps {
  label: string
  value: string
  placeholder: string
  options: readonly string[]
  onChange: (value: string) => void
  error?: boolean
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="text-white/55"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

export default function Dropdown({ label, value, placeholder, options, onChange, error }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <label className="text-[13px] font-medium tracking-wide text-white/70">{label}</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={[
            'flex w-full items-center justify-between rounded-xl border bg-white/[0.03] px-4 py-3.5 text-left text-[15px] transition-colors duration-200',
            'outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60',
            open ? 'border-brand-blue/70 bg-white/[0.05]' : 'border-white/10 hover:border-white/20',
            error && !value ? 'border-red-500/60' : '',
          ].join(' ')}
        >
          <span className={value ? 'text-white' : 'text-white/40'}>{value || placeholder}</span>
          <Chevron open={open} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/10 bg-ink-700/95 p-1.5 shadow-card backdrop-blur-xl"
            >
              {options.map((opt, i) => {
                const selected = opt === value
                return (
                  <motion.li
                    key={opt}
                    role="option"
                    aria-selected={selected}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.18 }}
                    onClick={() => {
                      onChange(opt)
                      setOpen(false)
                    }}
                    className={[
                      'flex cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-[15px] transition-colors',
                      selected ? 'bg-brand-blue/15 text-white' : 'text-white/75 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                  >
                    {opt}
                    {selected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-brand-blue-light">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
