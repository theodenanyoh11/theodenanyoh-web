import type { Block } from 'payload'

export const ProductBlock: Block = {
  slug: 'productBlock',
  interfaceName: 'ProductBlock', // Ensure interface name is defined
  fields: [
    {
      name: 'title',
      label: 'Optional Title',
      type: 'text',
    },
    {
      name: 'richText',
      label: 'Optional Rich Text Below Title',
      type: 'richText',
    },
    {
      name: 'products',
      label: 'Products to Display',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the products you want to feature.',
      },
    },
  ],
}
