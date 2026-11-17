import type { CollectionConfig } from 'payload'
import type { Project } from '@/payload-types'

import { slugField } from '../../fields/slug' // Using relative path
import { anyone } from '../../access/anyone' // Using relative path
import { authenticated } from '../../access/authenticated' // Corrected import name
import { revalidateProjects } from './revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'startDate', 'featured'],
    group: 'Collections',
    preview: (doc: Partial<Project>) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : ''
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL ?? ''}/projects/${slug}`
    },
  },
  /* // Temporarily disable versions for testing
  versions: {
    drafts: true,
  },
  */
  access: {
    read: anyone, // Or define specific access
    create: authenticated, // Use authenticated access
    update: authenticated, // Use authenticated access
    delete: authenticated, // Use authenticated access
  },
  hooks: {
    afterChange: [revalidateProjects],
    afterDelete: [revalidateProjects],
  },
  fields: [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      required: true,
      localized: true, // Example: If you need multi-language names
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Idea', value: 'idea' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'idea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      label: 'Featured Project',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMMM yyyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMMM yyyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'mainImage',
      label: 'Main Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      label: 'Image Gallery',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        // Optional: Add caption per image
        // {
        //   name: 'caption',
        //   type: 'text',
        // }
      ],
    },
    {
      name: 'summary',
      label: 'Summary (Max 140 chars)',
      type: 'textarea',
      required: true,
      maxLength: 140,
    },
    {
      name: 'description',
      label: 'Detailed Description',
      type: 'richText',
    },
    {
      name: 'technologies',
      label: 'Technologies Used',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: false, // Making it optional for now
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projectLink',
      label: 'External Project Link',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Link Label',
          type: 'text',
          required: true,
          defaultValue: 'Visit Website',
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tile (homepage and work index)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'stage',
              type: 'select',
              defaultValue: 'building',
              options: [
                { label: 'Live', value: 'live' },
                { label: 'In build', value: 'building' },
                { label: 'Private', value: 'private' },
                { label: 'Retired', value: 'retired' },
              ],
              admin: {
                description: 'Live shows a filled dot. Everything else shows a hollow dot.',
              },
            },
            {
              name: 'statusLabel',
              type: 'text',
              admin: { description: 'Text in the pill, for example "Live · Web, iOS, Android".' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'tint',
              type: 'select',
              defaultValue: 'mist',
              options: [
                'mint',
                'rose',
                'peach',
                'sky',
                'mist',
                'cobalt-soft',
                'gold',
                'gold-soft',
                'ink',
              ],
            },
            {
              name: 'tileSpan',
              type: 'select',
              defaultValue: '4',
              options: [
                { label: 'One third', value: '4' },
                { label: 'Half', value: '6' },
                { label: 'Two thirds', value: '8' },
                { label: 'Full width', value: '12' },
              ],
            },
            {
              name: 'homeOrder',
              type: 'number',
              admin: {
                description: 'Position on the homepage. Leave empty to keep it off the homepage.',
              },
            },
          ],
        },
        { name: 'tileImage', type: 'upload', relationTo: 'media' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'badge', type: 'text', admin: { description: 'Small label over the image.' } },
        {
          name: 'sampleNote',
          type: 'text',
          admin: {
            description: 'Label above the sample rows, for example "Your rules · sample data".',
          },
        },
        {
          name: 'sampleRows',
          type: 'array',
          admin: {
            description: 'Drawn rows shown when there is no tile image. Use sample data only.',
          },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'on', type: 'checkbox', defaultValue: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Case study',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text' },
            { name: 'year', type: 'text' },
          ],
        },
        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Web', value: 'web' },
            { label: 'iOS', value: 'ios' },
            { label: 'Android', value: 'android' },
          ],
        },
        {
          name: 'headline',
          type: 'text',
          admin: { description: 'Page title. Defaults to the project name.' },
        },
        {
          name: 'sections',
          type: 'array',
          admin: { description: 'For example: The problem, What I built, How I test it.' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'lead', type: 'textarea', admin: { description: 'Larger opening paragraph.' } },
            {
              name: 'body',
              type: 'textarea',
              admin: { description: 'Leave a blank line between paragraphs.' },
            },
            {
              name: 'cards',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'caption', type: 'text' },
          ],
        },
        {
          name: 'takeaway',
          type: 'textarea',
          admin: { description: 'Shown in the "What this shows" card.' },
        },
        {
          name: 'facts',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    ...slugField('name'), // Use spread syntax and specify 'name' field for slug generation
  ],
}
