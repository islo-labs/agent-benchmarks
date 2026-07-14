import posthog from 'posthog-js'
import { POSTHOG_HOST, POSTHOG_KEY } from '../config/posthog'
import type { LeadPayload, ResultPayload } from './leads'

let initialized = false

export function initPostHog(): void {
  if (initialized) return

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: false,
  })
  initialized = true
}

function resultProperties(payload: ResultPayload) {
  return {
    cohort: payload.cohort,
    share_url: payload.shareUrl,
    overall_score: payload.overallScore,
    grade: payload.grade,
    maturity_level: payload.maturityLevel,
    maturity_label: payload.maturityLabel,
    maturity_description: payload.maturityDescription,
    percentile: payload.percentile,
    answers: payload.answers,
    dimension_scores: payload.dimensionScores,
    recommendations: payload.recommendations,
    submitted_at: payload.submittedAt,
  }
}

export function captureGraderResult(payload: ResultPayload): boolean {
  if (!initialized) return false

  posthog.capture('grader_completed', resultProperties(payload))
  return true
}

export function captureGraderLead(payload: LeadPayload): boolean {
  if (!initialized) return false

  posthog.identify(payload.email, { email: payload.email })
  posthog.capture('grader_lead_submitted', {
    ...resultProperties(payload),
    email: payload.email,
  })

  return true
}
