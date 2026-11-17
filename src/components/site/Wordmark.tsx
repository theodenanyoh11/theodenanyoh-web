import React from 'react'

import { cn } from '@/utilities/ui'

/** The "Td." mark. Ink or paper letters, always a cobalt full stop. */
export const Wordmark: React.FC<{ className?: string; tone?: 'ink' | 'paper' }> = ({
  className,
  tone = 'ink',
}) => (
  <span
    className={cn(
      'font-display font-extrabold tracking-[-0.06em]',
      tone === 'ink' ? 'text-ink' : 'text-paper',
      className,
    )}
  >
    Td<span className="text-cobalt">.</span>
  </span>
)
