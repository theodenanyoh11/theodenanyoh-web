import React from 'react'

import { cn } from '@/utilities/ui'

import { Eyebrow, Heading } from './Heading'

/** Eyebrow and H2 on the left, an optional action on the right. */
export const SectionHeader: React.FC<{
  eyebrow?: string | null
  title: string
  action?: React.ReactNode
  className?: string
  titleClassName?: string
}> = ({ eyebrow, title, action, className, titleClassName }) => (
  <div className={cn('flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between', className)}>
    <div className="flex flex-col gap-4">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as="h2" className={cn('max-w-[720px]', titleClassName)}>
        {title.replace(/\.$/, '')}
      </Heading>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

/** Page title block for inner pages. One per page, holds the H1. */
export const PageHeader: React.FC<{
  eyebrow?: string | null
  title: string
  intro?: React.ReactNode
  children?: React.ReactNode
}> = ({ eyebrow, title, intro, children }) => (
  <header className="site-container pb-10 pt-12 lg:pb-16 lg:pt-[88px]">
    <div className="flex max-w-[960px] flex-col gap-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as="h1">{title.replace(/\.$/, '')}</Heading>
      {intro && <p className="type-lead max-w-[680px] text-body">{intro}</p>}
      {children}
    </div>
  </header>
)
