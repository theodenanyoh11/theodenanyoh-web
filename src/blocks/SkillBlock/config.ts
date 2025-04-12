import type { Block } from 'payload'

export const SkillBlock: Block = {
  slug: 'skillBlock',
  interfaceName: 'SkillBlock', // Ensure interface name is defined
  fields: [
    {
      name: 'title',
      label: 'Optional Title',
      type: 'text',
    },
    {
      name: 'richText',
      label: 'Optional Rich Text Below Title',
      type: 'richText',
    },
    {
      name: 'skills',
      label: 'Skills to Display',
      type: 'relationship',
      relationTo: 'skills',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the skills you want to feature in the carousel.',
      },
    },
  ],
}
