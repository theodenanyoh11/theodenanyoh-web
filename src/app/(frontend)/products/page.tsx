import type { Metadata } from 'next/types'

import { ProductCard } from '@/components/ProductCard'
import { PaginationControls } from '@/components/PaginationControls'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-createdAt',
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Products</h1>
        </div>
      </div>

      {products.docs.length > 0 ? (
        <>
          <div className="container mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.docs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="container">
            {products.totalPages > 1 && products.page && (
              <PaginationControls currentPage={products.page} totalPages={products.totalPages} />
            )}
          </div>
        </>
      ) : (
        <div className="container">
          <p className="text-center text-muted-foreground">No products available at this time.</p>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Products`,
    description: 'Browse our collection of products.',
  }
}

