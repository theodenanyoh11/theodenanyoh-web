import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateExperience } from './revalidate'

// One row per role on the Experience page.
export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: { singular: 'Role', plural: 'Experience' },
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'startDate', 'current', 'order'],
    group: 'Collections',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateExperience],
    afterDelete: [revalidateExperience],
  },
  fields: [
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    {
      name: 'companyNote',
      type: 'text',
      admin: { description: 'Shown after the company name, for example "a Paychex company".' },
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
      ],
    },
    { name: 'current', type: 'checkbox', defaultValue: false },
    {
      name: 'period',
      type: 'text',
      admin: { description: 'Replaces the dates when set, for example "Earlier at Paycor".' },
    },
    { name: 'location', type: 'text' },
    { name: 'summary', type: 'textarea' },
    {
      name: 'outcomes',
      type: 'array',
      admin: { description: 'One result per row. Keep figures in the softened form.' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'link',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
