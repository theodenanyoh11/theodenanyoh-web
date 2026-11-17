import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { ContentFeatureBlock } from '@/payload-types'

import { ArticleRow } from '@/components/site/ArticleRow'
import { TextLink } from '@/components/site/Button'
import { FeaturedVideo } from '@/components/site/FeaturedVideo'
import { SectionHeader } from '@/components/site/SectionHeader'

export const ContentFeatureBlockComponent: React.FC<ContentFeatureBlock> = async ({
  eyebrow,
  title,
}) => {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: videos }, { docs: articles }] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { kind: { equals: 'video' } },
      sort: '-publishedAt',
      depth: 1,
      limit: 1,
    }),
    payload.find({
      collection: 'posts',
      where: { kind: { not_equals: 'video' } },
      sort: '-publishedAt',
      depth: 1,
      limit: 3,
    }),
  ])

  const video = videos[0]
  if (!video && !articles.length) return null

  return (
    <section className="site-container flex flex-col gap-8 pt-[72px] lg:pt-32">
      <SectionHeader
        action={
          <TextLink className="text-[16px] leading-5" href="/posts">
            All articles and videos
          </TextLink>
        }
        eyebrow={eyebrow}
        title={title || 'What I am learning out loud'}
      />

      {video && <FeaturedVideo post={video} />}

      {articles.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-5">
          {articles.map((post) => (
            <ArticleRow key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}
