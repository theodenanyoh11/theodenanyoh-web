'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
}> = (props) => {
  const { className, doc, relationTo, showCategories } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200',
        className,
      )}
    >
      <Link
        href={href}
        className="block flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg"
      >
        <div className="relative w-full h-48 overflow-hidden">
          {!metaImage && (
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-xs">
              No image available
            </div>
          )}
          {metaImage && typeof metaImage !== 'string' && (
            <Media
              resource={metaImage}
              imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {showCategories && hasCategories && (
          <div className="text-xs uppercase text-muted-foreground mb-2 order-1">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category?.title) {
                const isLast = index === categories.length - 1
                return (
                  <Fragment key={index}>
                    {category.title}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}

        {titleToUse && (
          <h3 className="text-lg font-semibold mb-1 order-2 leading-tight">
            <Link
              href={href}
              className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
            >
              {titleToUse}
            </Link>
          </h3>
        )}

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 order-3 mb-auto">
            {sanitizedDescription}
          </p>
        )}
        {!description && hasCategories && <div className="order-3 mb-auto"></div>}
      </div>
    </article>
  )
}
