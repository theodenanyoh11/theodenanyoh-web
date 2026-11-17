import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { ShopFeatureBlock, SiteSetting } from '@/payload-types'

import { ConsultingBanner, OfferCard } from '@/components/site/OfferCard'
import { SectionHeader } from '@/components/site/SectionHeader'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const ShopFeatureBlockComponent: React.FC<ShopFeatureBlock> = async ({ eyebrow, title }) => {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: products }, settings] = await Promise.all([
    payload.find({ collection: 'products', sort: 'createdAt', depth: 1, limit: 20 }),
    getCachedGlobal('site-settings', 2)() as Promise<SiteSetting | null>,
  ])

  if (!products.length) return null
  const consulting = products.find((p) => p.kind === 'consulting')
  const others = products
    .filter((p) => p.kind !== 'consulting' && p.kind !== 'engagement')
    .slice(0, 2)

  return (
    <section className="site-container flex flex-col gap-8 py-[72px] lg:py-32">
      <SectionHeader eyebrow={eyebrow} title={title || 'Take something with you'} />
      {consulting && <ConsultingBanner product={consulting} settings={settings} />}
      {others.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {others.map((product) => (
            <OfferCard key={product.id} product={product} settings={settings} />
          ))}
        </div>
      )}
    </section>
  )
}
