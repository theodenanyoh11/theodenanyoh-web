import React from 'react'

import type { HomeHeroBlock, SiteSetting } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button, PlayIcon, TextLink } from '@/components/site/Button'
import { Eyebrow } from '@/components/site/Heading'
import { VideoDialog } from '@/components/site/VideoDialog'
import { getCachedGlobal } from '@/utilities/getGlobals'

const fallback = {
  eyebrow: 'Group Product Manager · Founder, KrumaLabs',
  headline: 'A product leader\nwho still ships.',
  intro:
    'I lead product teams in HR software by day. On nights and weekends I design, build and launch my own software, including Cleanly, Tilly and DirectoryHub.',
}

/** Splits the headline so its last word can be set in cobalt. */
const splitHeadline = (headline: string) => {
  const lines = headline.trim().split('\n')
  const lastLine = lines.pop() ?? ''
  const words = lastLine.trim().split(' ')
  const accent = words.pop() ?? ''
  return { lines, lastLineStart: words.join(' '), accent }
}

export const HomeHeroBlockComponent: React.FC<HomeHeroBlock> = async ({
  videoLabel,
  workLabel,
}) => {
  const settings = (await getCachedGlobal('site-settings', 2)()) as SiteSetting | null
  const hero = settings?.hero
  const videoUrl = settings?.videoResume?.url
  const duration = settings?.videoResume?.duration
  const portrait = hero?.portrait && typeof hero.portrait === 'object' ? hero.portrait : null
  const { lines, lastLineStart, accent } = splitHeadline(hero?.headline || fallback.headline)

  return (
    <section className="site-container flex flex-col gap-10 pb-[72px] pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pt-[88px]">
      <div className="flex max-w-[800px] flex-col gap-6 lg:gap-8">
        <Eyebrow>{hero?.eyebrow || fallback.eyebrow}</Eyebrow>
        <h1 className="type-h1">
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
          {lastLineStart} <span className="text-cobalt">{accent}</span>
        </h1>
        <p className="type-lead max-w-[620px]">{hero?.intro || fallback.intro}</p>
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6">
          {videoUrl ? (
            <>
              <VideoDialog
                className="inline-flex items-center justify-center gap-3 rounded-pill bg-cobalt px-6 py-[18px] text-[17px] font-semibold leading-[22px] text-paper transition-colors hover:bg-[#1630e0]"
                title="Video resume"
                url={videoUrl}
              >
                <PlayIcon />
                {videoLabel || 'Watch the 90 second intro'}
              </VideoDialog>
              <TextLink className="text-center text-[17px] leading-[22px]" href="/projects">
                {workLabel || 'See the work'}
              </TextLink>
            </>
          ) : (
            <>
              <Button href="/projects" size="lg">
                {workLabel || 'See the work'}
              </Button>
              <TextLink className="text-center text-[17px] leading-[22px]" href="/experience">
                Experience and resume
              </TextLink>
            </>
          )}
        </div>
      </div>

      {portrait && (
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-tile bg-ink lg:h-[560px] lg:w-[448px]">
          <Media
            fill
            htmlElement={null}
            pictureClassName="absolute inset-0"
            imgClassName="object-cover"
            priority
            resource={portrait}
            size="(min-width: 1024px) 448px, 100vw"
          />
          {videoUrl && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-ink/0 to-ink/80" />
              <VideoDialog
                className="absolute bottom-5 left-5 flex items-center gap-3 rounded-pill bg-paper py-[10px] pl-[10px] pr-5 text-left"
                title="Video resume"
                url={videoUrl}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-cobalt text-paper">
                  <PlayIcon />
                </span>
                <span className="flex flex-col">
                  <span className="text-[16px] font-semibold leading-5 text-ink">Meet Theo</span>
                  <span className="text-[14px] leading-[18px] text-muted-foreground">
                    Video resume{duration ? ` · ${duration}` : ''}
                  </span>
                </span>
              </VideoDialog>
            </>
          )}
        </div>
      )}
    </section>
  )
}
