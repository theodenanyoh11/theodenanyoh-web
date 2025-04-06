import type React from 'react'
import type { Page, Post } from '@/payload-types'
import type { CollectionSlug } from 'payload'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

interface Redirect {
  from: string
  to?: {
    url?: string
    reference?: {
      relationTo: string
      value: string | { slug?: string }
    }
  }
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = (await getCachedRedirects()()) as unknown as Redirect[]

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to.reference.relationTo as CollectionSlug
      const id = redirectItem.to.reference.value
      const document = (await getCachedDocument(collection, id)()) as Page | Post
      redirectUrl = `${collection !== 'pages' ? `/${collection}` : ''}/${document?.slug}`
    } else {
      const collection = redirectItem.to?.reference?.relationTo as CollectionSlug
      const value = redirectItem.to?.reference?.value
      redirectUrl = `${collection !== 'pages' ? `/${collection}` : ''}/${typeof value === 'object' ? value?.slug : ''}`
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
