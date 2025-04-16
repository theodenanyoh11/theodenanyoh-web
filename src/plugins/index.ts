import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post, Project } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const FRONTEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Theoden Anyoh` : 'Theoden Anyoh'
}

const generateSEOURL: GenerateURL<Post | Page | Project> = ({ doc, collectionConfig }) => {
  if (!doc?.slug) return FRONTEND_URL

  switch (collectionConfig?.slug) {
    case 'pages':
      return `${FRONTEND_URL}/${doc.slug === 'home' ? '' : doc.slug}`
    case 'posts':
      return `${FRONTEND_URL}/posts/${doc.slug}`
    case 'projects':
      return `${FRONTEND_URL}/projects/${doc.slug}`
    default:
      return `${FRONTEND_URL}/${doc.slug}`
  }
}

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL: generateSEOURL,
    collections: ['pages', 'posts', 'projects'],
    tabbedUI: true,
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
]
