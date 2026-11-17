import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { StatusPill, type Stage } from './StatusPill'

export type Tint =
  'mint' | 'rose' | 'peach' | 'sky' | 'mist' | 'cobalt-soft' | 'gold' | 'gold-soft' | 'ink'

const tintClass: Record<Tint, string> = {
  mint: 'bg-mint',
  rose: 'bg-rose',
  peach: 'bg-peach',
  sky: 'bg-sky',
  mist: 'bg-mist',
  'cobalt-soft': 'bg-cobalt-soft',
  gold: 'bg-gold',
  'gold-soft': 'bg-gold-soft',
  ink: 'bg-ink',
}

const spanClass = {
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  8: 'lg:col-span-8',
  12: 'lg:col-span-12',
} as const

export type ProjectTileData = {
  href: string
  name: string
  summary?: string | null
  tint?: Tint | null
  image?: MediaType | number | null
  stage?: Stage | null
  statusLabel?: string | null
  /** Small label over the image, for example "Not software". */
  badge?: string | null
  /** Drawn rows shown in place of an image. Used where real screens are private. */
  sampleRows?: { text: string; on?: boolean | null }[] | null
  sampleNote?: string | null
}

/**
 * One tile of the work bento. Shows the image when there is one, sample rows
 * when those are set, and otherwise just the name on its tint.
 */
export const ProjectTile: React.FC<{
  project: ProjectTileData
  span?: keyof typeof spanClass
  tall?: boolean
  priority?: boolean
}> = ({ project, span = 4, tall = false, priority = false }) => {
  const { href, name, summary, image, stage, statusLabel, badge, sampleRows, sampleNote } = project
  const tint = project.tint ?? 'mist'
  const dark = tint === 'ink'
  const large = span === 8 || span === 12
  const hasImage = Boolean(image && typeof image === 'object')
  const hasRows = !hasImage && Boolean(sampleRows?.length)

  return (
    <Link
      className={cn(
        'group flex flex-col gap-5 overflow-hidden rounded-tile p-5 transition-transform duration-200 hover:-translate-y-1 lg:p-6',
        tall ? 'lg:h-[560px]' : 'lg:h-[420px]',
        tintClass[tint],
        spanClass[span],
      )}
      href={href}
    >
      {hasImage && (
        <div className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-media bg-paper lg:aspect-auto lg:flex-1">
          <Media
            fill
            imgClassName="object-cover object-top"
            priority={priority}
            resource={image}
            size={large ? '(min-width: 1024px) 860px, 100vw' : '(min-width: 1024px) 420px, 100vw'}
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-pill bg-paper px-[14px] py-2 text-[14px] font-semibold leading-[18px] text-ink">
              {badge}
            </span>
          )}
        </div>
      )}

      {hasRows && (
        <div className="flex flex-1 flex-col justify-center gap-2">
          {sampleNote && (
            <p className="text-[13px] font-semibold uppercase leading-4 tracking-[0.08em] text-gold">
              {sampleNote}
            </p>
          )}
          {sampleRows!.map((row, i) => (
            <div
              className={cn(
                'flex items-center justify-between rounded-media px-4 py-[14px] text-[16px] font-semibold leading-5',
                i === 0 ? 'bg-paper text-ink' : 'bg-[#1E1E1E] text-paper',
              )}
              key={i}
            >
              {row.text}
              <span
                aria-hidden="true"
                className={cn(
                  'size-[10px] shrink-0 rounded-pill',
                  row.on ? 'bg-cobalt' : 'border-[1.5px] border-[#8A8A8A]',
                )}
              />
            </div>
          ))}
        </div>
      )}

      {!hasImage && !hasRows && <div className="hidden flex-1 lg:block" />}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className={cn(large ? 'type-h3' : 'type-h4', dark && 'text-paper')}>{name}</h3>
          <StatusPill label={statusLabel} stage={stage} tone={dark ? 'dark' : 'light'} />
        </div>
        {summary && (
          <p
            className={cn(
              'max-w-[520px]',
              large ? 'type-body' : 'text-[16px] leading-6',
              dark ? 'text-[#C8C8C8]' : tint === 'gold' ? 'text-ink' : 'text-body',
            )}
          >
            {summary}
          </p>
        )}
      </div>
    </Link>
  )
}
