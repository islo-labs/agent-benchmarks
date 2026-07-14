import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Quiz } from './components/Quiz'
import { Result } from './components/Result'
import { GraderFooter } from './components/GraderFooter'
import { trackResult } from './lib/leads'
import { computeResult, isQuizComplete } from './lib/scoring'
import { readStateFromUrl, updateShareMeta, updateUrlWithState } from './lib/share'
import type { CohortId, GraderState, Stage } from './types'

const DEFAULT_STATE: GraderState = {
  cohort: 'scaleup',
  answers: {},
}

function resolveInitialState(): { state: GraderState; stage: Stage; questionIndex: number } {
  const fromUrl = readStateFromUrl()
  if (fromUrl && isQuizComplete(fromUrl.answers)) {
    return { state: fromUrl, stage: 'result', questionIndex: 0 }
  }
  if (fromUrl) {
    return { state: fromUrl, stage: 'quiz', questionIndex: 0 }
  }
  return { state: DEFAULT_STATE, stage: 'quiz', questionIndex: 0 }
}

export default function App() {
  const initial = useMemo(() => resolveInitialState(), [])
  const [stage, setStage] = useState<Stage>(initial.stage)
  const [state, setState] = useState<GraderState>(initial.state)
  const [questionIndex, setQuestionIndex] = useState(initial.questionIndex)
  const trackedCompletionKey = useRef<string | null>(null)

  const result = useMemo(
    () => (isQuizComplete(state.answers) ? computeResult(state.answers, state.cohort) : null),
    [state],
  )

  useEffect(() => {
    if (Object.keys(state.answers).length > 0 || state.cohort !== DEFAULT_STATE.cohort) {
      updateUrlWithState(state)
    }
  }, [state])

  useEffect(() => {
    if (stage === 'result' && result) {
      updateShareMeta(result)
    }
  }, [stage, result])

  useEffect(() => {
    if (stage !== 'result' || !result) return

    const completionKey = JSON.stringify(state.answers)
    if (trackedCompletionKey.current === completionKey) return

    trackedCompletionKey.current = completionKey
    trackResult(state, result)
  }, [stage, result, state])

  const handleAnswer = useCallback((questionId: string, optionId: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
    }))
  }, [])

  const handleCohortChange = useCallback((cohort: CohortId) => {
    setState((prev) => ({ ...prev, cohort }))
  }, [])

  const handleComplete = useCallback(() => {
    setStage('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRetake = useCallback(() => {
    trackedCompletionKey.current = null
    setState(DEFAULT_STATE)
    setQuestionIndex(0)
    setStage('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(122,61,230,0.10),transparent)]" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'quiz' ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Quiz
              answers={state.answers}
              currentIndex={questionIndex}
              onAnswer={handleAnswer}
              onIndexChange={setQuestionIndex}
              onComplete={handleComplete}
            />
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Result result={result} state={state} onCohortChange={handleCohortChange} onRetake={handleRetake} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <GraderFooter />
    </div>
  )
}
