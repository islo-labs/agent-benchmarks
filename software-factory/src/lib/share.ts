import { QUESTIONS } from '../data/questions'
import type { CohortId, GraderResult, GraderState } from '../types'
import { TRUST_STATS } from '../data/trust'

const LEGACY_PARAM = 'r'
const COHORT_PARAM = 'c'
const ANSWERS_PARAM = 'a'
const GRADE_PARAM = 'g'
const SCORE_PARAM = 's'
const MATURITY_LEVEL_PARAM = 'ml'
const MATURITY_LABEL_PARAM = 'mlb'
const PERCENTILE_PARAM = 'p'

export const SHARE_OG_IMAGE = 'https://agent-benchmarks.com/software-factory/og-share.png'

const COHORT_SHORT: Record<CohortId, string> = {
  startup: 'u',
  scaleup: 's',
  enterprise: 'e',
}

const COHORT_FROM_CODE: Record<string, CohortId> = {
  u: 'startup',
  s: 'scaleup',
  e: 'enterprise',
  startup: 'startup',
  scaleup: 'scaleup',
  enterprise: 'enterprise',
}

function getPublicBaseUrl(): string {
  const configured = import.meta.env.VITE_SHARE_BASE_URL as string | undefined
  if (configured) return configured.replace(/\/$/, '')

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base}`
}

function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const mod100 = n % 100
  const suffix = suffixes[(mod100 - 20) % 10] ?? suffixes[mod100] ?? suffixes[0]
  return `${n}${suffix}`
}

export function formatPercentileRank(percentile: number): string {
  return `${ordinal(percentile)} percentile`
}

function parseCohort(value: string | null): CohortId | null {
  if (!value) return null
  return COHORT_FROM_CODE[value] ?? null
}

function encodeAnswers(answers: Record<string, string>): string {
  let digits = ''
  for (const question of QUESTIONS) {
    const answerId = answers[question.id]
    if (!answerId) break
    const index = question.options.findIndex((option) => option.id === answerId)
    if (index < 0) return ''
    digits += String(index)
  }
  return digits
}

function decodeAnswers(digits: string): Record<string, string> | null {
  if (!/^[0-4]+$/.test(digits)) return null

  const answers: Record<string, string> = {}
  for (let index = 0; index < digits.length && index < QUESTIONS.length; index++) {
    answers[QUESTIONS[index].id] = `opt-${digits[index]}`
  }
  return answers
}

function encodeCompactParams(state: GraderState): URLSearchParams {
  const params = new URLSearchParams()
  params.set(COHORT_PARAM, COHORT_SHORT[state.cohort])
  const digits = encodeAnswers(state.answers)
  if (digits) params.set(ANSWERS_PARAM, digits)
  return params
}

function decodeCompactParams(params: URLSearchParams): GraderState | null {
  const cohort = parseCohort(params.get(COHORT_PARAM))
  const digits = params.get(ANSWERS_PARAM)
  if (!cohort || !digits) return null

  const answers = decodeAnswers(digits)
  if (!answers || Object.keys(answers).length === 0) return null

  return { cohort, answers }
}

function decodeLegacyState(encoded: string): GraderState | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(padded)
    const parsed = JSON.parse(json) as { c: CohortId; a: Record<string, string> }
    if (!parsed.c || !parsed.a) return null
    return { cohort: parsed.c, answers: parsed.a }
  } catch {
    return null
  }
}

function applyStateToUrl(url: URL, state: GraderState, result?: GraderResult): void {
  url.searchParams.delete(LEGACY_PARAM)
  url.searchParams.delete(COHORT_PARAM)
  url.searchParams.delete(ANSWERS_PARAM)
  url.searchParams.delete(GRADE_PARAM)
  url.searchParams.delete(SCORE_PARAM)
  url.searchParams.delete(MATURITY_LEVEL_PARAM)
  url.searchParams.delete(MATURITY_LABEL_PARAM)
  url.searchParams.delete(PERCENTILE_PARAM)

  const compact = encodeCompactParams(state)
  for (const [key, value] of compact.entries()) {
    url.searchParams.set(key, value)
  }

  if (result) {
    url.searchParams.set(GRADE_PARAM, result.grade)
    url.searchParams.set(SCORE_PARAM, String(result.overallScore))
    url.searchParams.set(MATURITY_LEVEL_PARAM, String(result.maturityLevel))
    url.searchParams.set(MATURITY_LABEL_PARAM, encodeURIComponent(result.maturityLabel))
    url.searchParams.set(PERCENTILE_PARAM, String(result.percentile))
  }
}

export function updateUrlWithState(state: GraderState, result?: GraderResult): void {
  const url = new URL(window.location.href)
  applyStateToUrl(url, state, result)
  window.history.replaceState(null, '', url.toString())
}

export function readStateFromUrl(): GraderState | null {
  const params = new URLSearchParams(window.location.search)

  const compact = decodeCompactParams(params)
  if (compact) return compact

  const legacy = params.get(LEGACY_PARAM)
  if (legacy) return decodeLegacyState(legacy)

  return null
}

export function buildShareUrl(state: GraderState, result?: GraderResult): string {
  const url = new URL(`${getPublicBaseUrl()}/`)
  applyStateToUrl(url, state, result)
  return url.toString()
}

export function buildShareText(result: GraderResult): string {
  return `We just graded ${result.grade} (${result.overallScore}/100) on AI software factory maturity. ${formatPercentileRank(result.percentile)} of ${TRUST_STATS.orgCount} engineering teams. Think your team can beat it?`
}

export function buildShareMessage(result: GraderResult, state: GraderState): string {
  return `${buildShareText(result)}\n\n${buildShareUrl(state, result)}`
}

export async function shareToLinkedIn(url: string, text: string): Promise<boolean> {
  const copied = await copyToClipboard(`${text}\n\n${url}`)
  const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
  linkedInUrl.searchParams.set('url', url)
  window.open(linkedInUrl.toString(), '_blank', 'noopener,noreferrer,width=720,height=720')
  return copied
}

export function shareToX(text: string, shareUrl: string): void {
  const xUrl = new URL('https://twitter.com/intent/tweet')
  xUrl.searchParams.set('text', `${text}\n\n${shareUrl}`)
  window.open(xUrl.toString(), '_blank', 'noopener,noreferrer,width=600,height=400')
}

export function updateShareMeta(result: GraderResult): void {
  const title = `Grade ${result.grade}: ${result.overallScore}/100 on AI-driven software factory maturity`
  const description = buildShareText(result)

  document.title = title

  const setMeta = (attr: 'property' | 'name', key: string, content: string) => {
    const selector = `meta[${attr}="${key}"]`
    let tag = document.querySelector(selector)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attr, key)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  }

  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', SHARE_OG_IMAGE)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', SHARE_OG_IMAGE)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
