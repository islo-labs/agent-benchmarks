import type { BenchmarkProfile, CohortId, DimensionId } from '../types'

interface BenchmarkScores {
  autonomy: number
  harnesses: number
  context: number
  verification: number
  evaluation: number
  observability: number
  recordings: number
  controls: number
}

const benchmarkScores = ({
  autonomy,
  harnesses,
  context,
  verification,
  evaluation,
  observability,
  recordings,
  controls,
}: BenchmarkScores): Record<DimensionId, number> => ({
  autonomousAgents: autonomy,
  agentHarnesses: harnesses,
  contextAndTools: context,
  verification,
  evaluation,
  observability,
  screenRecordings: recordings,
  governanceAndCost: controls,
})

// Benchmark anchors live on the same scale as user scores (option floor 40,
// typical result low-to-mid 70s). Cohorts keep their relative story: startups
// lean autonomous, enterprises lean on verification and controls.
export const BENCHMARKS: BenchmarkProfile[] = [
  {
    id: 'startup',
    label: 'Startup',
    description: 'Under 100 engineers',
    scores: benchmarkScores({
      autonomy: 74,
      harnesses: 70,
      context: 73,
      verification: 71,
      evaluation: 68,
      observability: 69,
      recordings: 67,
      controls: 68,
    }),
    overallAverage: 70,
    topPerformers: 92,
  },
  {
    id: 'scaleup',
    label: 'Scale-up',
    description: '100 to 500 engineers',
    scores: benchmarkScores({
      autonomy: 76,
      harnesses: 74,
      context: 77,
      verification: 76,
      evaluation: 71,
      observability: 73,
      recordings: 70,
      controls: 73,
    }),
    overallAverage: 74,
    topPerformers: 94,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'Over 500 engineers',
    scores: benchmarkScores({
      autonomy: 72,
      harnesses: 78,
      context: 77,
      verification: 80,
      evaluation: 74,
      observability: 78,
      recordings: 71,
      controls: 80,
    }),
    overallAverage: 76,
    topPerformers: 96,
  },
]

export const TOP_PERFORMERS_SCORES: Record<DimensionId, number> = benchmarkScores({
  autonomy: 95,
  harnesses: 96,
  context: 94,
  verification: 97,
  evaluation: 94,
  observability: 96,
  recordings: 92,
  controls: 96,
})

export function getBenchmark(cohort: CohortId): BenchmarkProfile {
  return BENCHMARKS.find((benchmark) => benchmark.id === cohort) ?? BENCHMARKS[0]
}

export const COHORT_OPTIONS = BENCHMARKS.map(({ id, label, description }) => ({
  id,
  label,
  description,
}))
