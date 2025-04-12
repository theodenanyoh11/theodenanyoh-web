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
  ],
}
