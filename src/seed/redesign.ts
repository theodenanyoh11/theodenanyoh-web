// Loads the redesign content. Safe to run more than once: every document is
// matched by slug (or filename, for media) and updated in place.
//
//   pnpm seed:redesign
//
// It never deletes anything, and it never touches posts unless
// SEED_SAMPLE_POSTS=1, which creates four sample posts for local development.
import config from '@payload-config'
import path from 'path'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

import {
  assets,
  contactReasons,
  experience,
  logoStrip,
  media,
  posts,
  products,
  projects,
  site,
} from './content'
import type { MediaKey } from './content'

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          { type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' },
        ],
      },
    ],
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Record<string, any>

async function upsert(
  payload: Payload,
  collection: CollectionSlug,
  field: string,
  value: string,
  data: Data,
  options: { createOnly?: boolean; filePath?: string } = {},
): Promise<number> {
  const existing = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
  })
  const found = existing.docs[0]
  if (found) {
    if (!options.createOnly) {
      await payload.update({ collection, id: found.id, data, context: { disableRevalidate: true } })
    }
    return found.id as number
  }
  const created = await payload.create({
    collection,
    data,
    filePath: options.filePath,
    context: { disableRevalidate: true },
  })
  return created.id as number
}

async function run() {
  const payload = await getPayload({ config })
  const mediaIds = {} as Record<MediaKey, number>

  for (const [key, [file, alt]] of Object.entries(media) as [
    MediaKey,
    readonly [string, string],
  ][]) {
    const filePath = path.resolve(process.cwd(), assets, file)
    mediaIds[key] = await upsert(
      payload,
      'media',
      'filename',
      path.basename(file),
      { alt },
      { filePath, createOnly: true },
    )
  }
  payload.logger.info(`media: ${Object.keys(mediaIds).length}`)

  for (const project of projects) {
    const { tileImage, logo, url, sections, preserveCopy, ...rest } = project
    const placement = {
      stage: project.stage,
      statusLabel: project.statusLabel ?? null,
      year: project.year ?? null,
      tint: project.tint,
      // Only projects with a position here appear on the homepage.
      homeOrder: project.homeOrder ?? null,
      featured: Boolean(project.homeOrder),
    }
    if (preserveCopy) {
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: project.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs[0]) {
        await payload.update({
          collection: 'projects',
          id: existing.docs[0].id,
          data: placement,
          context: { disableRevalidate: true },
        })
        continue
      }
    }
    await upsert(payload, 'projects', 'slug', project.slug, {
      ...rest,
      sections: (sections ?? []).map(({ image, ...section }) => ({
        ...section,
        image: image ? mediaIds[image] : null,
      })),
      status: project.stage === 'live' ? 'active' : 'in_progress',
      ...placement,
      tileImage: tileImage ? mediaIds[tileImage] : null,
      logo: logo ? mediaIds[logo] : null,
      projectLink: { label: 'Visit website', url: url ?? null },
      slugLock: false,
    })
  }
  payload.logger.info(`projects: ${projects.length}`)

  for (const role of experience) {
    const { logo, outcomes, ...rest } = role
    await upsert(payload, 'experience', 'role', role.role, {
      ...rest,
      logo: logo ? mediaIds[logo] : null,
      outcomes: outcomes.map((text) => ({ text })),
    })
  }
  payload.logger.info(`experience: ${experience.length}`)

  for (const product of products) {
    const { preserve, ...data } = { preserve: false, ...product }
    await upsert(
      payload,
      'products',
      'slug',
      product.slug,
      { ...data, slugLock: false },
      { createOnly: preserve },
    )
  }
  payload.logger.info(`products: ${products.length}`)

  // Sample posts are for local development. They are created only when
  // SEED_SAMPLE_POSTS=1, so a run without that flag never publishes them.
  // Do not set the flag for a production run.
  for (const post of process.env.SEED_SAMPLE_POSTS === '1' ? posts : []) {
    const { category, ...rest } = post
    const categoryId = await upsert(
      payload,
      'categories',
      'title',
      category,
      { title: category },
      { createOnly: true },
    )
    await upsert(
      payload,
      'posts',
      'slug',
      post.slug,
      {
        ...rest,
        categories: [categoryId],
        content: paragraph(post.excerpt),
        publishedAt: new Date().toISOString(),
        _status: 'published',
        slugLock: false,
      },
      { createOnly: true },
    )
  }
  payload.logger.info(
    `sample posts: ${process.env.SEED_SAMPLE_POSTS === '1' ? posts.length : 'skipped (set SEED_SAMPLE_POSTS=1 to create them)'}`,
  )

  await payload.updateGlobal({
    slug: 'site-settings',
    context: { disableRevalidate: true },
    data: {
      hero: { ...site.hero, portrait: mediaIds.portrait },
      videoResume: site.videoResume,
      contactEmail: site.contactEmail,
      resumeUrl: site.resumeUrl,
      bookingUrl: site.bookingUrl,
      social: site.social,
      logoStrip: logoStrip.map((item) => ({ ...item, logo: mediaIds[item.logo] })),
      about: { ...site.about, portrait: mediaIds.portrait, signature: mediaIds.signature },
      experiencePage: site.experiencePage,
    },
  })

  // The contact page looks this form up by title.
  await upsert(payload, 'forms', 'title', 'Contact', {
    title: 'Contact',
    submitButtonLabel: 'Send message',
    confirmationType: 'message',
    confirmationMessage: paragraph('Thank you. I read every message myself and will reply soon.'),
    fields: [
      { blockType: 'text', name: 'name', label: 'Your name', required: true, width: 50 },
      { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
      {
        blockType: 'select',
        name: 'reason',
        label: 'What brings you here?',
        required: true,
        width: 100,
        defaultValue: contactReasons[0],
        options: contactReasons.map((reason) => ({ label: reason, value: reason })),
      },
      { blockType: 'text', name: 'company', label: 'Company or project', width: 100 },
      { blockType: 'textarea', name: 'message', label: 'Message', required: true, width: 100 },
    ],
    // The address that gets new messages is private, so it is not in this
    // file. Set CONTACT_NOTIFY_EMAIL when running the seed, or add the address
    // under the form's Emails tab in the admin panel. Without either,
    // submissions are only kept under Form Submissions.
    emails: process.env.CONTACT_NOTIFY_EMAIL
      ? [
          {
            emailTo: process.env.CONTACT_NOTIFY_EMAIL,
            replyTo: '{{email}}',
            subject: 'Website: {{reason}}',
            message: paragraph('{{name}} ({{email}}), {{company}}: {{message}}'),
          },
        ]
      : [],
  })

  // The homepage is a CMS page. Set its layout to the six redesign sections.
  await upsert(payload, 'pages', 'slug', 'home', {
    title: 'Home',
    slug: 'home',
    slugLock: false,
    hero: { type: 'none' },
    meta: {
      title: 'Product leader and founder',
      description:
        'Theo Denanyoh leads product teams by day and designs, builds and launches his own software, including Cleanly, Tilly and DirectoryHub.',
    },
    layout: [
      { blockType: 'homeHero' },
      { blockType: 'logoMarquee' },
      { blockType: 'workBento' },
      { blockType: 'contentFeature' },
      { blockType: 'shopFeature' },
      { blockType: 'audienceRoutes' },
    ],
    _status: 'published',
  })

  payload.logger.info(
    'Redesign content loaded. Restart or redeploy the site to refresh cached pages.',
  )
  process.exit(0)
}

// `payload run` imports this file and exits when the import settles, so the
// work has to be awaited at the top level.
try {
  await run()
} catch (error) {
  console.error(error)
  process.exit(1)
}
