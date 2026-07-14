import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { CohortSelect } from './CohortSelect'
import { BenchmarkBars } from './BenchmarkBars'
import { EmailCapture } from './EmailCapture'
import { RadarComparison } from './RadarComparison'
import { Recommendations } from './Recommendations'
import { ResultCard } from './ResultCard'
import { ShareBar } from './ShareBar'
import { TrustBanner } from './TrustBanner'
import type { CohortId, GraderResult, GraderState } from '../types'
import { TRUST_STATS } from '../data/trust'
import { formatPercentileRank } from '../lib/share'

interface ResultProps {
  result: GraderResult
  state: GraderState
  onCohortChange: (cohort: CohortId) => void
  onRetake: () => void
}

export function Result({ result, state, onCohortChange, onRetake }: ResultProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `software-factory-grade-${result.grade}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const gradeColor =
    result.grade === 'A' || result.grade === 'B'
      ? 'text-ok'
      : result.grade === 'C'
        ? 'text-warn'
        : 'text-danger'

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-8 pb-12 md:pt-10 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-4">
              Compare against
            </p>
            <CohortSelect
              value={state.cohort as CohortId}
              onChange={onCohortChange}
            />
          </div>
          <button
            type="button"
            onClick={onRetake}
            className="shrink-0 pt-6 text-sm text-ink-4 transition-colors hover:text-ink"
          >
            Retake →
          </button>
        </div>

        <div className="mb-8">
          <ShareBar
            state={state}
            result={result}
            onDownload={handleDownload}
            downloading={downloading}
          />
        </div>

        <div className="mb-10 grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
              Your score
            </p>
            <div className="mb-4 flex items-end gap-4">
              <span
                className={`${gradeColor} text-8xl font-semibold leading-none tracking-[-0.028em]`}
              >
                {result.grade}
              </span>
              <div className="pb-2">
                <p className="text-4xl font-semibold text-ink">{result.overallScore}</p>
                <p className="text-sm text-ink-4">out of 100</p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-line-2 bg-paper px-5 py-4 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">Maturity level</p>
              <p className="text-xl font-semibold text-ink">
                Level {result.maturityLevel}: {result.maturityLabel}
              </p>
              <p className="mt-1 text-sm text-ink-3">{result.maturityDescription}</p>
            </div>

            <p className="text-sm text-ink-3">
              You rank in the{' '}
              <span className="font-semibold text-islo">
                {formatPercentileRank(result.percentile)}
              </span>{' '}
              among {TRUST_STATS.orgCount} teams in your cohort.
            </p>
          </div>

          <div className="rounded-2xl border border-line-2 bg-paper p-6 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]">
            <RadarComparison scores={result.dimensionScores} />
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-line-2 bg-paper p-6 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]">
          <h3 className="mb-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-4">
            Dimension breakdown
          </h3>
          <p className="mb-6 text-sm text-ink-4">
            Compared to the average and top 10% from {TRUST_STATS.orgCount} benchmarked teams.
          </p>
          <BenchmarkBars scores={result.dimensionScores} />
        </div>

        <div className="mb-10">
          <Recommendations recommendations={result.recommendations} />
        </div>

        <div className="mb-10">
          <TrustBanner />
        </div>

        <EmailCapture state={state} result={result} />
      </motion.div>

      <div className="pointer-events-none fixed -left-[9999px] top-0">
        <ResultCard ref={cardRef} result={result} cohort={state.cohort as CohortId} />
      </div>
    </div>
  )
}
