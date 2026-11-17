import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import { postCategory, postMeta } from '@/components/site/ArticleRow'
import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { FeaturedVideo } from '@/components/site/FeaturedVideo'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { cn } from '@/utilities/ui'

export const metadata: Metadata = {
  title: 'Writing and video | Theo Denanyoh',
  description:
    'Notes on product leadership, on building software alone, and on the tools Theo Denanyoh uses to do both.',
}

type Props = { searchParams?: Promise<{ topic?: string }> }

export default async function WritingPage({ searchParams }: Props) {
  const { topic } = (await searchParams) ?? {}
  const payload = await getPayload({ config: configPromise })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  const topics = [...new Set(posts.flatMap((post) => postCategory(post) ?? []))].sort()
  const active = topics.find((name) => name === topic) ?? null
  const visible = active ? posts.filter((post) => postCategory(post) === active) : posts
  const featured = visible.find((post) => post.kind === 'video')
  const rest = visible.filter((post) => post !== featured)

  return (
    <article>
      <header className="site-container flex flex-col gap-6 pb-10 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-14 lg:pt-[88px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Writing and video</Eyebrow>
          <Heading as="h1" className="max-w-[760px]">
            What I am learning out loud
          </Heading>
        </div>
        <p className="type-lead max-w-[440px] shrink-0">
          Notes on product leadership, on building software alone, and on the tools I use to do
          both.
        </p>
      </header>

      {topics.length > 1 && (
        <nav aria-label="Filter by topic" className="site-container pb-8">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {[null, ...topics].map((name) => (
              <li className="shrink-0" key={name ?? 'all'}>
                <Link
                  aria-current={name === active ? 'true' : undefined}
                  className={cn(
                    'block rounded-pill px-[18px] py-[10px] text-[15px] font-semibold leading-[18px]',
                    name === active ? 'bg-ink text-paper' : 'bg-mist text-ink hover:bg-rule',
                  )}
                  href={name ? `/posts?topic=${encodeURIComponent(name)}` : '/posts'}
                  scroll={false}
                >
                  {name ?? 'All'}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {featured && (
        <div className="site-container">
          <FeaturedVideo as="h2" post={featured} />
        </div>
      )}

      <section className="site-container pb-[72px] pt-10 lg:pb-32 lg:pt-16">
        {rest.length > 0 ? (
          <ul>
            {rest.map((post, i) => {
              const image =
                post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
              return (
                <li
                  className={cn(
                    i === 0 ? 'border-t-2 border-ink' : 'border-t border-rule',
                    i === rest.length - 1 && 'border-b border-b-rule',
                  )}
                  key={post.id}
                >
                  <Link
                    className="group flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:gap-8"
                    href={`/posts/${post.slug}`}
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-media bg-cobalt-soft lg:h-[176px] lg:w-[280px]">
                      {image ? (
                        <Media
                          fill
                          imgClassName="object-cover"
                          resource={image}
                          size="(min-width: 1024px) 280px, 100vw"
                        />
                      ) : (
                        // No image: show the topic as a typographic tile.
                        <span className="flex size-full items-center justify-center px-4 text-center font-display text-[32px] font-extrabold leading-9 tracking-[-0.04em] text-cobalt">
                          {postCategory(post) ?? 'Notes'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      {postCategory(post) && <Eyebrow>{postCategory(post)}</Eyebrow>}
                      <h2 className="type-h3 max-w-[720px] group-hover:text-cobalt">
                        {post.title}
                      </h2>
                      {post.excerpt && <p className="type-body max-w-[720px]">{post.excerpt}</p>}
                    </div>
                    <p className="shrink-0 text-[15px] leading-[18px] text-muted-foreground lg:w-[120px] lg:text-right">
                      {postMeta(post)}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          !featured && <p className="type-lead">Nothing published here yet.</p>
        )}
      </section>

      <AudienceRoutes />
    </article>
  )
}
