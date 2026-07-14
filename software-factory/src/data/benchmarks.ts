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

export const BENCHMARKS: BenchmarkProfile[] = [
  {
    id: 'startup',
    label: 'Startup',
    description: 'Under 100 engineers',
    scores: benchmarkScores({
      autonomy: 42,
      harnesses: 34,
      context: 40,
      verification: 38,
      evaluation: 25,
      observability: 28,
      recordings: 20,
      controls: 24,
    }),
    overallAverage: 31,
    topPerformers: 72,
  },
  {
    id: 'scaleup',
    label: 'Scale-up',
    description: '100 to 500 engineers',
    scores: benchmarkScores({
      autonomy: 46,
      harnesses: 42,
      context: 48,
      verification: 46,
      evaluation: 34,
      observability: 38,
      recordings: 28,
      controls: 36,
    }),
    overallAverage: 40,
    topPerformers: 78,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'Over 500 engineers',
    scores: benchmarkScores({
      autonomy: 34,
      harnesses: 48,
      context: 46,
      verification: 52,
      evaluation: 40,
      observability: 46,
      recordings: 32,
      controls: 52,
    }),
    overallAverage: 44,
    topPerformers: 82,
  },
]

export const TOP_PERFORMERS_SCORES: Record<DimensionId, number> = benchmarkScores({
  autonomy: 86,
  harnesses: 88,
  context: 84,
  verification: 92,
  evaluation: 86,
  observability: 88,
  recordings: 80,
  controls: 88,
})

export function getBenchmark(cohort: CohortId): BenchmarkProfile {
  return BENCHMARKS.find((benchmark) => benchmark.id === cohort) ?? BENCHMARKS[0]
}

export const COHORT_OPTIONS = BENCHMARKS.map(({ id, label, description }) => ({
  id,
  label,
  description,
}))
