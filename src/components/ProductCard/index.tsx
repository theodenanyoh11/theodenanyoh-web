import React from 'react'
import Link from 'next/link'
import { Product, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'
import { ExternalLinkIcon } from 'lucide-react'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { name, image, summary, price, comingSoon, externalUrl, slug } = product
  const hasPrice = typeof price === 'number'

  // Ensure external link URL has a protocol
  let buyUrl = externalUrl
  if (buyUrl && !buyUrl.startsWith('http://') && !buyUrl.startsWith('https://')) {
    buyUrl = `https://${buyUrl}`
  }

  // Determine the link: external URL if available and not coming soon, otherwise internal slug link
  const linkHref = !comingSoon && buyUrl ? buyUrl : `/products/${slug}` // Assuming /products/[slug] route exists
  const linkTarget = !comingSoon && buyUrl ? '_blank' : '_self'
  const linkRel = !comingSoon && buyUrl ? 'noopener noreferrer' : undefined

  const ImageComponent = (
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      {' '}
      {/* Aspect ratio for product images */}
      {typeof image === 'object' && image !== null ? (
        <Media
          resource={image as MediaType}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
          No Image
        </div>
      )}
      {comingSoon && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
    </div>
  )

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300',
        className,
      )}
    >
      <Link
        href={linkHref}
        target={linkTarget}
        rel={linkRel}
        className={cn(
          'flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg',
          comingSoon && 'pointer-events-none', // Disable link clicks if coming soon
        )}
        aria-disabled={comingSoon ? 'true' : undefined}
        tabIndex={comingSoon ? -1 : undefined}
      >
        {ImageComponent}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold leading-tight mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow mb-3">{summary}</p>
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
            <span className="text-base font-semibold">
              {comingSoon ? '-' : hasPrice ? `$${price.toFixed(2)}` : 'Free'}
            </span>
            {!comingSoon && buyUrl && (
              <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
