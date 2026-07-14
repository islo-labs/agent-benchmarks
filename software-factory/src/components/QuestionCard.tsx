import { motion } from 'framer-motion'
import { DIMENSION_MAP } from '../data/questions'
import type { Question } from '../types'
import { MaturityScale } from './MaturityScale'

interface QuestionCardProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedOptionId?: string
  onSelect: (optionId: string) => void
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  const dimension = DIMENSION_MAP[question.dimension]

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-2xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className={[
            'rounded-[4px] px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em]',
            dimension.category === 'agentic'
              ? 'bg-islo-tint text-islo-deep'
              : 'bg-bg-2 text-ink-3',
          ].join(' ')}
        >
          {dimension.shortLabel}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      <h2 className="mb-8 text-xl font-semibold leading-[1.35] tracking-[-0.028em] text-ink md:text-2xl md:leading-[1.3]">
        {question.text}
      </h2>

      <MaturityScale
        question={question}
        selectedOptionId={selectedOptionId}
        onSelect={onSelect}
      />
    </motion.div>
  )
}
