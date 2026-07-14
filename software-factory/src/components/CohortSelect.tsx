import { motion } from 'framer-motion'
import { COHORT_OPTIONS } from '../data/benchmarks'
import type { CohortId } from '../types'

interface CohortSelectProps {
  value: CohortId
  onChange: (cohort: CohortId) => void
}

export function CohortSelect({ value, onChange }: CohortSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COHORT_OPTIONS.map((cohort) => {
        const selected = value === cohort.id
        return (
          <button
            key={cohort.id}
            type="button"
            onClick={() => onChange(cohort.id)}
            className={[
              'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
              selected
                ? 'border-islo bg-islo-tint text-islo-deep'
                : 'border-line-2 bg-paper text-ink-3 hover:border-ink-4 hover:text-ink',
            ].join(' ')}
          >
            {cohort.label}
          </button>
        )
      })}
    </div>
  )
}

export function CohortLabel({ cohort }: { cohort: CohortId }) {
  const option = COHORT_OPTIONS.find((c) => c.id === cohort)
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4"
    >
      Benchmark: {option?.label ?? cohort}
    </motion.span>
  )
}
