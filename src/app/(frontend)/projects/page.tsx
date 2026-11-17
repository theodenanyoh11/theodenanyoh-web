import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Project } from '@/payload-types'

import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { ProjectTile } from '@/components/site/ProjectTile'
import { tileSpan, toTileData } from '@/components/site/projectTileData'
import { cn } from '@/utilities/ui'

export const metadata: Metadata = {
  title: 'Work | Theo Denanyoh',
  description: 'Products and businesses Theo Denanyoh has designed, built and launched.',
}

const filters = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'building', label: 'In build' },
  { key: 'archive', label: 'Archive' },
] as const

type FilterKey = (typeof filters)[number]['key']

const matches = (project: Project, filter: FilterKey) =>
  filter === 'all' ||
  (filter === 'archive' ? project.stage === 'retired' : project.stage === filter)

const numberWords = [
  'No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
  'Nineteen', 'Twenty',
] // prettier-ignore

type Props = { searchParams?: Promise<{ show?: string }> }

export default async function WorkPage({ searchParams }: Props) {
  const { show } = (await searchParams) ?? {}
  const active: FilterKey = filters.some((f) => f.key === show) ? (show as FilterKey) : 'all'

  const payload = await getPayload({ config: configPromise })
  const { docs: all } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    // Homepage order first, then the rest by name.
    sort: ['homeOrder', 'name'],
  })

  const ordered = [...all.filter((p) => p.homeOrder != null), ...all.filter((p) => p.homeOrder == null)]
  const current = ordered.filter((p) => p.stage !== 'retired' && matches(p, active))
  const archive = ordered.filter((p) => p.stage === 'retired' && matches(p, active))
  const count = (key: FilterKey) => all.filter((p) => matches(p, key)).length

  return (
    <article>
      <header className="site-container flex flex-col gap-6 pb-10 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-14 lg:pt-[88px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Work</Eyebrow>
          <Heading as="h1" className="max-w-[760px]">
            Everything I have built
          </Heading>
        </div>
        <p className="type-lead max-w-[440px] shrink-0">
          {numberWords[all.length] ?? all.length} products and businesses, from live apps with
          paying customers to prototypes on my desk. I designed and built each one.
        </p>
      </header>

      <nav aria-label="Filter projects" className="site-container pb-8">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {filters.map((filter) => (
            <li className="shrink-0" key={filter.key}>
              <Link
                aria-current={filter.key === active ? 'true' : undefined}
                className={cn(
                  'block rounded-pill px-[18px] py-[10px] text-[15px] font-semibold leading-[18px]',
                  filter.key === active ? 'bg-ink text-paper' : 'bg-mist text-ink hover:bg-rule',
                )}
                href={filter.key === 'all' ? '/projects' : `/projects?show=${filter.key}`}
                scroll={false}
              >
                {filter.label} {count(filter.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {current.length > 0 && (
        <section className="site-container grid gap-4 lg:grid-cols-12 lg:gap-5">
          {current.map((project, i) => (
            <ProjectTile
              key={project.id}
              priority={i === 0}
              project={toTileData(project)}
              span={tileSpan(project)}
              tall={i < 2 && tileSpan(current[0]!) >= 8}
            />
          ))}
        </section>
      )}

      {archive.length > 0 && (
        <section className="site-container pb-[72px] pt-[72px] lg:pb-32 lg:pt-24">
          <div className="flex flex-col gap-4 pb-8">
            <Eyebrow>Archive</Eyebrow>
            <Heading as="h2">Earlier experiments</Heading>
          </div>
          <ul>
            {archive.map((project, i) => (
              <li
                className={cn(
                  'flex flex-col gap-2 py-6 lg:flex-row lg:items-center lg:gap-8',
                  i === 0 ? 'border-t-2 border-ink' : 'border-t border-rule',
                  i === archive.length - 1 && 'border-b border-b-rule',
                )}
                key={project.id}
              >
                <h3 className="type-h4 shrink-0 lg:w-[280px]">{project.name}</h3>
                <p className="type-body flex-1">{project.summary}</p>
                <p className="shrink-0 text-[15px] leading-[18px] text-muted-foreground lg:w-[140px] lg:text-right">
                  {[project.year, project.statusLabel].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!current.length && !archive.length && (
        <p className="site-container type-lead pb-24">Nothing here yet.</p>
      )}

      {!archive.length && <div className="pb-[72px] lg:pb-32" />}
      <AudienceRoutes />
    </article>
  )
}
