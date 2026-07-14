import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Question } from '../types'

interface MaturityScaleProps {
  question: Question
  selectedOptionId?: string
  onSelect: (optionId: string) => void
}

export function MaturityScale({ question, selectedOptionId, onSelect }: MaturityScaleProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const selectedIndex = question.options.findIndex((option) => option.id === selectedOptionId)
  const activeIndex = hoveredIndex ?? (selectedIndex >= 0 ? selectedIndex : null)
  const previewLabel = activeIndex !== null ? question.options[activeIndex].label : null
  const isPreviewOnly = hoveredIndex !== null && hoveredIndex !== selectedIndex

  return (
    <div className="rounded-2xl border border-line-2 bg-paper px-6 py-7 shadow-[0_1px_#00000005,0_18px_50px_-30px_#00000045] md:px-8">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <span className="max-w-[10rem] text-[13px] font-medium leading-snug text-ink-4">
          {question.scaleLow}
        </span>
        <span className="max-w-[10rem] text-right text-[13px] font-semibold leading-snug text-islo-deep">
          {question.scaleHigh}
        </span>
      </div>

      <div
        className="relative mx-1 flex items-start justify-between"
        role="radiogroup"
        aria-label={question.text}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div
          className="pointer-events-none absolute left-3 right-3 top-[13px] h-[3px] -translate-y-1/2 rounded-full bg-line-2"
          aria-hidden="true"
        />
        {selectedIndex > 0 && (
          <div
            className="pointer-events-none absolute left-3 top-[13px] h-[3px] -translate-y-1/2 rounded-full bg-islo transition-all duration-300 ease-out"
            style={{ width: `calc((100% - 24px) * ${selectedIndex / (question.options.length - 1)})` }}
            aria-hidden="true"
          />
        )}

        {question.options.map((option, index) => {
          const selected = index === selectedIndex
          const previewed = hoveredIndex === index

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${index + 1}. ${option.label}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onClick={() => onSelect(option.id)}
              className="group relative z-10 flex flex-col items-center gap-2.5 outline-none"
            >
              <span
                className={[
                  'flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 transition-all duration-200',
                  selected
                    ? 'scale-110 border-islo bg-islo shadow-[0_0_0_5px_rgba(122,61,230,0.14)]'
                    : previewed
                      ? 'border-islo bg-islo-tint'
                      : 'border-line-2 bg-paper group-hover:border-islo/60',
                ].join(' ')}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />}
              </span>
              <span
                className={[
                  'font-mono text-[11px] tabular-nums transition-colors duration-200',
                  selected ? 'font-semibold text-islo-deep' : previewed ? 'text-islo-deep' : 'text-ink-4',
                ].join(' ')}
              >
                {index + 1}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 border-t border-line pt-4">
        <div className="flex min-h-[3rem] items-start gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {previewLabel ? (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-start gap-3"
              >
                <span
                  className={[
                    'mt-px shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.07em]',
                    isPreviewOnly ? 'bg-bg-1 text-ink-4' : 'bg-islo-tint text-islo-deep',
                  ].join(' ')}
                >
                  {isPreviewOnly ? `L${(activeIndex ?? 0) + 1}` : 'Selected'}
                </span>
                <p className="text-sm leading-relaxed text-ink md:text-[15px]">{previewLabel}</p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="text-sm text-ink-4"
              >
                Hover, tap, or press 1–5 to choose your level
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
