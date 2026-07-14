import { motion } from 'framer-motion'
import { useState } from 'react'
import { submitLead } from '../lib/leads'
import type { GraderResult, GraderState } from '../types'

interface EmailCaptureProps {
  state: GraderState
  result: GraderResult
}

export function EmailCapture({ state, result }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    const response = await submitLead(email.trim(), state, result)
    setStatus(response.ok ? 'success' : 'error')
    setMessage(response.message)
  }

  if (status === 'success') {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-ok"
      >
        {message}
      </motion.p>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-dashed border-line-2 bg-bg-1 p-6"
    >
      <p className="mb-1 text-sm font-medium text-ink">
        Want the full breakdown + playbook?
      </p>
      <p className="mb-4 text-sm text-ink-4">
        Optional — we'll save your result and follow up with a detailed report.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-lg border border-line-2 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-islo focus:outline-none focus:ring-1 focus:ring-islo"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-islo disabled:opacity-40"
        >
          {status === 'loading' ? 'Sending…' : 'Send me the report'}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-2 text-sm text-danger">{message}</p>
      )}
    </motion.form>
  )
}
