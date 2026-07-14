export type DimensionId =
  | 'autonomousAgents'
  | 'agentHarnesses'
  | 'contextAndTools'
  | 'verification'
  | 'evaluation'
  | 'observability'
  | 'screenRecordings'
  | 'governanceAndCost'

export type CohortId = 'startup' | 'scaleup' | 'enterprise'

export type Stage = 'quiz' | 'result'

export interface QuestionOption {
  id: string
  label: string
  score: number
}

export interface Question {
  id: string
  dimension: DimensionId
  text: string
  scaleLow: string
  scaleHigh: string
  options: QuestionOption[]
}

export interface DimensionMeta {
  id: DimensionId
  label: string
  shortLabel: string
  category: 'agentic'
  weight: number
}

export interface BenchmarkProfile {
  id: CohortId
  label: string
  description: string
  scores: Record<DimensionId, number>
  overallAverage: number
  topPerformers: number
}

export interface DimensionScore {
  dimension: DimensionId
  label: string
  score: number
  benchmark: number
  topPerformers: number
}

export interface GraderResult {
  dimensionScores: DimensionScore[]
  overallScore: number
  grade: string
  maturityLevel: number
  maturityLabel: string
  maturityDescription: string
  percentile: number
  recommendations: string[]
}

export interface GraderState {
  cohort: CohortId
  answers: Record<string, string>
}
