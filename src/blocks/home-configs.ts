import type { Block } from 'payload'

// The six sections of the redesigned homepage. Each block holds only its
// headings. The content comes from Site Settings and the collections, so the
// homepage stays current without editing the page.

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  labels: { singular: 'Home hero', plural: 'Home heroes' },
  fields: [
    {
      name: 'videoLabel',
      type: 'text',
      defaultValue: 'Watch the 90 second intro',
      admin: {
        description: 'Copy and video come from Site Settings. This is the play button text.',
      },
    },
    { name: 'workLabel', type: 'text', defaultValue: 'See the work' },
  ],
}

export const LogoMarqueeBlock: Block = {
  slug: 'logoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  labels: { singular: 'Logo strip', plural: 'Logo strips' },
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Teams I have led product for, and products I have launched',
      admin: { description: 'Logos come from Site Settings.' },
    },
  ],
}

export const WorkBento: Block = {
  slug: 'workBento',
  interfaceName: 'WorkBentoBlock',
  labels: { singular: 'Work bento', plural: 'Work bentos' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Work' },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Things I designed, built and launched',
      admin: { description: 'Tiles are the projects that have a homepage position.' },
    },
  ],
}

export const ContentFeature: Block = {
  slug: 'contentFeature',
  interfaceName: 'ContentFeatureBlock',
  labels: { singular: 'Writing and video', plural: 'Writing and video' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Writing and video' },
    { name: 'title', type: 'text', defaultValue: 'What I am learning out loud' },
  ],
}

export const ShopFeature: Block = {
  slug: 'shopFeature',
  interfaceName: 'ShopFeatureBlock',
  labels: { singular: 'Shop', plural: 'Shop' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Shop' },
    { name: 'title', type: 'text', defaultValue: 'Take something with you' },
  ],
}

export const AudienceRoutesBlock: Block = {
  slug: 'audienceRoutes',
  interfaceName: 'AudienceRoutesBlock',
  labels: { singular: 'Audience routes', plural: 'Audience routes' },
  fields: [{ name: 'title', type: 'text', defaultValue: 'What brings you here?' }],
}
