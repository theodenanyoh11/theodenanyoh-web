import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Card } from '@/components/Card'

export const CollectionArchive: React.FC<{
  posts: any[] // Use any[] for now, rely on type guard below
}> = ({ posts }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {posts.map((post, i) => {
          // Type guard to check if it's a SearchResult-like object
          const isSearchResult =
            typeof post === 'object' &&
            post !== null &&
            'doc' in post &&
            post.doc &&
            typeof post.doc === 'object'

          let docToRender: Partial<Post> = {}
          if (isSearchResult) {
            docToRender = post.doc as Partial<Post> // Extract doc from search result
          } else {
            docToRender = post as Partial<Post> // Use post directly if not search result
          }

          // Extract props for Card component from docToRender
          const { slug, title, categories, meta } = docToRender
          const description = meta?.description
          const image = (meta as any)?.image
          const imageResource = typeof image === 'object' && image !== null ? image : null
          // Determine href based on whether it's a search result or direct post
          const postHref = isSearchResult ? `/posts/${slug}` : `/posts/${slug}` // Adjust if other collections are searchable

          return (
            <Card
              key={i}
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
