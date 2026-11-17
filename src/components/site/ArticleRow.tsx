import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

export const postCategory = (post: Post): string | null => {
  const first = post.categories?.[0]
  return first && typeof first === 'object' ? first.title : null
}

export const postMeta = (post: Post): string =>
  [post.kind === 'video' ? 'Video' : 'Read', post.duration].filter(Boolean).join(' · ')

/** Article teaser under a heavy rule: category, title, read time. */
export const ArticleRow: React.FC<{ post: Post; as?: 'h3' | 'h2' }> = ({
  post,
  as: Tag = 'h3',
}) => (
  <Link
    className="group flex flex-col gap-[14px] border-t-2 border-ink pt-6 lg:pt-8"
    href={`/posts/${post.slug}`}
  >
    {postCategory(post) && <p className="type-label text-cobalt">{postCategory(post)}</p>}
    <Tag className="type-h4 group-hover:text-cobalt">{post.title}</Tag>
    <p className="text-[15px] leading-[18px] text-muted-foreground">{postMeta(post)}</p>
  </Link>
)
