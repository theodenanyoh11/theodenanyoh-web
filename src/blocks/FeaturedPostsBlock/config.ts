import type { Block } from 'payload'

export const FeaturedPostsBlock: Block = {
  slug: 'featuredPostsBlock',
  interfaceName: 'FeaturedPostsBlock',
  fields: [
    {
      name: 'title',
      label: 'Optional Title',
      type: 'text',
    },
    {
      name: 'limit',
      label: 'Number of Posts to Show',
      type: 'number',
      defaultValue: 3,
      required: true,
      min: 1,
      max: 9, // Set a reasonable max limit
      admin: {
        step: 1,
      },
    },
  ],
}
