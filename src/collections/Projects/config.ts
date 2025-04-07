import type { CollectionConfig } from 'payload'
// Import generated type after generation
// import type { Project } from '@/payload-types' // Reverting type for now

import { slugField } from '../../fields/slug' // Using relative path
import { anyone } from '../../access/anyone' // Using relative path
import { authenticated } from '../../access/authenticated' // Corrected import name

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'startDate', 'featured'],
    group: 'Collections',
    preview: (doc: any) => {
      // Reverting to 'any' to satisfy GeneratePreviewURL type
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL ?? ''}/projects/${doc.slug}`
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
      required: true,
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
      required: true,
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
      required: true,
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
          required: true,
        },
      ],
    },
    ...slugField('name'), // Use spread syntax and specify 'name' field for slug generation
  ],
}
