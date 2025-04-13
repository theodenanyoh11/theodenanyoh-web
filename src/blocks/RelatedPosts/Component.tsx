import React from 'react'
import clsx from 'clsx'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '@/components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: (string | Post)[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          // Extract props for Card
          const { slug, title, categories, meta } = doc
          const description = meta?.description
          // Use type assertion for image access, mirroring other components
          const image = (meta as any)?.image
          const imageResource = typeof image === 'object' && image !== null ? image : null
          const postHref = `/posts/${slug}`

          return (
            <Card
              key={index}
              title={title}
              description={description}
              image={imageResource}
              categories={categories}
              href={postHref}
              showCategories
            />
          )
        })}
      </div>
    </div>
  )
}
