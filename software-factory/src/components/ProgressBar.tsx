import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
        <span>Progress</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-bg-2">
        <motion.div
          className="h-full rounded-full bg-islo"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
