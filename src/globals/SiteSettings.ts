import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone, // Use 'anyone' for public access
    update: authenticated, // Allow authenticated users to update
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo (Light Version)',
      type: 'upload',
      relationTo: 'media', // Assuming your media collection slug is 'media'
      required: true,
    },
    {
      name: 'headScript',
      label: 'Head Script',
      type: 'textarea',
      admin: {
        description: 'Add a script tag (e.g., <script>...</script>) that will be included in the <head> of your site. This can be used for analytics, chat widgets, or other third-party scripts.',
      },
      required: false,
    },
  ],
}
