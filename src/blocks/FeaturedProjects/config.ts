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
    // Remove the limit field definition
    // Maybe add options later for sorting or filtering featured
  ],
}
