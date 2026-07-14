import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  buildShareText,
  buildShareUrl,
  copyToClipboard,
  shareToLinkedIn,
  shareToX,
} from '../lib/share'
import type { GraderResult, GraderState } from '../types'

interface ShareBarProps {
  state: GraderState
  result: GraderResult
  onDownload: () => void
  downloading: boolean
}

type CopyFeedback = 'link' | 'linkedin' | null

export function ShareBar({ state, result, onDownload, downloading }: ShareBarProps) {
  const [feedback, setFeedback] = useState<CopyFeedback>(null)

  const shareUrl = buildShareUrl(state, result)
  const shareText = buildShareText(result)

  const showFeedback = (kind: CopyFeedback) => {
    setFeedback(kind)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleCopyLink = async () => {
    if (await copyToClipboard(shareUrl)) showFeedback('link')
  }

  const handleLinkedIn = async () => {
    const copied = await shareToLinkedIn(shareUrl, shareText)
    if (copied) showFeedback('linkedin')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-line-2 bg-paper p-6 shadow-[0_1px_#00000005,0_12px_40px_-28px_#00000040]"
    >
      <h3 className="text-center text-base font-semibold text-ink">
        Challenge another team
      </h3>
      <p className="mx-auto mb-4 mt-1 max-w-xs text-center text-sm text-ink-4">
        Challenge a VP R&amp;D, CTO, or another engineering team to beat your grade.
      </p>

      <button
        type="button"
        onClick={() => shareToX(shareText, shareUrl)}
        className="w-full rounded-xl bg-ink px-5 py-4 text-base font-semibold text-bg transition-all hover:bg-islo"
      >
        Post your Grade {result.grade} on X →
      </button>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleLinkedIn}
          className="rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1"
        >
          {feedback === 'linkedin' ? '✓ Copied — paste it' : 'Post on LinkedIn'}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1"
        >
          {feedback === 'link' ? '✓ Copied!' : 'Copy link'}
        </button>
      </div>

      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        className="mt-3 w-full py-1 text-sm text-ink-4 transition-colors hover:text-ink disabled:opacity-50"
      >
        {downloading ? 'Generating…' : 'Download result image'}
      </button>
    </motion.div>
  )
}
