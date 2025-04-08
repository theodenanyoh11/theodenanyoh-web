import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '../../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'comingSoon', 'updatedAt'],
    group: 'Collections',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      index: true,
    },
    ...slugField('name'), // Auto-generate slug from name
    {
      name: 'price',
      label: 'Price (USD)',
      type: 'number',
      admin: {
        description: 'Optional. Enter price in USD. Leave blank if not applicable.',
        step: 0.01, // Allow cents
      },
    },
    {
      name: 'comingSoon',
      label: 'Coming Soon',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'image',
      label: 'Product Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
    },
    {
      name: 'externalUrl',
      label: 'External Buy URL',
      type: 'text',
      admin: {
        description: 'Optional link to purchase the product elsewhere.',
      },
      // Basic URL validation (consider more robust validation if needed)
      validate: (val: string | null | undefined) => {
        if (val === null || val === undefined || val === '') return true // Optional field
        try {
          new URL(val)
          return true
        } catch (_) {
          return 'Please enter a valid URL (e.g., https://example.com)'
        }
      },
    },
  ],
}
