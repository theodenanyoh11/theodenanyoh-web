import React from 'react'
import { ProductBlock as ProductBlockType, Product } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductCard } from '@/components/ProductCard'
import RichText from '@/components/RichText'

type Props = {
  block: ProductBlockType | undefined | null
}

export const ProductBlockComponent: React.FC<Props> = async ({ block }) => {
  if (!block) {
    console.error('ProductBlockComponent received undefined block prop.')
    return null
  }

  const { title: blockTitle, richText, products: productRelation } = block
  const payload = await getPayload({ config: configPromise })

  let fetchedProducts: Product[] = []

  if (productRelation && productRelation.length > 0) {
    try {
      const productIDs = productRelation
        .map((product: number | Product) => (typeof product === 'object' ? product.id : product))
        .filter((id): id is number => typeof id === 'number')

      if (productIDs.length > 0) {
        const productResult = await payload.find({
          collection: 'products',
          where: {
            id: {
              in: productIDs,
            },
          },
          depth: 1, // Depth 1 should be enough for image
          limit: productIDs.length,
          pagination: false,
        })
        fetchedProducts = productResult.docs
      }
    } catch (error) {
      console.error('Error fetching products for ProductBlock:', error)
    }
  }

  const hasProducts = fetchedProducts.length > 0

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          {blockTitle && <h2 className="text-3xl font-bold mb-4">{blockTitle}</h2>}
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>
        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {fetchedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {blockTitle ? 'No products selected for this section.' : 'No products selected.'}
          </p>
        )}
      </div>
    </section>
  )
}
