import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { TextLink } from '@/components/site/Button'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { ConsultingBanner, OfferCard, offerHref, offerPrice } from '@/components/site/OfferCard'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  title: 'Shop | Theo Denanyoh',
  description: 'Consulting, templates and merch from Theo Denanyoh.',
}

export default async function ShopPage() {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: products }, settings] = await Promise.all([
    payload.find({ collection: 'products', sort: 'createdAt', depth: 1, limit: 100 }),
    getCachedGlobal('site-settings', 2)() as Promise<SiteSetting | null>,
  ])

  const consulting = products.find((p) => p.kind === 'consulting')
  const engagements = products.filter((p) => p.kind === 'engagement')
  const goods = products.filter((p) => p.kind !== 'consulting' && p.kind !== 'engagement')

  // Keeps the heading order valid when there is no headline consulting offer above.
  const EngagementHeading = consulting ? 'h3' : 'h2'

  return (
    <article>
      <header className="site-container flex flex-col gap-6 pb-10 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-14 lg:pt-[88px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Shop</Eyebrow>
          <Heading as="h1" className="max-w-[760px]">
            Take something with you
          </Heading>
        </div>
        <p className="type-lead max-w-[440px] shrink-0">
          My time, my templates and a few things to wear. Buying any of them supports the studio.
        </p>
      </header>

      {(consulting || engagements.length > 0) && (
        <section aria-label="Consulting" className="site-container flex flex-col gap-4 lg:gap-5">
          {consulting && <ConsultingBanner as="h2" product={consulting} settings={settings} />}
          {engagements.length > 0 && (
            <ul className="grid gap-4 lg:grid-cols-3 lg:gap-5">
              {engagements.map((product) => (
                <li
                  className="flex flex-col justify-between gap-8 rounded-tile bg-mist p-6 lg:p-8"
                  key={product.id}
                >
                  <div className="flex flex-col gap-3">
                    {product.term && (
                      <p className="type-label text-muted-foreground">{product.term}</p>
                    )}
                    <EngagementHeading className="type-h3">{product.name}</EngagementHeading>
                    {product.summary && <p className="type-body">{product.summary}</p>}
                  </div>
                  <TextLink
                    className="self-start text-[17px] leading-[22px]"
                    href={offerHref(product, settings)}
                  >
                    {offerPrice(product) || 'Ask about this'}
                  </TextLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {goods.length > 0 && (
        <section className="site-container flex flex-col gap-8 pt-[72px] lg:pt-24">
          <Heading as="h2">Templates and merch</Heading>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            {goods.map((product) => (
              <OfferCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
        </section>
      )}

      {!products.length && <p className="site-container type-lead">The shop is being stocked.</p>}

      <div className="pb-[72px] lg:pb-32" />
      <AudienceRoutes />
    </article>
  )
}
