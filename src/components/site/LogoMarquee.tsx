import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type LogoItem = {
  name: string
  logo?: MediaType | number | null
  /** Show the name beside the logo, for marks that carry no wordmark. */
  showName?: boolean | null
}

const LogoList: React.FC<{ items: LogoItem[]; hidden?: boolean }> = ({ items, hidden }) => (
  <ul
    aria-hidden={hidden || undefined}
    className="flex shrink-0 items-center gap-14 pr-14 lg:gap-[72px] lg:pr-[72px]"
  >
    {items.map((item, i) => {
      const logo = item.logo && typeof item.logo === 'object' ? item.logo : null
      return (
        <li className="flex shrink-0 items-center gap-[10px]" key={i}>
          {logo?.url ? (
            // Logos are small SVGs with their own colours, so they skip the image optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={item.showName ? '' : item.name}
              className="h-7 w-auto max-w-[220px] object-contain lg:h-8"
              height={logo.height ?? 32}
              loading="lazy"
              src={getMediaUrl(logo.url)}
              width={logo.width ?? 120}
            />
          ) : null}
          {(item.showName || !logo?.url) && (
            <span className="whitespace-nowrap font-display text-[24px] font-bold leading-8 tracking-[-0.03em] text-ink lg:text-[28px]">
              {item.name}
            </span>
          )}
        </li>
      )
    })}
  </ul>
)

/**
 * Scrolling strip of employer and product logos. The list is rendered twice
 * so the loop has no seam. It pauses on hover and stops for reduced motion.
 */
export const LogoMarquee: React.FC<{ label?: string | null; items: LogoItem[] }> = ({
  label,
  items,
}) => {
  if (!items.length) return null

  return (
    <section className="marquee flex flex-col gap-6 overflow-hidden border-y border-rule pb-10 pt-8 lg:pb-12">
      {label && <p className="site-container type-label text-muted-foreground">{label}</p>}
      <div className="marquee-track flex w-max">
        <LogoList items={items} />
        <LogoList hidden items={items} />
      </div>
    </section>
  )
}
