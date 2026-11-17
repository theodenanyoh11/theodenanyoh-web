import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post as PostType } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArticleRow, postCategory } from '@/components/site/ArticleRow'
import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { Heading } from '@/components/site/Heading'
import { VideoEmbed } from '@/components/site/VideoEmbed'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  const category = postCategory(post)
  const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const published = post.publishedAt
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(post.publishedAt),
      )
    : null
  const related = (post.relatedPosts ?? []).filter(
    (related): related is PostType => typeof related === 'object',
  )
  const shareUrl = `${getServerSideURL()}${url}`

  return (
    <article>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <header className="site-container flex flex-col gap-6 pb-10 pt-12 lg:pb-12 lg:pt-[72px]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-[15px] leading-[18px]">
          <Link className="text-muted-foreground underline underline-offset-4" href="/posts">
            Writing
          </Link>
          {category && (
            <>
              <span aria-hidden="true" className="text-muted-foreground">
                /
              </span>
              <span className="font-semibold text-ink">{category}</span>
            </>
          )}
        </nav>
        <Heading as="h1" className="max-w-[1000px]">
          {post.title.replace(/\.$/, '')}
        </Heading>
        <p className="text-[15px] leading-[18px] text-muted-foreground">
          <span className="font-semibold text-ink">Theo Denanyoh</span>
          {published && ` · Published ${published}`}
          {post.duration && ` · ${post.duration} ${post.kind === 'video' ? 'watch' : 'read'}`}
        </p>
      </header>

      {post.kind === 'video' && post.videoUrl ? (
        <div className="site-container">
          <div className="aspect-video overflow-hidden rounded-tile bg-ink">
            <VideoEmbed title={post.title} url={post.videoUrl} />
          </div>
        </div>
      ) : (
        heroImage && (
          <div className="site-container">
            <div className="relative aspect-[16/10] overflow-hidden rounded-tile bg-mist lg:aspect-[9/4]">
              <Media
                fill
                htmlElement={null}
                pictureClassName="absolute inset-0"
                imgClassName="object-cover"
                priority
                resource={heroImage}
                size="(min-width: 1024px) 1312px, 100vw"
              />
            </div>
          </div>
        )
      )}

      <div className="site-container flex flex-col gap-8 pt-10 lg:flex-row lg:gap-24 lg:pt-20">
        <aside className="flex shrink-0 flex-row gap-6 lg:w-[200px] lg:flex-col lg:gap-[14px]">
          <a
            className="text-[15px] font-semibold leading-[18px] text-ink underline underline-offset-4"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            rel="noopener"
            target="_blank"
          >
            Share on LinkedIn
          </a>
          <Link
            className="text-[15px] font-semibold leading-[18px] text-ink underline underline-offset-4"
            href="/posts"
          >
            All writing
          </Link>
        </aside>
        <div className="min-w-0 lg:w-[720px] lg:shrink-0">
          {post.excerpt && (
            <p className="pb-6 text-[22px] leading-8 text-ink lg:text-[24px] lg:leading-9">
              {post.excerpt}
            </p>
          )}
          <RichText className="article-body" data={post.content} enableGutter={false} />
        </div>
      </div>

      <section
        className={cn(
          'site-container flex flex-col gap-8 pb-[72px] lg:pb-32',
          related.length > 0 && 'pt-[72px] lg:pt-32',
        )}
      >
        {related.length > 0 && (
          <>
            <Heading as="h2">Keep reading</Heading>
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-5">
              {related.slice(0, 3).map((item) => (
                <ArticleRow key={item.id} post={item} />
              ))}
            </div>
          </>
        )}
      </section>

      <AudienceRoutes />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
