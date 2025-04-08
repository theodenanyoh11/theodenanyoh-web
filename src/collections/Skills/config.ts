import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'updatedAt'],
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
      name: 'title',
      label: 'Skill Title',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Code', value: 'code' },
        { label: 'Design', value: 'design' },
        { label: 'Product', value: 'product' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'Fund Raising', value: 'fund-raising' },
      ],
      admin: {
        description: 'Select an icon to represent the skill.',
      },
    },
  ],
}
