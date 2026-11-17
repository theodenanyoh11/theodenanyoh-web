import React from 'react'

import type { Product, SiteSetting } from '@/payload-types'

import { cn } from '@/utilities/ui'

import { Button, TextLink } from './Button'

const kindLabel: Record<NonNullable<Product['kind']>, string> = {
  consulting: 'Consulting',
  engagement: 'Consulting',
  template: 'Templates',
  merch: 'Merch',
}

/** Where a product's link goes: its own buy link, else the booking link, else contact. */
export const offerHref = (product: Product, settings?: SiteSetting | null): string =>
  product.externalUrl ||
  (product.kind === 'consulting' || product.kind === 'engagement'
    ? settings?.bookingUrl || '/contact'
    : `/products/${product.slug}`)

export const offerPrice = (product: Product): string | null =>
  product.priceLabel ||
  (product.comingSoon
    ? 'Coming soon'
    : typeof product.price === 'number'
      ? `$${product.price}`
      : null)

/** Wide cobalt banner for the consulting offer. */
export const ConsultingBanner: React.FC<{
  product: Product
  settings?: SiteSetting | null
  as?: 'h2' | 'h3'
}> = ({ product, settings, as: Tag = 'h3' }) => (
  <div className="flex flex-col gap-8 rounded-tile bg-cobalt p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
    <div className="flex max-w-[720px] flex-col gap-4">
      <p className="type-label text-on-cobalt">{kindLabel.consulting}</p>
      <Tag className="type-h3 text-paper">{product.name}</Tag>
      {product.summary && <p className="text-[18px] leading-7 text-on-cobalt">{product.summary}</p>}
    </div>
    <Button className="shrink-0" href={offerHref(product, settings)} size="lg" variant="onCobalt">
      {product.ctaLabel || 'Get in touch'}
    </Button>
  </div>
)

/** Square-ish tile for a template or a piece of merch. */
export const OfferCard: React.FC<{
  product: Product
  settings?: SiteSetting | null
  as?: 'h2' | 'h3'
}> = ({ product, settings, as: Tag = 'h3' }) => (
  <div
    className={cn(
      'flex flex-col justify-between gap-12 rounded-tile p-6 lg:min-h-[340px] lg:p-8',
      product.kind === 'merch' ? 'bg-gold-soft' : 'bg-mist',
    )}
  >
    <p className="type-label text-muted-foreground">{kindLabel[product.kind ?? 'template']}</p>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="flex flex-col gap-2">
        <Tag className="type-h3">{product.name}</Tag>
        {product.summary && <p className="text-[16px] leading-6">{product.summary}</p>}
      </div>
      {product.comingSoon ? (
        <span className="shrink-0 text-[17px] font-semibold leading-[22px] text-ink">
          {offerPrice(product)}
        </span>
      ) : (
        <TextLink
          className="shrink-0 text-[17px] leading-[22px]"
          href={offerHref(product, settings)}
        >
          {offerPrice(product) || product.ctaLabel || 'View'}
        </TextLink>
      )}
    </div>
  </div>
)
