import { DIMENSIONS, DIMENSION_MAP, QUESTIONS } from '../data/questions'
import { getBenchmark, TOP_PERFORMERS_SCORES } from '../data/benchmarks'
import type {
  CohortId,
  DimensionId,
  DimensionScore,
  GraderResult,
} from '../types'

const MATURITY_LEVELS = [
  {
    level: 1,
    label: 'AI-Assisted',
    description: 'Engineers use AI interactively, but agents cannot own or verify work.',
    minScore: 0,
  },
  {
    level: 2,
    label: 'Agent-Enabled',
    description: 'Agents complete scoped tasks with reusable tools and close human review.',
    minScore: 25,
  },
  {
    level: 3,
    label: 'Agent-Operated',
    description: 'Agents run repeatable workflows with dedicated harnesses, evidence, and controls.',
    minScore: 50,
  },
  {
    level: 4,
    label: 'AI-Driven Software Factory',
    description: 'Agents run with harnesses, full observability, and verified output at scale.',
    minScore: 75,
  },
]

const RECOMMENDATIONS: Record<DimensionId, string[]> = {
  autonomousAgents: [
    'Give agents ownership of one bounded workflow, such as issue triage through a tested pull request, with a clear escalation path.',
    'Trigger routine runs from issues, schedules, or alerts instead of requiring an engineer to supervise every step.',
  ],
  agentHarnesses: [
    'Provide each run with an isolated environment, explicit tool permissions, lifecycle hooks, and durable artifacts.',
    'Turn successful agent setups into versioned workflow templates that teams can reuse and test.',
  ],
  contextAndTools: [
    'Connect agents to the issue tracker, documentation, logs, and live services through scoped, audited tools.',
    'Assemble task-specific context at run time and track when each source was last refreshed.',
  ],
  verification: [
    'Require agents to produce reproducible evidence that the requested behavior works, not just a passing test command.',
    'Use a separate verifier to judge acceptance criteria instead of letting the working agent grade itself.',
  ],
  evaluation: [
    'Build a versioned evaluation set from real historical work before changing models, prompts, or agent tools.',
    'Track verified success, cost, latency, and human intervention so model comparisons reflect production value.',
  ],
  observability: [
    'Store a structured timeline of tool calls, commands, file changes, errors, model usage, and run artifacts.',
    'Link agent traces to service telemetry so engineers can explain failures without reconstructing runs by hand.',
  ],
  screenRecordings: [
    'Record browser and desktop work, then synchronize the video with the agent action timeline.',
    'Attach recordings to verification evidence so reviewers can inspect the exact user journey the agent tested.',
  ],
  governanceAndCost: [
    'Run agents in isolated environments with task-scoped credentials, network policy, and a complete access log.',
    'Set per-run budgets, timeouts, retry limits, and routing rules, then compare spend with verified success.',
  ],
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function getMaturityLevel(score: number) {
  const level = [...MATURITY_LEVELS].reverse().find((l) => score >= l.minScore)
  return level ?? MATURITY_LEVELS[0]
}

function computePercentile(overallScore: number, cohortAverage: number, topPerformers: number): number {
  if (overallScore >= topPerformers) return 95
  if (overallScore <= cohortAverage * 0.5) return 5

  const range = topPerformers - cohortAverage * 0.5
  const position = overallScore - cohortAverage * 0.5
  const raw = (position / range) * 90 + 5
  return Math.round(Math.min(94, Math.max(5, raw)))
}

function getDimensionScore(dimensionId: DimensionId, answers: Record<string, string>): number {
  const dimensionQuestions = QUESTIONS.filter((q) => q.dimension === dimensionId)
  if (dimensionQuestions.length === 0) return 0

  let totalScore = 0
  let maxScore = 0

  for (const question of dimensionQuestions) {
    const answerId = answers[question.id]
    const option = question.options.find((o) => o.id === answerId)
    const maxOptionScore = Math.max(...question.options.map((o) => o.score))
    totalScore += option?.score ?? 0
    maxScore += maxOptionScore
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
}

export function computeResult(
  answers: Record<string, string>,
  cohort: CohortId,
): GraderResult {
  const benchmark = getBenchmark(cohort)

  const dimensionScores: DimensionScore[] = DIMENSIONS.map((dim) => ({
    dimension: dim.id,
    label: dim.shortLabel,
    score: getDimensionScore(dim.id, answers),
    benchmark: benchmark.scores[dim.id],
    topPerformers: TOP_PERFORMERS_SCORES[dim.id],
  }))

  let weightedSum = 0
  let totalWeight = 0

  for (const dim of DIMENSIONS) {
    const score = getDimensionScore(dim.id, answers)
    weightedSum += score * dim.weight
    totalWeight += dim.weight
  }

  const overallScore = Math.round(weightedSum / totalWeight)
  const grade = scoreToGrade(overallScore)
  const maturity = getMaturityLevel(overallScore)
  const percentile = computePercentile(
    overallScore,
    benchmark.overallAverage,
    benchmark.topPerformers,
  )

  const sortedGaps = [...dimensionScores]
    .map((d) => ({
      ...d,
      gap: benchmark.scores[d.dimension] - d.score,
    }))
    .sort((a, b) => b.gap - a.gap)

  const recommendations = sortedGaps
    .slice(0, 3)
    .flatMap((d) => RECOMMENDATIONS[d.dimension].slice(0, 1))

  return {
    dimensionScores,
    overallScore,
    grade,
    maturityLevel: maturity.level,
    maturityLabel: maturity.label,
    maturityDescription: maturity.description,
    percentile,
    recommendations,
  }
}

export function isQuizComplete(answers: Record<string, string>): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined)
}

export function getAnsweredCount(answers: Record<string, string>): number {
  return QUESTIONS.filter((q) => answers[q.id] !== undefined).length
}

export { DIMENSION_MAP, MATURITY_LEVELS }
