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
        description: 'Add script tags that will be included in your site. Supports multiple formats:\n- Multiple script tags: <script>...</script><script src="..."></script>\n- Next.js Script component: <Script src="..." strategy="afterInteractive" data-attr="value" />\n- Inline script content: console.log("hello");\n\nScripts are automatically placed in the correct location (head or body).',
      },
      required: false,
    },
  ],
}
