'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'

interface CardProps {
  className?: string
  title?: string | null
  description?: string | null
  image?: MediaType | null
  categories?: Post['categories'] | null
  href?: string | null
  showCategories?: boolean
}

export const Card: React.FC<CardProps> = (props) => {
  const { className, title, description, image, categories, href, showCategories } = props

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const metaImage = image

  const defaultHref = '#'

  return (
    <article
      className={cn(
        'flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200',
        className,
      )}
    >
      <Link
        href={href || defaultHref}
        className="block flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg"
      >
        <div className="relative w-full h-48 overflow-hidden">
          {!metaImage && (
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-xs">
              No image available
            </div>
          )}
          {metaImage && (
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
              href={href || defaultHref}
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
