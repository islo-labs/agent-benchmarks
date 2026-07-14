import posthog from 'posthog-js'
import { POSTHOG_HOST, POSTHOG_KEY } from '../config/posthog'
import type { LeadPayload, ResultPayload } from './leads'
import type { Stage } from '../types'

let initialized = false

function getReferrerProps() {
  const referrer = document.referrer
  if (!referrer) {
    return { referrer: '', referring_domain: '' }
  }

  try {
    return {
      referrer,
      referring_domain: new URL(referrer).hostname,
    }
  } catch {
    return { referrer, referring_domain: '' }
  }
}

function getUtmProps() {
  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
  const utm: Record<string, string> = {}

  for (const key of utmKeys) {
    const value = params.get(key)
    if (value) utm[key] = value
  }

  return utm
}

export function initPostHog(): void {
  if (initialized) return

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: false,
  })

  const utm = getUtmProps()
  if (Object.keys(utm).length > 0) {
    posthog.register(utm)
  }

  initialized = true
}

export function captureGraderPageView(
  stage: Stage,
  extras?: Record<string, string | number | boolean>,
): void {
  if (!initialized) return

  posthog.capture('$pageview', {
    grader_stage: stage,
    path: window.location.pathname + window.location.search,
    ...getReferrerProps(),
    ...getUtmProps(),
    ...extras,
  })
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
