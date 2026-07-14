import { forwardRef } from 'react'
import { getBenchmark } from '../data/benchmarks'
import { formatPercentileRank } from '../lib/share'
import type { CohortId, GraderResult } from '../types'

interface ResultCardProps {
  result: GraderResult
  cohort: CohortId
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ result, cohort }, ref) {
    const benchmark = getBenchmark(cohort)

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-[rgba(20,20,24,0.14)] bg-[#ffffff] p-8"
        style={{ width: 480, fontFamily: '"Inter Tight", system-ui, sans-serif' }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(122,61,230,0.18), transparent 60%)' }}
        />

        <p
          className="mb-1 text-[10.5px] uppercase tracking-[0.08em] text-[#7a3de6]"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          Software Factory Grader
        </p>
        <p className="mb-6 text-xs text-[#8a8a95]">Benchmark: {benchmark.label}</p>

        <div className="mb-6 flex items-end gap-4">
          <span className="text-7xl font-semibold leading-none tracking-[-0.028em] text-[#141418]">
            {result.grade}
          </span>
          <div>
            <p className="text-3xl font-semibold text-[#141418]">{result.overallScore}</p>
            <p className="text-sm text-[#8a8a95]">out of 100</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[rgba(20,20,24,0.08)] bg-[#f3ebfd] px-4 py-3">
          <p
            className="text-[10.5px] uppercase tracking-[0.08em] text-[#8a8a95]"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Maturity Level
          </p>
          <p className="text-lg font-semibold text-[#4e1a9c]">
            L{result.maturityLevel}: {result.maturityLabel}
          </p>
        </div>

        <p className="text-sm text-[#555560]">
          {formatPercentileRank(result.percentile)} vs {benchmark.label} peers
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {result.dimensionScores.slice(0, 4).map((d) => (
            <div key={d.dimension} className="rounded-lg bg-[#f4f4f5] px-2 py-2 text-center">
              <p
                className="text-sm font-semibold text-[#141418]"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {d.score}
              </p>
              <p className="text-[9px] text-[#8a8a95]">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
)
