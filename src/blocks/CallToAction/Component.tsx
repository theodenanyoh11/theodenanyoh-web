import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = (props) => {
  // Handle undefined/null props gracefully
  if (!props || typeof props !== 'object') {
    return null
  }

  const { links, richText } = props
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            const appearance = link.appearance || 'default'
            return <CMSLink key={i} size="lg" {...link} appearance={appearance} />
          })}
        </div>
      </div>
    </div>
  )
}
