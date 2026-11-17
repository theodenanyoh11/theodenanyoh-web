import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { Wordmark } from '@/components/site/Wordmark'
import { getCachedGlobal } from '@/utilities/getGlobals'

type FooterLink = { label: string; url: string }

export async function Footer() {
  const settings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting | null

  const links: FooterLink[] = [
    ...(settings?.social ?? []).flatMap((item) =>
      item?.label && item?.url ? [{ label: item.label, url: item.url }] : [],
    ),
    ...(settings?.resumeUrl ? [{ label: 'Resume', url: settings.resumeUrl }] : []),
    ...(settings?.bookingUrl ? [{ label: 'Book a call', url: settings.bookingUrl }] : []),
    ...(settings?.contactEmail
      ? [{ label: settings.contactEmail, url: `mailto:${settings.contactEmail}` }]
      : []),
  ]

  return (
    <footer className="mt-auto border-t border-body bg-ink">
      <div className="site-container flex flex-col gap-10 pb-12 pt-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <Wordmark
            className="text-[88px] leading-[76px] lg:text-[120px] lg:leading-[100px]"
            tone="paper"
          />
          <p className="text-[15px] leading-[18px] text-[#C8C8C8]">
            Theo Denanyoh · Columbus, Ohio · Born in Accra
          </p>
        </div>
        {links.length > 0 && (
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  className="text-[15px] font-medium leading-[18px] text-paper hover:text-[#8FA0FF]"
                  href={link.url}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
