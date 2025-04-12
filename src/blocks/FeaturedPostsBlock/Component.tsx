import React from 'react'
import Link from 'next/link'
import { type FeaturedPostsBlock as FeaturedPostsBlockType, type Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/Card' // Assuming Card can render Posts
import RichText from '@/components/RichText' // Import RichText

type Props = {
  block: FeaturedPostsBlockType | undefined | null
}

export const FeaturedPostsBlockComponent: React.FC<Props> = async ({ block }) => {
  if (!block) {
    console.error('FeaturedPostsBlockComponent received undefined block prop.')
    return null
  }

  const { title: blockTitle, richText } = block
  const payload = await getPayload({ config: configPromise })

  let featuredPosts: Post[] = []

  try {
    const postResult = await payload.find({
      collection: 'posts',
      where: {
        featured: {
          equals: true,
        },
        // Optionally add status filter if versioning is re-enabled later
        // _status: {
        //   equals: 'published',
        // },
      },
      depth: 1, // Depth 1 for category, meta image etc. needed by Card
      sort: '-publishedAt', // Show most recent featured posts
      pagination: false,
    })
    featuredPosts = postResult.docs
  } catch (error) {
    console.error('Error fetching featured posts for FeaturedPostsBlock:', error)
  }

  const hasPosts = featuredPosts.length > 0

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          {blockTitle && <h2 className="text-3xl font-bold mb-4">{blockTitle}</h2>}
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>
        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
            {featuredPosts.map((post) => (
              // Assuming Card component can handle Post type
              <Card key={post.id} doc={post} relationTo="posts" showCategories />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-12">
            {blockTitle ? 'No featured posts found.' : 'No featured posts available.'}
          </p>
        )}
        <div className="text-center">
          <Link href="/posts" passHref legacyBehavior>
            <Button variant="default">View All Posts</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
