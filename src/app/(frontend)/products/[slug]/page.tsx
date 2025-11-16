import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { Media as MediaType } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon } from 'lucide-react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return <PayloadRedirects url={url} />
  }

  // Ensure external link URL has a protocol
  let buyUrl = product.externalUrl
  if (buyUrl && !buyUrl.startsWith('http://') && !buyUrl.startsWith('https://')) {
    buyUrl = `https://${buyUrl}`
  }

  const hasPrice = typeof product.price === 'number' && product.price !== null

  return (
    <article className="pt-16 pb-16">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12 border-b pb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{product.name}</h1>
            {product.comingSoon && (
              <Badge variant="secondary" className="shrink-0">
                Coming Soon
              </Badge>
            )}
          </div>
          {product.summary && (
            <p className="text-lg text-muted-foreground max-w-3xl">{product.summary}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-2xl font-semibold">
              {product.comingSoon
                ? 'Coming Soon'
                : hasPrice && product.price !== null && product.price !== undefined
                  ? `$${product.price.toFixed(2)}`
                  : 'Free'}
            </span>
            {!product.comingSoon && buyUrl && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                aria-label={`Buy ${product.name} (opens in new tab)`}
              >
                <span>Buy Now</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </header>

        {/* Product Image */}
        {typeof product.image === 'object' && product.image !== null && (
          <div className="mb-8 md:mb-12 rounded-lg overflow-hidden shadow-md aspect-[16/9] md:aspect-[21/9]">
            <Media
              resource={product.image as MediaType}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const ogImage =
    typeof product.image === 'object' && product.image !== null ? product.image.url : undefined

  return {
    title: product.name ? `${product.name} | Product` : 'Product',
    description: product.summary || 'Product details.',
    openGraph: {
      title: product.name || 'Product',
      description: product.summary || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

