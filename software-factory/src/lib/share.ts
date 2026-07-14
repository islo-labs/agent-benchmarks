import { QUESTIONS } from '../data/questions'
import type { CohortId, GraderResult, GraderState } from '../types'
import { TRUST_STATS } from '../data/trust'

const LEGACY_PARAM = 'r'
const COHORT_PARAM = 'c'
const ANSWERS_PARAM = 'a'

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

function applyStateToUrl(url: URL, state: GraderState): void {
  url.searchParams.delete(LEGACY_PARAM)
  url.searchParams.delete(COHORT_PARAM)
  url.searchParams.delete(ANSWERS_PARAM)

  const compact = encodeCompactParams(state)
  for (const [key, value] of compact.entries()) {
    url.searchParams.set(key, value)
  }
}

export function updateUrlWithState(state: GraderState): void {
  const url = new URL(window.location.href)
  applyStateToUrl(url, state)
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

export function buildShareUrl(state: GraderState): string {
  const url = new URL(`${getPublicBaseUrl()}/`)
  applyStateToUrl(url, state)
  return url.toString()
}

export function buildShareText(result: GraderResult): string {
  return `Our team scored ${result.overallScore}/100 (Grade ${result.grade}) on AI-driven software factory maturity. Level ${result.maturityLevel}: ${result.maturityLabel}. ${formatPercentileRank(result.percentile)} vs ${TRUST_STATS.orgCount} benchmarked teams. How does your process compare?`
}

export function buildShareMessage(result: GraderResult, state: GraderState): string {
  return `${buildShareText(result)}\n\n${buildShareUrl(state)}`
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

  const setMeta = (property: string, content: string) => {
    let tag = document.querySelector(`meta[property="${property}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('property', property)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  }

  setMeta('og:title', title)
  setMeta('og:description', description)
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
