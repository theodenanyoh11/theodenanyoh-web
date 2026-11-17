import React from 'react'

import { cn } from '@/utilities/ui'

export type Stage = 'live' | 'building' | 'private' | 'retired'

const defaultLabel: Record<Stage, string> = {
  live: 'Live',
  building: 'In build',
  private: 'Private',
  retired: 'Retired',
}

/**
 * Status pill. A filled cobalt dot means the product is live.
 * A hollow dot means it is not.
 */
export const StatusPill: React.FC<{
  stage?: Stage | null
  label?: string | null
  tone?: 'light' | 'dark'
  className?: string
}> = ({ stage, label, tone = 'light', className }) => {
  const text = label || (stage ? defaultLabel[stage] : null)
  if (!text) return null

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-pill px-[14px] py-2 text-[14px] font-semibold leading-[18px]',
        tone === 'dark' ? 'bg-[#242424] text-paper' : 'bg-paper text-ink',
        className,
      )}
    >
      {stage && (
        <span
          aria-hidden="true"
          className={cn(
            'size-2 shrink-0 rounded-pill',
            stage === 'live'
              ? 'bg-cobalt'
              : cn('border-[1.5px]', tone === 'dark' ? 'border-paper' : 'border-ink'),
          )}
        />
      )}
      {text}
    </span>
  )
}
