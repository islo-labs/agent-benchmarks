import { motion } from 'framer-motion'

interface RecommendationsProps {
  recommendations: string[]
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-4">
        Top recommendations
      </h3>
      <div className="flex flex-col gap-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex gap-3 rounded-xl border border-line-2 bg-paper px-4 py-3 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-islo-tint font-mono text-xs text-islo-deep">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-ink-3">{rec}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
