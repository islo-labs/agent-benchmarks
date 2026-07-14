import type { GraderResult, GraderState } from '../types'
import { buildShareUrl } from './share'
import { captureGraderLead, captureGraderResult } from './posthog'

export interface ResultPayload {
  submittedAt: string
  cohort: GraderState['cohort']
  shareUrl: string
  answers: GraderState['answers']
  overallScore: number
  grade: string
  maturityLevel: number
  maturityLabel: string
  maturityDescription: string
  percentile: number
  dimensionScores: GraderResult['dimensionScores']
  recommendations: string[]
}

export interface LeadPayload extends ResultPayload {
  email: string
}

export function buildResultPayload(state: GraderState, result: GraderResult): ResultPayload {
  return {
    submittedAt: new Date().toISOString(),
    cohort: state.cohort,
    shareUrl: buildShareUrl(state),
    answers: state.answers,
    overallScore: result.overallScore,
    grade: result.grade,
    maturityLevel: result.maturityLevel,
    maturityLabel: result.maturityLabel,
    maturityDescription: result.maturityDescription,
    percentile: result.percentile,
    dimensionScores: result.dimensionScores,
    recommendations: result.recommendations,
  }
}

export function buildLeadPayload(
  email: string,
  state: GraderState,
  result: GraderResult,
): LeadPayload {
  return { ...buildResultPayload(state, result), email }
}

export function trackResult(state: GraderState, result: GraderResult): boolean {
  return captureGraderResult(buildResultPayload(state, result))
}

export async function submitLead(
  email: string,
  state: GraderState,
  result: GraderResult,
): Promise<{ ok: boolean; message: string }> {
  const payload = buildLeadPayload(email, state, result)

  if (!captureGraderLead(payload)) {
    return { ok: false, message: 'Something went wrong saving your email. Please try again.' }
  }

  return { ok: true, message: 'Thanks — we saved your result.' }
}
