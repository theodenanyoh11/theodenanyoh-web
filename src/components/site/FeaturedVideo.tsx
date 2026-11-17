import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

import { postCategory } from './ArticleRow'
import { PlayIcon } from './Button'
import { Eyebrow } from './Heading'

/** Wide card for the latest video: poster on the left, title and excerpt on the right. */
export const FeaturedVideo: React.FC<{ post: Post; as?: 'h2' | 'h3' }> = ({
  post: video,
  as: Tag = 'h3',
}) => {
  const poster = video.heroImage && typeof video.heroImage === 'object' ? video.heroImage : null

  return (
    <Link
      className="group flex flex-col gap-6 rounded-tile bg-mist p-5 md:flex-row lg:gap-8 lg:p-6"
      href={`/posts/${video.slug}`}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-media bg-gold-soft md:w-[360px] lg:w-[640px]">
        {poster ? (
          <Media
            fill
            htmlElement={null}
            pictureClassName="absolute inset-0"
            imgClassName="object-cover"
            resource={poster}
            size="(min-width: 1024px) 640px, 100vw"
          />
        ) : (
          <p className="flex size-full items-start p-5 pb-20 font-display text-[24px] font-extrabold leading-7 tracking-[-0.03em] text-ink lg:items-center lg:p-8 lg:pb-8 lg:text-[40px] lg:leading-[44px]">
            {video.title}
          </p>
        )}
        <span className="absolute bottom-5 left-5 flex items-center gap-[10px] rounded-pill bg-paper py-2 pl-2 pr-4 text-[14px] font-semibold leading-[18px] text-ink">
          <span className="flex size-9 items-center justify-center rounded-pill bg-cobalt text-paper">
            <PlayIcon className="h-[14px] w-3" />
          </span>
          Video{video.duration ? ` · ${video.duration}` : ''}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 lg:py-3 lg:pr-3">
        <div className="flex flex-col gap-4">
          {postCategory(video) && <Eyebrow>{postCategory(video)}</Eyebrow>}
          <Tag className="type-h3 group-hover:text-cobalt">{video.title}</Tag>
          {video.excerpt && <p className="text-[18px] leading-7">{video.excerpt}</p>}
        </div>
        <span className="text-[17px] font-semibold leading-[22px] text-ink underline decoration-1 underline-offset-4">
          Watch the episode
        </span>
      </div>
    </Link>
  )
}
