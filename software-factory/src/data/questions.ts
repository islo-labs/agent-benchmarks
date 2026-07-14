import type { DimensionId, DimensionMeta, Question } from '../types'

export const DIMENSIONS: DimensionMeta[] = [
  { id: 'autonomousAgents', label: 'Agent Autonomy', shortLabel: 'Autonomy', category: 'agentic', weight: 1 },
  { id: 'agentHarnesses', label: 'Agent Harnesses', shortLabel: 'Harnesses', category: 'agentic', weight: 1 },
  { id: 'contextAndTools', label: 'Context & Tool Access', shortLabel: 'Context', category: 'agentic', weight: 1 },
  { id: 'verification', label: 'Output Verification', shortLabel: 'Verification', category: 'agentic', weight: 1 },
  { id: 'evaluation', label: 'Agent Evaluation', shortLabel: 'Evaluation', category: 'agentic', weight: 1 },
  { id: 'observability', label: 'Agent Observability', shortLabel: 'Observability', category: 'agentic', weight: 1 },
  { id: 'screenRecordings', label: 'Screen Recordings & Replay', shortLabel: 'Recordings', category: 'agentic', weight: 1 },
  { id: 'governanceAndCost', label: 'Governance & Cost Control', shortLabel: 'Controls', category: 'agentic', weight: 1 },
]

// Generous scale so typical teams land in shareable B/C territory
// while top answers still leave headroom below a perfect 100.
const MATURITY_OPTION_SCORES = [65, 76, 84, 92, 97] as const

const maturityOptions = (labels: [string, string, string, string, string]) =>
  labels.map((label, index) => ({
    id: `opt-${index}`,
    label,
    score: MATURITY_OPTION_SCORES[index],
  }))

function maturityQuestion(
  id: string,
  dimension: DimensionId,
  text: string,
  scaleLow: string,
  scaleHigh: string,
  labels: [string, string, string, string, string],
): Question {
  return { id, dimension, text, scaleLow, scaleHigh, options: maturityOptions(labels) }
}

export const QUESTIONS: Question[] = [
  maturityQuestion(
    'autonomy-1',
    'autonomousAgents',
    'Before a human has to jump in, how far can your agents get on their own?',
    'Suggestions only',
    'Full tasks done',
    [
      'Agents only answer questions or autocomplete code',
      'Agents make small edits while an engineer stays in the loop',
      'Agents complete scoped tickets and open pull requests',
      'Agents investigate, implement, test, and revise their own work',
      'Agents own multi-hour workflows across code, infrastructure, and external systems',
    ],
  ),
  maturityQuestion(
    'autonomy-2',
    'autonomousAgents',
    'How automated is agent triggering — from engineers starting every run by hand to continuous runs that self-heal and recover from common failures?',
    'Manual triggers',
    'Self-healing runs',
    [
      'Engineers manually start and watch every run',
      'Engineers start runs and check the result afterward',
      'Issues or pull requests trigger agents with a final human review',
      'Events and schedules trigger agents with risk-based approval gates',
      'Agents run continuously, escalate exceptions, and recover from common failures',
    ],
  ),
  maturityQuestion(
    'harness-1',
    'agentHarnesses',
    'How reusable is agent environment setup — from hand-configured every time to platform-provisioned templates with policies, telemetry, and tested defaults?',
    'Hand-configured',
    'Platform-managed',
    [
      'Every run starts from a blank environment configured by hand',
      'Engineers reuse local setup notes and copy-paste commands',
      'Teams share scripts and config files for common environments',
      'Versioned environment templates provision services, tools, and credentials',
      'A platform provisions reusable environments with policies, telemetry, and tested defaults',
    ],
  ),
  maturityQuestion(
    'context-1',
    'contextAndTools',
    'How much can agents see beyond the prompt and open files?',
    'Prompt only',
    'Live stack context',
    [
      'Only the current prompt and open files',
      'The full repository and static instruction files',
      'Repository plus issue tracker, documentation, and code search',
      'Live services, logs, metrics, browser state, and prior run history',
      'Task-specific context assembled automatically with freshness and access controls',
    ],
  ),
  maturityQuestion(
    'verification-1',
    'verification',
    'How do you verify agent-written code — from trusting the diff looks reasonable to requiring reproduced evidence and independent checks?',
    'Diff review',
    'Verified evidence',
    [
      'We mostly rely on the diff looking reasonable',
      'A human reads the change before it ships',
      'Existing tests and static checks must pass',
      'The agent demonstrates the behavior in a live environment',
      'Task-specific evidence, independent checks, and reproducible artifacts are required',
    ],
  ),
  maturityQuestion(
    'evaluation-1',
    'evaluation',
    'How mature are your agent evals — from none at all to versioned eval gates before any model, prompt, or workflow change?',
    'None',
    'Versioned gates',
    [
      'We don\'t run evals',
      'Planning to, not started yet',
      'We spot-check a few tasks manually',
      'We maintain a repeatable eval set with pass and fail criteria',
      'We run versioned evals before changing models, prompts, or workflows',
    ],
  ),
  maturityQuestion(
    'observability-1',
    'observability',
    'How debuggable are failed agent runs — from not being able to reconstruct what happened to standard post-mortems with failure classification and tracked follow-ups?',
    "Can't reconstruct",
    'Standard post-mortems',
    [
      'We usually cannot reconstruct what happened',
      'An engineer manually pieces together logs and chat history',
      'A run timeline shows the failed step and related output',
      'Traces correlate agent decisions with environment and service telemetry',
      'Post-mortems are standard, with failure classification and tracked follow-ups',
    ],
  ),
  maturityQuestion(
    'recordings-1',
    'screenRecordings',
    'How well do you capture agent screen activity — from no visual recording to searchable, policy-retained recordings linked to traces and verification evidence?',
    'No recording',
    'Searchable & retained',
    [
      'No visual recording is available',
      'Engineers take screenshots manually when needed',
      'Browser tests capture screenshots or video on failure',
      'Every UI task records a synchronized video with the action timeline',
      'Recordings are searchable, retained by policy, and linked to traces and verification evidence',
    ],
  ),
  maturityQuestion(
    'controls-1',
    'governanceAndCost',
    'How do you limit agent impact and cost — from no limits or tracking to adaptive controls that block anomalies and optimize spend mid-run?',
    'No limits',
    'Adaptive controls',
    [
      'Agents run with the same access as the engineer, with no cost tracking',
      'Teams rely on human supervision and monthly vendor invoices',
      'Agents run in isolated environments with scoped permissions and team-level spend reports',
      'Policies restrict access by task risk, with per-run budgets and model routing rules',
      'Controls adapt during the run, block anomalies, and optimize spend against verified success',
    ],
  ),
]

export const DIMENSION_MAP = Object.fromEntries(
  DIMENSIONS.map((dimension) => [dimension.id, dimension]),
) as Record<(typeof DIMENSIONS)[number]['id'], DimensionMeta>
