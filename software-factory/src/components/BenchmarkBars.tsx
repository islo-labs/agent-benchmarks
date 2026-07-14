import { motion } from 'framer-motion'
import type { DimensionScore } from '../types'

interface BenchmarkBarsProps {
  scores: DimensionScore[]
}

export function BenchmarkBars({ scores }: BenchmarkBarsProps) {
  return (
    <div className="flex flex-col gap-4">
      {scores.map((item, index) => {
        const gap = item.score - item.benchmark
        const gapLabel =
          gap > 0 ? `+${gap} vs avg` : gap < 0 ? `${gap} vs avg` : 'At average'

        return (
          <motion.div
            key={item.dimension}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-ink-3">{item.label}</span>
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'font-mono text-[11px]',
                    gap > 0 ? 'text-ok' : gap < 0 ? 'text-warn' : 'text-ink-4',
                  ].join(' ')}
                >
                  {gapLabel}
                </span>
                <span className="font-mono text-sm font-medium text-ink">
                  {item.score}
                </span>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-bg-2">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-ink-5/50"
                style={{ width: `${item.benchmark}%` }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-islo"
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
