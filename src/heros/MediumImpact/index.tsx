import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import clsx from 'clsx'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const hasMedia = media && typeof media === 'object'

  return (
    <div
      className={clsx(
        'container grid grid-cols-1 gap-8 pt-6 pb-12',
        hasMedia && 'md:grid-cols-2 md:items-center',
      )}
    >
      {hasMedia && (
        <div className="order-2 md:order-1">
          <Media
            resource={media}
            priority
            className="overflow-hidden rounded-md"
            imgClassName="w-full h-auto object-cover"
          />
          {media?.caption && (
            <div className="mt-3">
              <RichText data={media.caption} enableGutter={false} />
            </div>
          )}
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col justify-center',
          hasMedia ? 'order-1 md:order-none' : 'order-1 col-span-full',
        )}
      >
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
