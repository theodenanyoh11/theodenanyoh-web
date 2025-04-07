import type { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug' // Import slug field utility
import { authenticated } from '../../access/authenticated' // Import authenticated access

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
    hidden: false, // Make visible in admin UI
    group: 'Collections', // Changed from 'Content'
  },
  access: {
    read: () => true, // Everyone can read technologies
    create: authenticated, // Explicitly grant create access
    // Add update/delete later if needed
    // update: authenticated,
    // delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Technology Name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    // Add slug field, generated from 'name'
    ...slugField('name'),
    // Optional: Add an icon field later if desired
    // {
    //   name: 'icon',
    //   type: 'upload',
    //   relationTo: 'media',
    // },
  ],
}
