import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { Button } from '@/components/site/Button'
import { Heading } from '@/components/site/Heading'
import { StatusPill } from '@/components/site/StatusPill'
import { cn } from '@/utilities/ui'

type Args = { params: Promise<{ slug: string }> }

const platformLabel = { web: 'Web', ios: 'iOS', android: 'Android' } as const

const tintClass: Record<NonNullable<Project['tint']>, string> = {
  mint: 'bg-mint',
  rose: 'bg-rose',
  peach: 'bg-peach',
  sky: 'bg-sky',
  mist: 'bg-mist',
  'cobalt-soft': 'bg-cobalt-soft',
  gold: 'bg-gold',
  'gold-soft': 'bg-gold-soft',
  ink: 'bg-mist',
}

const getProjects = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    limit: 100,
    sort: ['homeOrder', 'name'],
  })
  return [...docs.filter((p) => p.homeOrder != null), ...docs.filter((p) => p.homeOrder == null)]
})

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 100,
    select: { slug: true },
  })
  return docs.flatMap((doc) => (doc.slug ? [{ slug: doc.slug }] : []))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const project = (await getProjects()).find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.name} | Theo Denanyoh`,
    description: project.summary ?? undefined,
  }
}

export default async function ProjectPage({ params }: Args) {
  const { slug } = await params
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  if (!project) notFound()

  const live = projects.filter((p) => p.stage !== 'retired' && p.slug !== slug)
  const next = projects.slice(index + 1).find((p) => p.stage !== 'retired') ?? live[0]

  const url = project.projectLink?.url
  const lead =
    (project.mainImage && typeof project.mainImage === 'object' && project.mainImage) ||
    (project.tileImage && typeof project.tileImage === 'object' && project.tileImage) ||
    null

  const facts = [
    ...(project.facts ?? []),
    ...(!project.facts?.length && project.role ? [{ label: 'Role', value: project.role }] : []),
    ...(!project.facts?.length && project.platforms?.length
      ? [{ label: 'Platforms', value: project.platforms.map((p) => platformLabel[p]).join(', ') }]
      : []),
    ...(project.year ? [{ label: 'Year', value: project.year }] : []),
  ]
  const technologies = (project.technologies ?? []).flatMap((t) =>
    typeof t === 'object' && t ? [t.name] : [],
  )
  if (technologies.length && !facts.some((f) => f.label === 'Stack')) {
    facts.push({ label: 'Stack', value: technologies.join(', ') })
  }

  const sections = project.sections ?? []

  return (
    <article>
      <header className="site-container flex flex-col gap-6 pb-10 pt-12 lg:pb-12 lg:pt-[72px]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-[15px] leading-[18px]">
          <Link className="text-muted-foreground underline underline-offset-4" href="/projects">
            Work
          </Link>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <span className="font-semibold text-ink">{project.name}</span>
        </nav>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <StatusPill className="bg-mist" label={project.statusLabel} stage={project.stage} />
            <Heading as="h1" className="max-w-[820px]">
              {(project.headline || project.name).replace(/\.$/, '')}
            </Heading>
            {!sections.length && project.summary && (
              <p className="type-lead max-w-[680px]">{project.summary}</p>
            )}
          </div>
          {url && (
            <Button className="shrink-0" href={url} rel="noopener" size="lg" target="_blank">
              Visit {hostname(url)}
            </Button>
          )}
        </div>
      </header>

      {lead && (
        <div className="site-container">
          <div
            className={cn(
              'overflow-hidden rounded-tile p-4 lg:p-10',
              tintClass[project.tint ?? 'mist'],
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-media bg-paper lg:aspect-[2/1]">
              <Media
                fill
                htmlElement={null}
                pictureClassName="absolute inset-0"
                imgClassName="object-cover object-top"
                priority
                resource={lead}
                size="(min-width: 1024px) 1232px, 100vw"
              />
            </div>
          </div>
        </div>
      )}

      <div className="site-container flex flex-col gap-12 pt-12 lg:flex-row lg:gap-24 lg:pt-24">
        {/* On phones the facts come first, as in the phone design. */}
        <aside className="order-first flex flex-col gap-8 lg:order-last lg:flex-1">
          {facts.length > 0 && (
            <dl className="border-t-2 border-ink">
              {facts.map((fact, i) => (
                <div className="flex justify-between gap-6 border-b border-rule py-4" key={i}>
                  <dt className="text-[15px] leading-[18px] text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right text-[17px] font-semibold leading-[22px] text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
              {url && (
                <div className="flex justify-between gap-6 border-b border-rule py-4">
                  <dt className="text-[15px] leading-[18px] text-muted-foreground">Live at</dt>
                  <dd className="text-right text-[17px] font-semibold leading-[22px]">
                    <a className="text-ink underline underline-offset-4" href={url} rel="noopener">
                      {hostname(url)}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
          {project.takeaway && (
            <div className="flex flex-col gap-3 rounded-tile bg-gold-soft p-6">
              <p className="type-label text-muted-foreground">What this shows</p>
              <p className="type-h4">{project.takeaway}</p>
            </div>
          )}
        </aside>

        <div className="flex flex-col gap-14 lg:w-[720px] lg:shrink-0">
          {sections.map((section, i) => {
            const image = section.image && typeof section.image === 'object' ? section.image : null
            return (
              <section className="flex flex-col gap-4" key={section.id ?? i}>
                <Heading as="h2">{section.heading.replace(/\.$/, '')}</Heading>
                {section.lead && <p className="type-lead">{section.lead}</p>}
                {section.body?.split(/\n\s*\n/).map((text, j) => (
                  <p className="text-[17px] leading-7" key={j}>
                    {text}
                  </p>
                ))}
                {(section.cards?.length ?? 0) > 0 && (
                  <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:gap-5">
                    {section.cards!.map((card, j) => (
                      <div
                        className="flex flex-col gap-2 rounded-tile bg-mist p-6"
                        key={card.id ?? j}
                      >
                        <h3 className="type-h4">{card.title}</h3>
                        <p className="text-[16px] leading-6">{card.body}</p>
                      </div>
                    ))}
                  </div>
                )}
                {image && (
                  <figure className="flex flex-col gap-3">
                    <div className="relative aspect-[2/1] overflow-hidden rounded-tile">
                      <Media
                        fill
                        htmlElement={null}
                        pictureClassName="absolute inset-0"
                        imgClassName="object-cover"
                        resource={image}
                        size="(min-width: 1024px) 720px, 100vw"
                      />
                    </div>
                    {section.caption && (
                      <figcaption className="text-[15px] leading-[18px] text-muted-foreground">
                        {section.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            )
          })}

          {!sections.length && project.description && (
            <RichText data={project.description} enableGutter={false} />
          )}
          {!sections.length && !project.description && (
            <p className="type-lead">The full write-up for this project is on its way.</p>
          )}
        </div>
      </div>

      <div className="site-container grid gap-4 py-[72px] lg:grid-cols-2 lg:gap-5 lg:py-32">
        {next && (
          <Link
            className={cn(
              'flex items-center justify-between gap-8 rounded-tile p-6 lg:p-8',
              tintClass[next.tint ?? 'mist'],
            )}
            href={`/projects/${next.slug}`}
          >
            <span className="flex flex-col gap-2">
              <span className="type-label text-muted-foreground">Next project</span>
              <span className="type-h3">{next.name}</span>
              <span className="text-[16px] leading-6 text-body">{next.summary}</span>
            </span>
            <svg aria-hidden="true" className="shrink-0" height="40" viewBox="0 0 40 40" width="40">
              <path
                d="M6 20 H34 M22 8 L34 20 L22 32"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="4"
              />
            </svg>
          </Link>
        )}
        <div className="flex flex-col justify-between gap-6 rounded-tile bg-cobalt p-6 lg:flex-row lg:items-center lg:gap-8 lg:p-8">
          <div className="flex flex-col gap-2">
            <p className="type-label text-on-cobalt">Need something like this?</p>
            <p className="type-h3 text-paper">Tell me what you are building</p>
          </div>
          <Button className="shrink-0" href="/contact" size="lg" variant="onCobalt">
            Get in touch
          </Button>
        </div>
      </div>

      <AudienceRoutes />
    </article>
  )
}
