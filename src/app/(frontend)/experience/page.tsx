import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import type { Experience, SiteSetting } from '@/payload-types'

import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { Button, PlayIcon, TextLink } from '@/components/site/Button'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { SectionHeader } from '@/components/site/SectionHeader'
import { VideoDialog } from '@/components/site/VideoDialog'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

export const metadata: Metadata = {
  title: 'Experience | Theo Denanyoh',
  description: 'Theo Denanyoh has worked in product for over ten years, from analyst to group lead.',
}

const year = (date: string) => new Date(date).getUTCFullYear()

const period = (role: Experience) =>
  role.period ||
  `${year(role.startDate)} to ${role.current || !role.endDate ? 'now' : year(role.endDate)}`

const LedgerList: React.FC<{
  title: string
  rows?: { name: string; year?: string | null; id?: string | null }[] | null
}> = ({ title, rows }) =>
  rows?.length ? (
    <div className="flex flex-1 flex-col gap-5">
      <h2 className="type-h3">{title}</h2>
      <ul className="border-t-2 border-ink">
        {rows.map((row, i) => (
          <li className="flex justify-between gap-6 border-b border-rule py-4" key={row.id ?? i}>
            <span className="text-[17px] font-semibold leading-[22px] text-ink">{row.name}</span>
            {row.year && (
              <span className="shrink-0 text-[15px] leading-[18px] text-muted-foreground">
                {row.year}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : null

export default async function ExperiencePage() {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: roles }, settings] = await Promise.all([
    payload.find({ collection: 'experience', sort: 'order', depth: 1, limit: 50 }),
    getCachedGlobal('site-settings', 2)() as Promise<SiteSetting | null>,
  ])

  const page = settings?.experiencePage
  const videoUrl = settings?.videoResume?.url
  const resumeUrl = settings?.resumeUrl

  return (
    <article>
      <header className="site-container flex flex-col gap-8 pb-12 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-16 lg:pt-[88px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Experience</Eyebrow>
          <Heading as="h1" className="max-w-[780px]">
            {(page?.headline || 'Over ten years in product').replace(/\.$/, '')}
          </Heading>
        </div>
        <div className="flex max-w-[420px] shrink-0 flex-col gap-5">
          {page?.intro && <p className="type-lead">{page.intro}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            {videoUrl && (
              <VideoDialog
                className="inline-flex items-center justify-center gap-3 rounded-pill bg-cobalt px-6 py-[18px] text-[17px] font-semibold leading-[22px] text-paper hover:bg-[#1630e0]"
                title="Video resume"
                url={videoUrl}
              >
                <PlayIcon />
                Watch the intro
              </VideoDialog>
            )}
            {resumeUrl && (
              <Button
                className={cn(!videoUrl ? '' : 'border border-ink bg-transparent text-ink hover:bg-mist')}
                href={resumeUrl}
                rel="noopener"
                size="lg"
                target="_blank"
                variant={videoUrl ? 'secondary' : 'primary'}
              >
                Download resume
              </Button>
            )}
          </div>
        </div>
      </header>

      {roles.length > 0 && (
        <ol className="site-container">
          {roles.map((role, i) => {
            const logo = role.logo && typeof role.logo === 'object' ? role.logo : null
            return (
              <li
                className={cn(
                  'flex flex-col gap-5 py-8 lg:flex-row lg:gap-8',
                  i === 0 ? 'border-t-2 border-ink' : 'border-t border-rule',
                  i === roles.length - 1 && 'border-b border-b-rule',
                )}
                key={role.id}
              >
                <div className="flex shrink-0 items-start justify-between gap-4 lg:w-[200px] lg:flex-col lg:justify-start lg:gap-[6px]">
                  <div className="flex flex-col gap-[6px]">
                    <p className="type-label text-cobalt">{period(role)}</p>
                    {role.location && (
                      <p className="text-[15px] leading-[18px] text-muted-foreground">
                        {role.location}
                      </p>
                    )}
                  </div>
                  {/* On phones the employer mark sits beside the dates. */}
                  <div className="lg:hidden">
                    <CompanyMark company={role.company} logo={logo} small />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-[14px]">
                  <h2 className="type-h3">{role.role}</h2>
                  {role.summary && <p className="type-body max-w-[680px]">{role.summary}</p>}
                  {(role.outcomes?.length ?? 0) > 0 && (
                    <ul className="flex max-w-[680px] flex-col gap-2">
                      {role.outcomes!.map((outcome, j) => (
                        <li className="flex gap-3" key={outcome.id ?? j}>
                          <span
                            aria-hidden="true"
                            className="mt-[9px] size-2 shrink-0 rounded-pill bg-cobalt"
                          />
                          <span className="type-body text-ink">{outcome.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {role.link?.href && role.link.label && (
                    <TextLink className="self-start text-[17px] leading-[22px]" href={role.link.href}>
                      {role.link.label}
                    </TextLink>
                  )}
                </div>
                <div className="hidden w-[220px] shrink-0 justify-end lg:flex">
                  <CompanyMark company={role.company} logo={logo} />
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {(page?.habits?.length ?? 0) > 0 && (
        <section className="site-container flex flex-col gap-8 pt-[72px] lg:pt-32">
          <SectionHeader eyebrow="How I lead" title="Three habits I bring to a team" />
          <ul className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {page!.habits!.map((habit, i) => (
              <li className="flex flex-col gap-3 rounded-tile bg-mist p-6 lg:p-8" key={habit.id ?? i}>
                <h3 className="type-h4">{habit.title}</h3>
                <p className="type-body">{habit.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="site-container flex flex-col gap-12 pb-[72px] pt-[72px] lg:flex-row lg:gap-16 lg:pb-32 lg:pt-24">
        <LedgerList rows={page?.certifications} title="Certifications" />
        <LedgerList rows={page?.also} title="Also" />
      </section>

      <AudienceRoutes />
    </article>
  )
}

const CompanyMark: React.FC<{
  company: string
  logo: { url?: string | null; width?: number | null; height?: number | null } | null
  small?: boolean
}> = ({ company, logo, small }) =>
  logo?.url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={company}
      className={cn('w-auto object-contain object-right', small ? 'h-6 max-w-[120px]' : 'h-8 max-w-[220px]')}
      height={logo.height ?? 32}
      src={getMediaUrl(logo.url)}
      width={logo.width ?? 120}
    />
  ) : (
    <span
      className={cn(
        'font-display font-extrabold tracking-[-0.03em] text-ink',
        small ? 'text-[20px] leading-6' : 'text-[28px] leading-[34px]',
      )}
    >
      {company}
    </span>
  )
