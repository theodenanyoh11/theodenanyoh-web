import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { WorkBentoBlock } from '@/payload-types'

import { ProjectTile } from '@/components/site/ProjectTile'
import { tileSpan, toTileData } from '@/components/site/projectTileData'
import { SectionHeader } from '@/components/site/SectionHeader'

export const WorkBentoBlockComponent: React.FC<WorkBentoBlock> = async ({ eyebrow, title }) => {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: tiles }, { docs: others, totalDocs }] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { homeOrder: { exists: true } },
      sort: 'homeOrder',
      depth: 1,
      limit: 12,
    }),
    payload.find({
      collection: 'projects',
      where: { homeOrder: { exists: false } },
      sort: 'name',
      depth: 0,
      limit: 4,
    }),
  ])

  if (!tiles.length) return null

  // The first row is taller when it opens with a wide tile.
  const tallCount = tileSpan(tiles[0]!) >= 8 ? 2 : 0
  const total = tiles.length + totalDocs

  return (
    <section className="site-container flex flex-col gap-8 pt-[72px] lg:pt-28">
      <SectionHeader eyebrow={eyebrow} title={title || 'Things I designed, built and launched'} />
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {tiles.map((project, i) => (
          <ProjectTile
            key={project.id}
            priority={i === 0}
            project={toTileData(project)}
            span={tileSpan(project)}
            tall={i < tallCount}
          />
        ))}
        <Link
          className="flex min-h-[220px] flex-col justify-between gap-8 rounded-tile bg-cobalt p-6 transition-transform duration-200 hover:-translate-y-1 lg:col-span-4 lg:h-[420px]"
          href="/projects"
        >
          <p className="type-label text-on-cobalt">{others.map((p) => p.name).join(' · ')}</p>
          <span className="flex items-end justify-between gap-4">
            <span className="type-h3 text-paper">See all {total} projects</span>
            <svg aria-hidden="true" className="shrink-0" height="40" viewBox="0 0 40 40" width="40">
              <path d="M8 32 L32 8 M12 8 H32 V28" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  )
}
