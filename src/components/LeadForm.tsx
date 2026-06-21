import { useState } from 'react'
import { motion } from 'framer-motion'
import Dropdown from './Dropdown'
import { BUSINESS_TYPE_OPTIONS, MONTHLY_REVENUE_OPTIONS, TIMELINE_OPTIONS } from '../config'
import type { LeadFormData } from '../types'

const EMPTY: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  businessType: '',
  monthlyRevenue: '',
  challenge: '',
  timeline: '',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const inputClass = (invalid: boolean) =>
  [
    'w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-white/40 outline-none transition-colors duration-200',
    'focus:border-brand-blue/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-blue/40',
    invalid ? 'border-red-500/60' : 'border-white/10 hover:border-white/20',
  ].join(' ')

function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  invalid,
  inputMode,
  autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  invalid: boolean
  inputMode?: 'text' | 'email' | 'tel'
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium tracking-wide text-white/70">{label}</label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass(invalid)}
      />
    </div>
  )
}

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim())
const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 7

export default function LeadForm({ onSubmit }: { onSubmit: (data: LeadFormData) => void }) {
  const [data, setData] = useState<LeadFormData>(EMPTY)
  const [triggered, setTriggered] = useState(false)

  const set = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const isValid =
    data.name.trim() !== '' &&
    emailOk(data.email) &&
    phoneOk(data.phone) &&
    data.businessType !== '' &&
    data.monthlyRevenue !== '' &&
    data.challenge.trim() !== '' &&
    data.timeline !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTriggered(true)
    if (!isValid) return
    onSubmit({
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      challenge: data.challenge.trim(),
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
      noValidate
    >
      <motion.div variants={item}>
        <TextField
          label="Full Name"
          value={data.name}
          onChange={(v) => set('name', v)}
          placeholder="Jane Doe"
          autoComplete="name"
          invalid={triggered && data.name.trim() === ''}
        />
      </motion.div>

      <motion.div variants={item}>
        <TextField
          label="Email Address"
          type="email"
          inputMode="email"
          value={data.email}
          onChange={(v) => set('email', v)}
          placeholder="jane@company.com"
          autoComplete="email"
          invalid={triggered && !emailOk(data.email)}
        />
      </motion.div>

      <motion.div variants={item}>
        <TextField
          label="Phone Number"
          type="tel"
          inputMode="tel"
          value={data.phone}
          onChange={(v) => set('phone', v)}
          placeholder="(555) 123-4567"
          autoComplete="tel"
          invalid={triggered && !phoneOk(data.phone)}
        />
      </motion.div>

      <motion.div variants={item}>
        <Dropdown
          label="Business Type"
          placeholder="Select your business type"
          value={data.businessType}
          options={BUSINESS_TYPE_OPTIONS}
          onChange={(v) => set('businessType', v)}
          error={triggered}
        />
      </motion.div>

      <motion.div variants={item}>
        <Dropdown
          label="Current Monthly Revenue"
          placeholder="Select your monthly revenue"
          value={data.monthlyRevenue}
          options={MONTHLY_REVENUE_OPTIONS}
          onChange={(v) => set('monthlyRevenue', v)}
          error={triggered}
        />
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-2">
        <label className="text-[13px] font-medium tracking-wide text-white/70">Biggest Business Challenge</label>
        <textarea
          value={data.challenge}
          onChange={(e) => set('challenge', e.target.value)}
          rows={4}
          placeholder="What's the #1 thing holding your business back right now?"
          className={[
            'w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] leading-relaxed text-white placeholder:text-white/40 outline-none transition-colors duration-200',
            'focus:border-brand-blue/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-blue/40',
            triggered && data.challenge.trim() === '' ? 'border-red-500/60' : 'border-white/10 hover:border-white/20',
          ].join(' ')}
        />
      </motion.div>

      <motion.div variants={item}>
        <Dropdown
          label="How Soon Are You Looking To Solve This?"
          placeholder="Select a timeframe"
          value={data.timeline}
          options={TIMELINE_OPTIONS}
          onChange={(v) => set('timeline', v)}
          error={triggered}
        />
      </motion.div>

      <motion.div variants={item} className="pt-1">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-brand-gradient px-6 py-4 text-[16px] font-semibold text-white shadow-glow transition-shadow duration-300 hover:shadow-[0_0_50px_-8px_rgba(46,144,255,0.7)]"
        >
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            aria-hidden
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" opacity="0.95" />
          </svg>
          <span className="relative">Apply For Strategy Session</span>
        </motion.button>
        <motion.p
          initial={false}
          animate={{ opacity: triggered && !isValid ? 1 : 0, height: triggered && !isValid ? 'auto' : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden pt-2 text-center text-[13px] text-red-400/90"
        >
          Please complete all fields with valid details to submit your application.
        </motion.p>
      </motion.div>
    </motion.form>
  )
}
