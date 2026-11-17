import React from 'react'

import { TextLink } from './Button'
import { Heading } from './Heading'

export type AudienceRoute = { label: string; title: string; linkLabel: string; href: string }

export const defaultAudienceRoutes: AudienceRoute[] = [
  {
    label: 'Hiring a product leader',
    title: 'See how I run a portfolio and grow PMs.',
    linkLabel: 'Experience and resume',
    href: '/experience',
  },
  {
    label: 'Looking for a co-founder',
    title: 'I bring product, design and a working build.',
    linkLabel: 'How I like to partner',
    href: '/about',
  },
  {
    label: 'Need something built',
    title: 'From idea to launched product, with one person accountable.',
    linkLabel: 'Start a project',
    href: '/contact',
  },
]

/** Closing block on ink. Sends each of the three audiences to their next page. */
export const AudienceRoutes: React.FC<{ title?: string | null; routes?: AudienceRoute[] }> = ({
  title,
  routes = defaultAudienceRoutes,
}) => (
  <section className="bg-ink">
    <div className="site-container flex flex-col gap-10 py-[72px] lg:gap-12 lg:py-24">
      <Heading as="h2" className="text-paper" stop={false}>
        {title || 'What brings you here?'}
      </Heading>
      <ul className="grid border-t border-body lg:grid-cols-3">
        {routes.map((route, i) => (
          <li
            className={
              'flex flex-col gap-4 border-body py-8 lg:py-0 lg:pt-8 ' +
              (i > 0 ? 'border-t lg:border-l lg:border-t-0 lg:pl-8 ' : '') +
              (i < routes.length - 1 ? 'lg:pr-8' : '')
            }
            key={i}
          >
            <p className="type-label text-[#8FA0FF]">{route.label}</p>
            <p className="font-display text-[22px] font-bold leading-[26px] tracking-[-0.02em] text-paper lg:text-[24px] lg:leading-7">
              {route.title}
            </p>
            <TextLink
              className="mt-2 text-[16px] leading-5 text-paper hover:text-[#8FA0FF]"
              href={route.href}
            >
              {route.linkLabel}
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  </section>
)
