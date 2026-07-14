import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { QUESTIONS } from '../data/questions'
import { getAnsweredCount } from '../lib/scoring'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { TrustBanner } from './TrustBanner'

interface QuizProps {
  answers: Record<string, string>
  currentIndex: number
  onAnswer: (questionId: string, optionId: string) => void
  onIndexChange: (index: number) => void
  onComplete: () => void
}

export function Quiz({
  answers,
  currentIndex,
  onAnswer,
  onIndexChange,
  onComplete,
}: QuizProps) {
  const question = QUESTIONS[currentIndex]
  const answeredCount = getAnsweredCount(answers)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === QUESTIONS.length - 1
  const hasAnswer = answers[question.id] !== undefined

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete()
    } else {
      onIndexChange(currentIndex + 1)
    }
  }, [currentIndex, isLast, onComplete, onIndexChange])

  const goBack = useCallback(() => {
    if (!isFirst) onIndexChange(currentIndex - 1)
  }, [currentIndex, isFirst, onIndexChange])

  const handleSelect = useCallback(
    (optionId: string) => {
      onAnswer(question.id, optionId)
      setTimeout(() => {
        if (isLast) {
          onComplete()
        } else {
          onIndexChange(currentIndex + 1)
        }
      }, 280)
    },
    [currentIndex, isLast, onAnswer, onComplete, onIndexChange, question.id],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return

      const optionIndex = Number(e.key) - 1
      const selectedOption = question.options[optionIndex]

      if (selectedOption) {
        e.preventDefault()
        handleSelect(selectedOption.id)
        return
      }

      if (e.key === 'ArrowLeft') goBack()
      if (e.key === 'ArrowRight' && hasAnswer) goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goBack, goNext, handleSelect, hasAnswer, question.options])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-8 pb-12 md:max-w-4xl md:pt-10 md:pb-16">
      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-4">
            Software Factory Grader
          </p>
          <h1 className="mb-3 text-3xl font-semibold tracking-[-0.028em] text-ink md:text-[40px] md:leading-[1.15]">
            How <span className="rounded-[4px] bg-islo-tint px-[0.22em] py-[0.1em] text-islo-deep">AI-driven</span> is your software engineering?
          </h1>
          <p className="max-w-[56ch] text-[17px] leading-[1.55] text-ink-3">
            {QUESTIONS.length} quick questions. Benchmark your SDLC against hundreds of teams building agent-driven software factories.
          </p>
        </motion.div>

        <div className="mt-6">
          <TrustBanner compact />
        </div>
      </header>

      <div className="mb-10">
        <ProgressBar current={answeredCount} total={QUESTIONS.length} />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={question.id}
          question={question}
          questionIndex={currentIndex}
          totalQuestions={QUESTIONS.length}
          selectedOptionId={answers[question.id]}
          onSelect={handleSelect}
        />
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          className="rounded-lg px-4 py-2 text-sm text-ink-3 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Back
        </button>

        {isLast && (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
            Pick an answer to see your results
          </span>
        )}
      </div>
    </div>
  )
}
