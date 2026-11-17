import type { Metadata } from 'next'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { Media } from '@/components/Media'
import { AudienceRoutes } from '@/components/site/AudienceRoutes'
import { Button } from '@/components/site/Button'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

export const metadata: Metadata = {
  title: 'About | Theo Denanyoh',
  description:
    'Theo Denanyoh is a product leader and founder. Born in Accra, building in Columbus.',
}

export default async function AboutPage() {
  const settings = (await getCachedGlobal('site-settings', 2)()) as SiteSetting | null
  const about = settings?.about
  const portrait = about?.portrait && typeof about.portrait === 'object' ? about.portrait : null
  const signature = about?.signature && typeof about.signature === 'object' ? about.signature : null
  const story = about?.story ?? []

  return (
    <article>
      <header className="site-container flex flex-col gap-10 pt-12 md:flex-row lg:gap-16 lg:pt-[88px]">
        <div className="flex flex-1 flex-col justify-between gap-8">
          <div className="flex flex-col gap-5">
            <Eyebrow>About</Eyebrow>
            <Heading as="h1">{(about?.headline || 'About Theo').replace(/\.$/, '')}</Heading>
            {about?.intro && <p className="type-lead max-w-[640px]">{about.intro}</p>}
          </div>
          {(about?.facts?.length ?? 0) > 0 && (
            // The fact list is a desktop detail. The phone layout leaves it out.
            <dl className="hidden max-w-[640px] border-t-2 border-ink lg:block">
              {about!.facts!.map((fact, i) => (
                <div
                  className="flex justify-between gap-6 border-b border-rule py-4"
                  key={fact.id ?? i}
                >
                  <dt className="text-[15px] leading-[18px] text-muted-foreground">{fact.label}</dt>
                  <dd className="text-[17px] font-semibold leading-[22px] text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {portrait && (
          <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-tile bg-mist md:w-[320px] lg:h-[640px] lg:w-[520px]">
            <Media
              fill
              htmlElement={null}
              pictureClassName="absolute inset-0"
              imgClassName="object-cover"
              priority
              resource={portrait}
              size="(min-width: 1024px) 520px, 100vw"
            />
          </div>
        )}
      </header>

      <section className="site-container pt-[72px] lg:pt-32">
        {story.length > 0 && (
          <>
            <div className="flex flex-col gap-4 pb-8">
              <Eyebrow>My story</Eyebrow>
              <Heading as="h2">How I got here</Heading>
            </div>
            <ol>
              {story.map((chapter, i) => (
                <li
                  className={cn(
                    'flex flex-col gap-3 py-8 lg:flex-row lg:gap-8',
                    i === 0 ? 'border-t-2 border-ink' : 'border-t border-rule',
                    i === story.length - 1 && 'border-b border-b-rule',
                  )}
                  key={chapter.id ?? i}
                >
                  <p className="type-label shrink-0 text-cobalt lg:w-[200px] lg:pt-[6px]">
                    {chapter.place}
                  </p>
                  <div className="flex max-w-[720px] flex-col gap-3">
                    <h3 className="type-h3">{chapter.title}</h3>
                    <p className="text-[17px] leading-7">{chapter.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
        <div className="flex flex-col items-start gap-8 pb-[72px] pt-10 sm:flex-row sm:items-center lg:pb-32 lg:pl-[232px] lg:pt-14">
          {signature?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Theo"
              className="h-[90px] w-auto lg:h-[110px]"
              height={signature.height ?? 110}
              src={getMediaUrl(signature.url)}
              width={signature.width ?? 200}
            />
          )}
          <Button href="/contact" size="lg">
            Get in touch
          </Button>
        </div>
      </section>

      <AudienceRoutes />
    </article>
  )
}
