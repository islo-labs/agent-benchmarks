import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  buildShareMessage,
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

type CopyFeedback = 'message' | 'link' | 'linkedin' | null

export function ShareBar({ state, result, onDownload, downloading }: ShareBarProps) {
  const [feedback, setFeedback] = useState<CopyFeedback>(null)

  const shareUrl = buildShareUrl(state, result)
  const shareText = buildShareText(result)
  const shareMessage = buildShareMessage(result, state)

  const showFeedback = (kind: CopyFeedback) => {
    setFeedback(kind)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleCopyMessage = async () => {
    if (await copyToClipboard(shareMessage)) showFeedback('message')
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
      <h3 className="mb-1 text-sm font-semibold text-ink">Share your result</h3>
      <p className="mb-4 text-sm text-ink-4">
        Challenge your peers — how does their team compare?
      </p>

      <div className="mb-5 rounded-xl border border-line bg-bg-1 px-4 py-3">
        <p className="text-sm leading-relaxed text-ink-3">{shareText}</p>
        <p className="mt-2 truncate font-mono text-[11px] text-ink-4">{shareUrl}</p>
      </div>

      {feedback === 'linkedin' && (
        <p className="mb-4 text-sm text-islo-deep">
          Message copied. Paste it into your LinkedIn post (⌘V).
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopyMessage}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-all hover:bg-islo"
        >
          {feedback === 'message' ? '✓ Copied!' : 'Copy message'}
        </button>

        <button
          type="button"
          onClick={handleLinkedIn}
          className="rounded-lg border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1"
        >
          LinkedIn
        </button>

        <button
          type="button"
          onClick={() => shareToX(shareText, shareUrl)}
          className="rounded-lg border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1"
        >
          X / Twitter
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-lg border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1"
        >
          {feedback === 'link' ? '✓ Copied!' : 'Copy link'}
        </button>

        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="rounded-lg border border-line-2 bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-1 disabled:opacity-50"
        >
          {downloading ? 'Generating…' : 'Download card'}
        </button>
      </div>
    </motion.div>
  )
}
