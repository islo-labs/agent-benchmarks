import { motion } from 'framer-motion'
import { TRUST_STATS } from '../data/trust'

interface TrustBannerProps {
  compact?: boolean
}

export function TrustBanner({ compact = false }: TrustBannerProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-2xl border border-line-2 bg-paper px-5 py-4 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]"
      aria-label="Benchmark credibility"
    >
      <div className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-4 md:flex-row md:items-center md:gap-6'}>
        <div className={compact ? '' : 'md:min-w-[140px]'}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
            Benchmark dataset
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-[-0.028em] text-islo-deep">
            {TRUST_STATS.orgCount}
          </p>
          <p className="text-sm text-ink-3">{TRUST_STATS.orgLabel}</p>
        </div>

        {!compact && (
          <div className="hidden h-12 w-px bg-line-2 md:block" aria-hidden="true" />
        )}

        <div className="flex-1">
          <p className="text-sm leading-relaxed text-ink-3">{TRUST_STATS.methodology}</p>
          {!compact && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {TRUST_STATS.pillars.map((pillar) => (
                <li key={pillar} className="flex items-start gap-2 text-sm text-ink-3">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-islo" aria-hidden="true" />
                  {pillar}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-4">
        {TRUST_STATS.credibility}
      </p>
    </motion.aside>
  )
}
