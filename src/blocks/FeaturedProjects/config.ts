import type { Block } from 'payload'

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  interfaceName: 'FeaturedProjectsBlock', // Payload type name
  labels: {
    singular: 'Featured Projects',
    plural: 'Featured Projects Blocks',
  },
  fields: [
    {
      name: 'title',
      label: 'Optional Title',
      type: 'text',
    },
    {
      name: 'limit',
      label: 'Number of Projects to Show',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 9,
    },
    // Maybe add options later for sorting or filtering featured
  ],
}
