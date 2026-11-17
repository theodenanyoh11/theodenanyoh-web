import React from 'react'

import { cn } from '@/utilities/ui'

type Size = 'h1' | 'h1-page' | 'h2' | 'h3' | 'h4'

const sizeClass: Record<Size, string> = {
  h1: 'type-h1',
  'h1-page': 'type-h1-page',
  h2: 'type-h2',
  h3: 'type-h3',
  h4: 'type-h4',
}

/**
 * Display heading. H1 and H2 end with the cobalt full stop, the brand's one mark.
 * Pass `stop={false}` when the text already ends with punctuation.
 */
export const Heading: React.FC<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  size?: Size
  stop?: boolean
  className?: string
  children: React.ReactNode
}> = ({ as, size, stop, className, children }) => {
  const Tag = as ?? 'h2'
  const resolvedSize: Size = size ?? (Tag === 'h1' ? 'h1-page' : Tag === 'p' ? 'h4' : Tag)
  const withStop = stop ?? (Tag === 'h1' || Tag === 'h2')

  return (
    <Tag className={cn(sizeClass[resolvedSize], className)}>
      {children}
      {withStop && (
        <span aria-hidden="true" className="text-cobalt">
          .
        </span>
      )}
    </Tag>
  )
}

export const Eyebrow: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <p className={cn('type-label text-cobalt', className)}>{children}</p>
