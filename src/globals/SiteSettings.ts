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
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Homepage hero',
      fields: [
        { name: 'eyebrow', type: 'text' },
        {
          name: 'headline',
          type: 'textarea',
          admin: { description: 'Two lines. The last word is set in cobalt.' },
        },
        { name: 'intro', type: 'textarea' },
        { name: 'portrait', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'videoResume',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            description:
              'YouTube, Vimeo or a video file link. Leave empty until the video is ready.',
          },
        },
        { name: 'duration', type: 'text', admin: { description: 'For example "1:30".' } },
      ],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'resumeUrl', type: 'text' },
    { name: 'bookingUrl', type: 'text', admin: { description: 'Link for "Book a call" buttons.' } },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'logoStrip',
      type: 'array',
      label: 'Logo strip',
      admin: { description: 'Employers first, then products.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        {
          name: 'showName',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show the name beside a mark that has no wordmark.' },
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About page',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'intro', type: 'textarea' },
        { name: 'portrait', type: 'upload', relationTo: 'media' },
        { name: 'signature', type: 'upload', relationTo: 'media' },
        {
          name: 'facts',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'story',
          type: 'array',
          fields: [
            { name: 'place', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'experiencePage',
      type: 'group',
      label: 'Experience page',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'intro', type: 'textarea' },
        {
          name: 'habits',
          type: 'array',
          maxRows: 3,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
        {
          name: 'certifications',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'year', type: 'text' },
          ],
        },
        {
          name: 'also',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'year', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'headScript',
      label: 'Head Script',
      type: 'textarea',
      admin: {
        description:
          'Add script tags that will be included in your site. Supports multiple formats:\n- Multiple script tags: <script>...</script><script src="..."></script>\n- Next.js Script component: <Script src="..." strategy="afterInteractive" data-attr="value" />\n- Inline script content: console.log("hello");\n\nScripts are automatically placed in the correct location (head or body).',
      },
      required: false,
    },
  ],
}
